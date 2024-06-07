import { TypeOf } from "zod";
import { todoValidator } from "./validators";

export type Todo = TypeOf<typeof todoValidator>;
