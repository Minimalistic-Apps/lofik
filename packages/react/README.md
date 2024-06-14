# lofik react

To see lofik being used in a demo app, have a look at the [examples](https://github.com/pycan-jouza/lofik/tree/master/examples)

## Basic usage

> [!IMPORTANT]
> To make persistent storage (OPFS) work, these two headers are required
> `Cross-Origin-Opener-Policy: same-origin` > `Cross-Origin-Embedder-Policy: require-corp`

Use `LofikProvider` at the top of your app:

```
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
      seed={[]} // array of sql queries
      loader={<div>loading..</div>}
      migrate={async (db) => {}}
      websocketServerUrl="ws://localhost:8080"
    >
     {children}
    </LofikProvider>
```

Then make use of the following hooks. The library is written in typescript, autocomplete will help you a lot.

- `useLofikAccount`
- `useLofikAccountActions`
- `useLofikDatabase`
- `useLofikMutation`
- `useLofikQuery`
- `useLofikQueryClient`
