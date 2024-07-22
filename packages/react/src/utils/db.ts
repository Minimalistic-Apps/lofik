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

    const sql = `insert into ${tableName} (${columns.join(
      ","
    )}, updatedAt) values (${values
      .map((v) => (v === null ? "null" : `'${v}'`))
      .join(",")},'${
      ts
    }') on conflict (${identifierColumn}) do update set ${updateClause},updatedAt='${
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
    const sql = `update ${tableName} set deletedAt = '${ts}', updatedAt = '${ts}' where ${identifierColumn} = '${identifierValue}'`;

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

  const record =
    await sqlocal.sql`select * from ${mutation.tableName} where ${identifierColumn} = '${identifierValue}'`;

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
  const pendingUpdates =
    await sqlocal.sql`select * from pendingUpdates order by id`;

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
      await sqlocal.sql`delete from pendingUpdates where id = ${update.id}`;
    }
  } catch (err) {
    console.error(err);
  }
};
