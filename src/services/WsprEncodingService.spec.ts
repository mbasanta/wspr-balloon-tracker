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
    {
      payload: { callsign: "160KUQ", locator: "FF43", dBm: 33 },
      expectedResults: {
        gridSuffix: "EJ",
        altitude: 12240,
        temperature: -24.46,
        voltage: 4.9,
        speed: 26,
        gpsValid: true,
        gpsSatsGood: true,
      },
    },
    {
      payload: { callsign: "0C0QQE", locator: "RG74", dBm: 43 },
      expectedResults: {
        gridSuffix: "IQ",
        altitude: 80,
        temperature: 36.08,
        voltage: 3.83,
        speed: 0,
        gpsValid: true,
        gpsSatsGood: true,
      },
    },
    {
      payload: { callsign: "190CHR", locator: "II16", dBm: 50 },
      expectedResults: {
        gridSuffix: "GF",
        altitude: 12060,
        temperature: -7.86,
        voltage: 3.0,
        speed: 78,
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
      expect(result.temperature).toBeCloseTo(expectedResults.temperature, 2);
      expect(result.voltage).toBeCloseTo(expectedResults.voltage, 2);
      expect(result.speed).toBe(expectedResults.speed);
      expect(result.gpsValid).toBe(expectedResults.gpsValid);
      expect(result.gpsSatsGood).toBe(expectedResults.gpsSatsGood);
    }
  );
});
