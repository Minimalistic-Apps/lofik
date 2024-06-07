import {
  DatabaseMutationOperation,
  useLofikAccount,
  useLofikMutation,
  useLofikQueryClient,
} from "@lofik/react";
import { useEffect, useState } from "react";
import { getTodosQueryKey } from "./queryKeys";
import { Todo as TodoType } from "./types";

type Props = {
  todo: TodoType;
};
export const Todo = ({ todo }: Props) => {
  const [value, setValue] = useState(todo.title);
  const { pubKeyHex } = useLofikAccount();
  const queryClient = useLofikQueryClient();

  const { mutate } = useLofikMutation({
    shouldSync: true,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTodosQueryKey(pubKeyHex) });
    },
  });

  useEffect(() => {
    setValue(todo.title);
  }, [todo]);

  return (
    <div key={todo.id}>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button
        onClick={() =>
          mutate({
            operation: DatabaseMutationOperation.Upsert,
            tableName: "todos",
            columnDataMap: {
              id: todo.id,
              title: value,
              pubKeyHex,
              deletedAt: null,
              updatedAt: Date.now(),
              createdAt: todo.createdAt,
            },
          })
        }
      >
        update
      </button>
      <button
        onClick={() =>
          mutate({
            operation: DatabaseMutationOperation.Delete,
            tableName: "todos",
            identifierValue: todo.id,
          })
        }
      >
        delete
      </button>
    </div>
  );
};
