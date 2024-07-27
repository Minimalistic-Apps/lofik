import { Socket } from "socket.io-client";
import { z } from "zod";
import { sqlocal } from "../db/sqlocal";
import {
  DatabaseMutationOperation,
  GenerateDatabaseDelete,
  GenerateDatabaseMutation,
  GenerateDatabaseUpsert,
} from "../types";

export const utils = {
  generateUpsert: (
    {
      tableName,
      columnDataMap,
      identifierColumn = "id",
    }: GenerateDatabaseUpsert,
    ts: number
  ) => {
    const columns = Object.keys(columnDataMap);
    const values = Object.values(columnDataMap);

    const updateClause = columns
      .map((column, i) =>
        values[i] === null ? `${column}=null` : `${column}='${values[i]}'`
      )
      .join(",");

    const sql = `INSERT INTO ${tableName} (${columns.join(
      ","
    )}, updatedAt) VALUES (${values
      .map((v) => (v === null ? "null" : `'${v}'`))
      .join(",")},'${
      ts
    }') ON CONFLICT (${identifierColumn}) DO UPDATE SET ${updateClause},updatedAt='${
      ts
    }';`;

    return sql;
  },
  generateDelete: (
    {
      tableName,
      identifierValue,
      identifierColumn = "id",
    }: GenerateDatabaseDelete,
    ts: number
  ) => {
    const sql = `UPDATE ${tableName} SET deletedAt = '${ts}', updatedAt = '${ts}' WHERE ${identifierColumn} = '${identifierValue}'`;

    return sql;
  },
};

export const handleRemoteDatabaseMutation = async ({
  ts,
  mutation,
}: {
  ts: number;
  mutation: GenerateDatabaseMutation;
}) => {
  const identifierColumn = mutation.identifierColumn || "id";
  const identifierValue =
    mutation.operation === DatabaseMutationOperation.Upsert
      ? mutation.columnDataMap[identifierColumn]
      : mutation.identifierValue;

  const record = await sqlocal.sql(
    `SELECT * FROM ${mutation.tableName} WHERE ${identifierColumn} = '${identifierValue}'`
  );

  if (
    record[0] &&
    new Date(z.number().parse(record[0].updatedAt)) >= new Date(ts)
  ) {
    return;
  }

  const sql =
    mutation.operation === DatabaseMutationOperation.Upsert
      ? utils.generateUpsert(mutation, ts)
      : utils.generateDelete(mutation, ts);

  await sqlocal.sql(sql);
};

export const pushPendingUpdates = async (socket: Socket) => {
  const pendingUpdates = await sqlocal.sql(
    "SELECT * FROM pendingUpdates ORDER BY id"
  );

  if (!pendingUpdates.length) {
    return;
  }

  try {
    await socket.timeout(10000).emitWithAck(
      "messages",
      pendingUpdates.flatMap((update) =>
        JSON.parse(z.string().parse(update.message))
      )
    );

    for (const update of pendingUpdates) {
      await sqlocal.sql(`DELETE FROM pendingUpdates WHERE id = ${update.id}`);
    }
  } catch (err) {
    console.error(err);
  }
};
