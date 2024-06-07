import { ReactNode, createContext, useState } from "react";
import { useAccountContext } from "../hooks/contexts";
import { getUnixTimestamp } from "../utils/dates";

export type HLC = {
  ts: number;
  count: number;
  deviceId: string;
};

type HlcContext = {
  hlc: HLC;
  setHlc: React.Dispatch<React.SetStateAction<HLC>>;
};

export const HlcContext = createContext({} as HlcContext);

type Props = {
  children: ReactNode;
};

export const HlcProvider = ({ children }: Props) => {
  const { deviceId } = useAccountContext();
  const [hlc, setHlc] = useState<HLC>({
    ts: getUnixTimestamp(),
    count: 0,
    deviceId,
  });

  return (
    <HlcContext.Provider value={{ hlc, setHlc }}>
      {children}
    </HlcContext.Provider>
  );
};
