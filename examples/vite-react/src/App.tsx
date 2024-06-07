import { LofikProvider } from "@lofik/react";
import "./App.css";
import { Mnemonic } from "./Mnemonic";
import { Todos } from "./Todos";

function App() {
  return (
    <LofikProvider
      create={[
        // updatedAt column is required to determine if database operation should be applied
        `
        CREATE TABLE IF NOT EXISTS todos (
          id VARCHAR(40) PRIMARY KEY,
          title TEXT NOT NULL,
          pubKeyHex TEXT NOT NULL,
          deletedAt INTEGER,
          updatedAt INTEGER NOT NULL,
          createdAt INTEGER NOT NULL
        );
      `,
      ]}
      //  seed={[]}
      loader={<div>loading..</div>}
      //  migrate={async () => {}}
      websocketServerUrl="ws://localhost:8080"
    >
      <Mnemonic />
      <Todos />
    </LofikProvider>
  );
}

export default App;
