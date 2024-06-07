import * as comlink from "comlink";

import sqlite3InitModule from "@sqlite.org/sqlite-wasm";
import { DB_NAME } from "../constants";
import { baseCreate } from "./baseCreate";
import { baseSeed } from "./baseSeed";

const initSqlite = async () => {
  try {
    const sqlite3 = await sqlite3InitModule();

    if (!("opfs" in sqlite3)) {
      throw new Error("OPFS not suppored");
    }

    const db = new sqlite3.oo1.OpfsDb(DB_NAME, "c");

    baseCreate(db);
    baseSeed(db);

    self.onmessage = (ev) => {
      if (ev.data.type === "dbPrepare") {
        const { create, seed } = ev.data.payload;

        for (const sql of [...(create ?? []), ...(seed ?? [])]) {
          db.exec(sql);
        }

        self.postMessage({ type: "dbPrepared" });
      }
    };

    comlink.expose({ db, sqlite3 });

    self.postMessage({ type: "dbInitReady" });
  } catch (err) {
    console.error("Initialization error:", err);
  }
};

initSqlite();
