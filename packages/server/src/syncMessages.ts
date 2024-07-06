import { Message } from "@prisma/client";
import { io } from "./io";
import { prisma } from "./prisma";
import { SocketConnection } from "./types";

type MessagesToSyncParams = {
  messagesToSync: Message[];
  socketConnection: SocketConnection;
};

export const syncMessages = async ({
  messagesToSync,
  socketConnection: { deviceId, socketId },
}: MessagesToSyncParams) => {
  if (!messagesToSync.length) {
    return;
  }

  const sortedMessages = messagesToSync
    .map((m) => ({ ...m, ts: m.ts.getTime() }))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  try {
    await io
      .to(socketId)
      .timeout(Number(process.env.SYNC_TIMEOUT_MS) || 10000)
      .emitWithAck("messages", sortedMessages);

    console.log(`pushing ${messagesToSync.length} to ${deviceId}`);

    for (const message of sortedMessages) {
      const ackedDeviceIds = message.ackedDeviceIds.split(",");

      await prisma.message.update({
        where: { id: message.id },
        data: {
          ackedDeviceIds: [...ackedDeviceIds, deviceId]
            .filter(Boolean)
            .join(","),
        },
      });
    }
  } catch (err) {
    console.error(err);
  }
};
