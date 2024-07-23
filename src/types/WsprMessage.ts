import { WsprMessagePayload } from "./WsprMessagePayload";

export type WsprMessage = {
  payload: WsprMessagePayload;
  frequency: number;
  timestamp: Date;
};
