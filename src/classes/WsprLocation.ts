import { gridSquareToCoordinates } from "../services/MaidenheadService";

export default class WsprLocation {
  timestamp: Date;
  callsign: string;
  locator: string;
  dBm: number;
  gpsValid: boolean;

  hasTelemetry: boolean = false;

  lat: number;
  long: number;

  altitude?: number;
  temperature?: number;
  voltage?: number;
  speed?: number;

  constructor(
    timestamp: Date,
    callsign: string,
    locator: string,
    dBm: number,
    gpsValid: boolean
  ) {
    this.timestamp = timestamp;
    this.callsign = callsign;
    this.locator = locator;
    this.dBm = dBm;
    this.gpsValid = gpsValid;

    let latLong = gridSquareToCoordinates(locator);
    this.lat = latLong.Lat;
    this.long = latLong.Long;
  }
}
