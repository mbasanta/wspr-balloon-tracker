import { WsprRxData } from "./WsprRxData";

export type WsprData = {
  timestamp: Date;
  minutes: number;
  tx_sign: string;
  tx_locator: string;
  tx_power: number;
  rx_data: WsprRxData[];
};
