import { WsprExTelemData } from "../types/WsprExTelemData";
import { WsprMessagePayload } from "../types/WsprMessagePayload";

export function decodeWsprMessagePayload(
  payload: WsprMessagePayload
): WsprExTelemData {
  const charA = "A".charCodeAt(0);
  const charZ = "Z".charCodeAt(0);
  const char0 = "0".charCodeAt(0);

  let call2 = payload.callsign.charCodeAt(1);

  if (charA <= call2 && call2 <= charZ) {
    var foo = 10 + call2 - charA;
  } else {
    var foo = call2 - char0;
  }

  return {
    gridSuffix: "",
    altitude: 0,
    temperature: 0,
    voltage: 0,
    speed: 0,
    gpsValid: false,
  };
}
