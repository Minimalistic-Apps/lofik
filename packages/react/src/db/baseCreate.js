export const baseCreate = (db) => {
  db.exec("PRAGMA foreign_keys=on");

  db.exec(`
      CREATE TABLE IF NOT EXISTS device (
        id VARCHAR(40) PRIMARY KEY,
        createdAt INTEGER NOT NULL
      );
    `);

  db.exec(`
        CREATE TABLE IF NOT EXISTS accounts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          privKey TEXT NOT NULL,
          pubKey TEXT NOT NULL,
          updatedAt INTEGER NOT NULL,
          createdAt INTEGER NOT NULL
      );
    `);

  db.exec(`
      CREATE TABLE IF NOT EXISTS pendingUpdates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        updatedAt INTEGER NOT NULL,
        createdAt INTEGER NOT NULL
      );
    `);
};
