import { WsprMessagePayload } from "./WsprMessagePayload";

type WsprMessage = {
  payload: WsprMessagePayload;
  frequency: number;
  timestamp: Date;
};
