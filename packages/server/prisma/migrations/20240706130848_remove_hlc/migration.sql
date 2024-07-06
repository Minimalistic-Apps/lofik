/*
  Warnings:

  - You are about to drop the column `hlc` on the `Message` table. All the data in the column will be lost.
  - Added the required column `ts` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pubKeyHex" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "ackedDeviceIds" TEXT NOT NULL,
    "ts" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Message" ("ackedDeviceIds", "createdAt", "deviceId", "id", "nonce", "payload", "pubKeyHex") SELECT "ackedDeviceIds", "createdAt", "deviceId", "id", "nonce", "payload", "pubKeyHex" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_key_check("Message");
PRAGMA foreign_keys=ON;
