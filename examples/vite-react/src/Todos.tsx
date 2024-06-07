import {
  DatabaseMutationOperation,
  useLofikAccount,
  useLofikMutation,
  useLofikQuery,
  useLofikQueryClient,
} from "@lofik/react";
import { useState } from "react";
import { Todo } from "./Todo";
import { getTodosQueryKey } from "./queryKeys";
import { todosValidator } from "./validators";

export const Todos = () => {
  const { pubKeyHex } = useLofikAccount();
  const [newTodo, setNewTodo] = useState("");
  const queryClient = useLofikQueryClient();
  const todosQueryKey = getTodosQueryKey(pubKeyHex);

  const { mutate } = useLofikMutation({
    shouldSync: true,
    onSuccess: () => {
      setNewTodo("");
      queryClient.invalidateQueries({ queryKey: todosQueryKey });
    },
  });

  const { data } = useLofikQuery({
    sql: `select * from todos where pubKeyHex = '${pubKeyHex}' and deletedAt is null order by createdAt desc`,
    schema: todosValidator,
    queryKey: todosQueryKey,
  });

  return (
    <div className="todos">
      <div>
        <input
          placeholder="add todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button
          onClick={() =>
            mutate({
              operation: DatabaseMutationOperation.Upsert,
              tableName: "todos",
              columnDataMap: {
                id: crypto.randomUUID(),
                title: newTodo,
                pubKeyHex,
                deletedAt: null,
                updatedAt: Date.now(),
                createdAt: Date.now(),
              },
            })
          }
        >
          add
        </button>
      </div>

      <div>
        {data?.map((todo) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
};
