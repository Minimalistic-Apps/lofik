import { Message } from "@prisma/client";
import { socketConnectionsMap } from "./connections";
import { deserialize } from "./hlc";
import { prisma } from "./prisma";
import { syncMessages } from "./syncMessages";
import { PubKey, messagesSchema } from "./validators";

type NotifyAllConnectedDevicesWithSamePubKey = {
  pubKeyHex: PubKey;
  socketId: string;
  createdMessages: Message[];
};

const notifyAllConnectedDevicesWithSamePubKey = async ({
  pubKeyHex,
  socketId,
  createdMessages,
}: NotifyAllConnectedDevicesWithSamePubKey) => {
  const socketConnectionsToSync = socketConnectionsMap
    .get(pubKeyHex)
    ?.filter((connection) => connection.socketId !== socketId);

  if (!socketConnectionsToSync?.length) {
    return;
  }

  for (const socketConnectionToSync of socketConnectionsToSync) {
    await syncMessages({
      messagesToSync: createdMessages,
      socketConnection: socketConnectionToSync,
    });
  }
};

const handleNewMessages = async (rawMessages: unknown, ack: () => void) => {
  const createdMessages: Message[] = [];

  for (const message of messagesSchema.parse(rawMessages)) {
    const { pubKeyHex, payload, nonce, hlc } = message;

    const newMessage = await prisma.message.create({
      data: {
        payload,
        pubKeyHex,
        nonce,
        deviceId: deserialize(hlc).deviceId,
        hlc,
        ackedDeviceIds: "",
      },
    });

    createdMessages.push(newMessage);
  }

  console.log(
    `received ${createdMessages.length} from ${deserialize(createdMessages[0].hlc).deviceId}`
  );

  ack();

  return createdMessages;
};

export const registerOnMessagesHandler =
  (pubKeyHex: PubKey, socketId: string) =>
  async (rawMessages: unknown, ack: () => void) => {
    const createdMessages = await handleNewMessages(rawMessages, ack);

    await notifyAllConnectedDevicesWithSamePubKey({
      pubKeyHex,
      socketId,
      createdMessages,
    });
  };

export const registerFullSyncHandler =
  (pubKeyHex: PubKey, socketId: string) =>
  async (rawMessages: unknown, ack: () => void) => {
    await prisma.message.deleteMany({ where: { pubKeyHex } });

    const createdMessages = await handleNewMessages(rawMessages, ack);

    await notifyAllConnectedDevicesWithSamePubKey({
      pubKeyHex,
      socketId,
      createdMessages,
    });
  };
