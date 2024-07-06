import { useContext } from "react";
import { AccountContext } from "../contexts/AccountContext";
import { DatabaseContext } from "../contexts/DatabaseContext";
import { WebsocketContext } from "../contexts/WebsocketContext";

export const useDatabaseContext = () => {
  const ctx = useContext(DatabaseContext);

  if (!ctx) {
    throw new Error("Not inside DatabaseContext!");
  }

  return ctx;
};

export const useAccountContext = () => {
  const ctx = useContext(AccountContext);

  if (!ctx) {
    throw new Error("Not inside AccountContext!");
  }

  return ctx;
};

export const useWebsocketContext = () => {
  const ctx = useContext(WebsocketContext);

  if (!ctx) {
    throw new Error("Not inside WebsocketContext!");
  }

  return ctx;
};
