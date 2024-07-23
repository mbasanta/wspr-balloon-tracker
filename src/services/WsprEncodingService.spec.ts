import { describe, expect, it } from "vitest";
import { decodeWsprMessagePayload } from "./WsprEncodingService";

describe("WsprEncodingService.decodeWsprMessagePayload", () => {
  it.each([
    {
      payload: { callsign: "0C0QRY", locator: "HK52", dBm: 23 },
      expectedResults: {
        gridSuffix: "IQ",
        altitude: 1000,
        temperature: -12.75,
        voltage: 4.17,
        speed: 0,
        gpsValid: true,
        gpsSatsGood: true,
      },
    },
  ])(
    "should convert a valid Maidenhead grid square to coordinates correctly",
    ({ payload, expectedResults }) => {
      const result = decodeWsprMessagePayload(payload);
      expect(result.gridSuffix).toBe(expectedResults.gridSuffix);
      expect(result.altitude).toBe(expectedResults.altitude);
      expect(result.temperature).toBeCloseTo(expectedResults.temperature);
      expect(result.voltage).toBeCloseTo(expectedResults.voltage);
      expect(result.speed).toBe(expectedResults.speed);
      expect(result.gpsValid).toBe(expectedResults.gpsValid);
      expect(result.gpsSatsGood).toBe(expectedResults.gpsSatsGood);
    }
  );
});
