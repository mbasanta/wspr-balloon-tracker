export type DecodedWsprData = {
  timestamp: Date;
  callsign: string;
  locator: string;
  dBm: number;
  altitude?: number;
  temperature?: number;
  voltage?: number;
  speed?: number;
  gpsValid: boolean;
  lat: number;
  long: number;
};
