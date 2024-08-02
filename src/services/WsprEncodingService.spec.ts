import { describe, expect, it } from "vitest";
import { decodeWsprMessagePayload } from "./WsprEncodingService";

const timestamp = new Date("2024-07-08T04:00:00Z");
const minutes = 0;
const rx_data: any[] = [];

describe("WsprEncodingService.decodeWsprMessagePayload", () => {
  it.each([
    {
      payload: {
        tx_sign: "0C0QRY",
        tx_locator: "HK52",
        tx_power: 23,
        timestamp,
        minutes,
        rx_data,
      },
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
      payload: {
        tx_sign: "160KUQ",
        tx_locator: "FF43",
        tx_power: 33,
        timestamp,
        minutes,
        rx_data,
      },
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
      payload: {
        tx_sign: "0C0QQE",
        tx_locator: "RG74",
        tx_power: 43,
        timestamp,
        minutes,
        rx_data,
      },
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
      payload: {
        tx_sign: "190CHR",
        tx_locator: "II16",
        tx_power: 50,
        timestamp,
        minutes,
        rx_data,
      },
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
    {
      payload: {
        tx_sign: "100INX",
        tx_locator: "KH21",
        tx_power: 13,
        timestamp,
        minutes,
        rx_data,
      },
      expectedResults: {
        gridSuffix: "AF",
        altitude: 8580,
        temperature: 0.93,
        voltage: 4.8,
        speed: 22,
        gpsValid: true,
        gpsSatsGood: true,
      },
    },
    {
      payload: {
        tx_sign: "1I0RXS",
        tx_locator: "GE85",
        tx_power: 0,
        timestamp,
        minutes,
        rx_data,
      },
      expectedResults: {
        gridSuffix: "MT",
        altitude: 12000,
        temperature: -19.58,
        voltage: 4.76,
        speed: 22,
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
