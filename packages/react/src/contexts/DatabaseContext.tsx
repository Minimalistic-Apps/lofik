import { OpfsDatabase, Sqlite3Static } from "@sqlite.org/sqlite-wasm";
import * as comlink from "comlink";
import { ReactNode, createContext, useEffect, useState } from "react";
import { DB_NAME } from "../constants";
import { useLofikQueryClient } from "../hooks/useLofikQueryClient";

type DatabaseContext = {
  db: comlink.Remote<OpfsDatabase>;
  exportDatabase: () => Promise<void>;
  importDatabase: (byteArray: ArrayBuffer) => Promise<void>;
};

type WorkerApi = {
  db: comlink.Remote<OpfsDatabase>;
  sqlite3: comlink.Remote<Sqlite3Static>;
};

export const DatabaseContext = createContext({} as DatabaseContext);

export type DatabaseProviderProps = {
  create?: string[];
  seed?: string[];
  migrate?: (db: comlink.Remote<OpfsDatabase>) => Promise<void>;
  loader?: ReactNode;
};

type Props = {
  children: ReactNode;
} & DatabaseProviderProps;

export const DatabaseProvider = ({
  children,
  create,
  seed,
  migrate,
  loader,
}: Props) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [workerApi, setWorkerApi] = useState<WorkerApi>();
  const queryClient = useLofikQueryClient();

  useEffect(() => {
    const worker = new Worker(new URL("../db/worker.js", import.meta.url), {
      type: "module",
    });

    worker.onmessage = async (ev) => {
      if (ev.data.type === "dbInitReady") {
        worker.postMessage({
          type: "dbPrepare",
          payload: {
            create,
            seed,
          },
        });
      }

      if (ev.data.type === "dbPrepared") {
        const workerApi = comlink.wrap(worker) as unknown as WorkerApi;

        await migrate?.(workerApi.db);

        setIsInitializing(false);
        setWorkerApi(() => workerApi);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exportDatabase = async () => {
    // @ts-expect-error
    const byteArray = await workerApi.sqlite3.capi.sqlite3_js_db_export(
      await workerApi?.db.pointer
    );

    const blob = new Blob([byteArray.buffer], {
      type: "application/x-sqlite3",
    });
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = window.URL.createObjectURL(blob);
    a.download = "lofextra.sqlite3";
    a.addEventListener("click", function () {
      setTimeout(function () {
        window.URL.revokeObjectURL(a.href);
        a.remove();
      }, 500);
    });
    a.click();
  };

  const importDatabase = async (byteArray: ArrayBuffer) => {
    // @ts-expect-error
    await workerApi.sqlite3.oo1.OpfsDb.importDb(DB_NAME, byteArray);

    // @ts-expect-error
    await workerApi.db.exec("delete from device");

    // @ts-expect-error
    await workerApi.db.exec(
      // @ts-expect-error
      `insert into device (id, createdAt) values ('${crypto.randomUUID()}', strftime('%s', 'now')*1000)`
    );

    await queryClient.invalidateQueries();
  };

  // this is a better approach for exporting the database
  // but unfortunately not supported in some major browsers yet
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker#browser_compatibility

  // const exportDatabase = async () => {
  //   const opfsRoot = await navigator.storage.getDirectory();

  //   const fileHandle = await opfsRoot.getFileHandle(DB_NAME);

  //   try {
  //     const saveHandle = await showSaveFilePicker({
  //       suggestedName: "lofextra.sqlite3",
  //     });

  //     const writable = await saveHandle.createWritable();

  //     await writable.write(await fileHandle.getFile());

  //     await writable.close();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <DatabaseContext.Provider
      value={{
        db: workerApi?.db as comlink.Remote<OpfsDatabase>,
        exportDatabase,
        importDatabase,
      }}
    >
      {isInitializing ? loader || null : children}
    </DatabaseContext.Provider>
  );
};
