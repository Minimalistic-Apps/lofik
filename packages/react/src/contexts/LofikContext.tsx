import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, createContext, useEffect, useState } from "react";
import { SQLocal } from "sqlocal";
import { baseCreate } from "../db/baseCreate";
import { baseSeed } from "../db/baseSeed";
import { sqlocal } from "../db/sqlocal";
import { AccountProvider } from "./AccountContext";
import { WebsocketProvider } from "./WebsocketContext";

const LofikContext = createContext({});

type Props = {
  children: ReactNode;
  websocketServerUrl?: string;
  loader?: ReactNode;
  databaseInit?: string[];
  runMigrations?: (sqlocal: SQLocal) => Promise<void>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnReconnect: false, refetchOnWindowFocus: false },
  },
});

export const LofikProvider = ({
  children,
  loader,
  websocketServerUrl,
  databaseInit,
  runMigrations,
}: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const prepareDatabase = async () => {
      await baseCreate();
      await baseSeed();

      if (databaseInit) {
        for (const sql of databaseInit) {
          await sqlocal.sql(sql);
        }
      }

      await runMigrations?.(sqlocal);

      setIsLoading(false);
    };

    prepareDatabase();
  }, [databaseInit, runMigrations]);

  if (isLoading) {
    return loader || null;
  }

  return (
    <LofikContext.Provider value={{}}>
      <QueryClientProvider client={queryClient}>
        <AccountProvider loader={loader}>
          <WebsocketProvider websocketServerUrl={websocketServerUrl}>
            {children}
          </WebsocketProvider>
        </AccountProvider>
      </QueryClientProvider>
    </LofikContext.Provider>
  );
};
