import { TypeOf } from "zod";
import {
  generateDatabaseDeleteSchema,
  generateDatabaseMutationSchema,
  generateDatabaseUpsertSchema,
} from "./validators/db";
import { messageSchema } from "./validators/messages";

export enum DatabaseMutationOperation {
  Upsert = "Upsert",
  Delete = "Delete",
}

export type Message = TypeOf<typeof messageSchema>;

export type GenerateDatabaseUpsert = TypeOf<
  typeof generateDatabaseUpsertSchema
>;

export type GenerateDatabaseDelete = TypeOf<
  typeof generateDatabaseDeleteSchema
>;

export type GenerateDatabaseMutation = TypeOf<
  typeof generateDatabaseMutationSchema
>;
