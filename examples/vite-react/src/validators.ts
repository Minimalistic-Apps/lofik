import { z } from "zod";

export const todoValidator = z.object({
  id: z.string(),
  title: z.string(),
  pubKeyHex: z.string(),
  deletedAt: z.number().nullable(),
  updatedAt: z.number(),
  createdAt: z.number(),
});

export const todosValidator = z.array(todoValidator);
