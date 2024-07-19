import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, createContext } from "react";
import { AccountProvider } from "./AccountContext";
import { DatabaseProvider, DatabaseProviderProps } from "./DatabaseContext";
import { WebsocketProvider } from "./WebsocketContext";

const LofikContext = createContext({});

type Props = {
  children: ReactNode;
  websocketServerUrl?: string;
} & DatabaseProviderProps;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnReconnect: false, refetchOnWindowFocus: false },
  },
});

export const LofikProvider = ({
  children,
  loader,
  websocketServerUrl,
  ...dbProps
}: Props) => {
  return (
    <LofikContext.Provider value={{}}>
      <QueryClientProvider client={queryClient}>
        <DatabaseProvider loader={loader} {...dbProps}>
          <AccountProvider loader={loader}>
            <WebsocketProvider websocketServerUrl={websocketServerUrl}>
              {children}
            </WebsocketProvider>
          </AccountProvider>
        </DatabaseProvider>
      </QueryClientProvider>
    </LofikContext.Provider>
  );
};
