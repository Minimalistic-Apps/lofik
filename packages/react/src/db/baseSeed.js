import { generateNewAccountKeyPair } from "../utils/account";

export const getCurrentAccountPubKey = (db) => {
  const data = db.selectObjects(
    "select * from accounts order by id desc limit 1"
  );

  return data[0]?.pubKey;
};

const seedAccount = (db) => {
  const currentPubKey = getCurrentAccountPubKey(db);

  if (currentPubKey) {
    return;
  }

  const { privKey, pubKey } = generateNewAccountKeyPair();

  db.exec(
    `insert into accounts (privKey, pubKey, createdAt, updatedAt) values ('${privKey}', '${pubKey}', strftime('%s', 'now')*1000, strftime('%s', 'now')*1000)`
  );
};

const seedDevice = (db) => {
  const data = db.selectObjects("select * from device");

  if (!data[0]) {
    db.exec(
      `insert into device (id, createdAt) values ('${crypto.randomUUID()}', strftime('%s', 'now')*1000)`
    );
  }
};

export const baseSeed = (db) => {
  seedDevice(db);
  seedAccount(db);
};
