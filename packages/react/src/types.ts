import { TypeOf } from "zod";
import {
  generateDatabaseDeleteSchema,
  generateDatabaseMutationSchema,
  generateDatabaseSortSchema,
  generateDatabaseUpsertSchema,
} from "./validators/db";
import { messageSchema } from "./validators/messages";

export enum DatabaseMutationOperation {
  Upsert = "Upsert",
  Delete = "Delete",
  Sort = "Sort",
}

export type Message = TypeOf<typeof messageSchema>;

export type GenerateDatabaseUpsert = TypeOf<
  typeof generateDatabaseUpsertSchema
>;

export type GenerateDatabaseDelete = TypeOf<
  typeof generateDatabaseDeleteSchema
>;

export type GenerateDatabaseSort = TypeOf<typeof generateDatabaseSortSchema>;

export type GenerateDatabaseMutation = TypeOf<
  typeof generateDatabaseMutationSchema
>;
