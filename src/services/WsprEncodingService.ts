import { WsprData } from "../types/WsprData";
import { WsprExTelemData } from "../types/WsprExTelemData";

// Reference:
// https://qrp-labs.com/flights/s4#protocol
// https://github.com/Krounet/gnuradio-WSPR/blob/development/WSPR_Coding_Process.pdf

const CHAR_A = "A".charCodeAt(0);
const ALPHABET_LENGTH = 26;
const CALL_BASE = 1068;
const SUBSQUARE_BASE = 24;
const GRID_1_BASE = 18;
const GRID_2_BASE = 10;
const POWER_BASE = 19;
const BATTERY_RANGE = 40;
const SPEED_RANGE = 42;
const GPS_BIT = 2;
const SATS_BIT = 2;
const POWERS: { [key: number]: number } = {
  0: 0,
  3: 1,
  7: 2,
  10: 3,
  13: 4,
  17: 5,
  20: 6,
  23: 7,
  27: 8,
  30: 9,
  33: 10,
  37: 11,
  40: 12,
  43: 13,
  47: 14,
  50: 15,
  53: 16,
  57: 17,
  60: 18,
};

export function decodeWsprMessagePayload(payload: WsprData): WsprExTelemData {
  let call2 = payload.tx_sign.charAt(1);
  let call2AsInt = parseInt(call2);
  let call2Value = call2AsInt ? call2AsInt : call2.charCodeAt(0) - CHAR_A + 10;

  let call4 = payload.tx_sign.charCodeAt(3);
  let call5 = payload.tx_sign.charCodeAt(4);
  let call6 = payload.tx_sign.charCodeAt(5);

  let call4Value = call4 - CHAR_A;
  let call5Value = call5 - CHAR_A;
  let call6Value = call6 - CHAR_A;

  let callValue =
    ALPHABET_LENGTH ** 3 * call2Value +
    ALPHABET_LENGTH ** 2 * call4Value +
    ALPHABET_LENGTH * call5Value +
    call6Value;

  let grid5IntVal = Math.trunc(callValue / (CALL_BASE * SUBSQUARE_BASE));
  let grid5 = String.fromCharCode(grid5IntVal + CHAR_A);

  callValue = callValue - grid5IntVal * (CALL_BASE * SUBSQUARE_BASE);

  let grid6IntVal = Math.trunc(callValue / CALL_BASE);
  let grid6 = String.fromCharCode(grid6IntVal + CHAR_A);

  let grid56 = grid5 + grid6;

  callValue = callValue - grid6IntVal * CALL_BASE;

  let altitude = callValue * 20;

  let locator1 = payload.tx_locator.charCodeAt(0);
  let locator2 = payload.tx_locator.charCodeAt(1);

  let locator1Value = locator1 - CHAR_A;
  let locator2Value = locator2 - CHAR_A;

  let locator3Value = parseInt(payload.tx_locator.charAt(2));
  let locator4Value = parseInt(payload.tx_locator.charAt(3));
  let power = payload.tx_power;

  let locatorPowerValue =
    locator1Value * GRID_1_BASE * GRID_2_BASE ** 2 * POWER_BASE +
    locator2Value * GRID_2_BASE ** 2 * POWER_BASE +
    locator3Value * GRID_2_BASE * POWER_BASE +
    locator4Value * POWER_BASE +
    POWERS[power];

  let tempRaw = Math.trunc(
    locatorPowerValue / (BATTERY_RANGE * SPEED_RANGE * GPS_BIT * SATS_BIT)
  );
  let temperature = 100 * ((5 * (tempRaw * 2 + 457)) / 1024 - 2.73);

  locatorPowerValue =
    locatorPowerValue -
    tempRaw * (BATTERY_RANGE * SPEED_RANGE * GPS_BIT * SATS_BIT);

  let voltRaw = Math.trunc(
    locatorPowerValue / (SPEED_RANGE * GPS_BIT * SATS_BIT)
  );
  let voltage = (5 * (voltRaw * 10 + 614)) / 1024;

  let speedRaw =
    locatorPowerValue - voltRaw * (SPEED_RANGE * GPS_BIT * SATS_BIT);
  let speedRawInt = Math.trunc(speedRaw / (GPS_BIT * SATS_BIT));
  let speed = speedRawInt * 2;

  let gpsStatusRaw = speedRaw - speedRawInt * (GPS_BIT * SATS_BIT);
  let gpsValid = Math.trunc(gpsStatusRaw / 2) === 1;
  let gpsSatsGood = gpsStatusRaw % 2 === 1;

  return {
    gridSuffix: grid56,
    altitude,
    temperature,
    voltage,
    speed,
    gpsValid,
    gpsSatsGood,
  };
}
