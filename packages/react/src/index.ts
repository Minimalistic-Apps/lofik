import { OpfsDatabase as OpfsDatabaseLib } from "@sqlite.org/sqlite-wasm";

export { Remote } from "comlink";
export { LofikProvider } from "./contexts/LofikContext";
export { useLofikAccount } from "./hooks/useLofikAccount";
export { useLofikAccountActions } from "./hooks/useLofikAccountActions";
export { useLofikDatabase } from "./hooks/useLofikDatabase";
export { useLofikMutation } from "./hooks/useLofikMutation";
export { useLofikQuery } from "./hooks/useLofikQuery";
export { useLofikQueryClient } from "./hooks/useLofikQueryClient";
export {
  DatabaseMutationOperation,
  GenerateDatabaseDelete,
  GenerateDatabaseMutation,
  GenerateDatabaseUpsert,
} from "./types";

export type OpfsDatabase = OpfsDatabaseLib;
