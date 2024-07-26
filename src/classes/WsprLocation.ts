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

  altitudeInFeet(): number | undefined {
    return this.altitude ? this.altitude * 3.2808399 : undefined;
  }

  temperatureInFahrenheit(): number | undefined {
    return this.temperature ? (this.temperature * 9) / 5 + 32 : undefined;
  }

  speedInMph(): number | undefined {
    return this.speed ? this.speed * 1.15077945 : undefined;
  }

  speedInKph(): number | undefined {
    return this.speed ? this.speed * 1.852 : undefined;
  }
}
