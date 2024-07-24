import { DecodedWsprData } from "../types/DecodedWsprData";
import axiosClient from "./AxiosClient";
import { gridSquareToCoordinates } from "./MaidenheadService";
import { decodeWsprMessagePayload } from "./WsprEncodingService";

function createBaseWsprQuery() {
  return `
SELECT 
    time,
    toMinute(time) % 10 as minutes,
    tx_sign,
    substring(tx_loc, 1, 4) as grid,
    power,
    rx_sign,
    rx_loc,
    frequency
FROM wspr.rx 
WHERE
    band = 14
    and minutes = 8
    and time >= '2024-07-08+04:00:00'
    and tx_sign = 'KY4EOD'
ORDER BY time DESC
FORMAT JSONCompact`;
}

function createTelemetryWsprQuery() {
  return `
SELECT
    time,
    toMinute(time) % 10 as minutes,
    tx_sign,
    tx_loc,
    power,
    rx_sign,
    rx_loc,
    frequency
FROM wspr.rx
WHERE
    band = 14
    and minutes = 0
    and time >= '2024-07-08+04:00:00'
    and substring(tx_sign, 1, 1) = '1'
    and substring(tx_sign, 3, 1) = '0'
ORDER BY time DESC
FORMAT JSONCompact
    `;
}

async function queryWsprApi(query: string): Promise<any> {
  return new Promise((resolve, reject) => {
    axiosClient
      .get(`/?query=${encodeURI(query)}`)
      .catch((error) => {
        console.error("Error fetching WSPR data", error);
        reject(error);
      })
      .then((response: any) => {
        resolve(response.data);
      });
  });
}

function formatWsprData(
  data: any,
  rxIndex: number,
  adjustTime: boolean = false
): any {
  let formatedData = data.reduce(function (acc: any, item: any) {
    let timestring = item[0].split(" ").join("T") + "Z";
    let timestamp = new Date(timestring);
    timestring = timestamp.toISOString();
    if (adjustTime) {
      timestamp.setMinutes(timestamp.getMinutes() - 2);
      timestring = timestamp.toISOString();
    }
    if (!acc[timestring]) {
      acc[timestring] = [
        timestamp,
        ...item.slice(1, rxIndex),
        [item.slice(rxIndex)],
      ];
    } else {
      acc[timestring][rxIndex].push([...item.slice(rxIndex)]);
    }
    return acc;
  }, {});
  return formatedData;
}

export async function getTelemetryWsprData(): Promise<any> {
  const query = createTelemetryWsprQuery();
  return new Promise((resolve, reject) => {
    queryWsprApi(query)
      .catch((error) => {
        console.error("Error fetching WSPR Telemetry data", error);
        reject(error);
      })
      .then((data) => {
        let rows = formatWsprData(data.data, 5, true);
        resolve(rows);
      });
  });
}

export async function getBaseWsprData(): Promise<any> {
  const query = createBaseWsprQuery();
  return new Promise((resolve, reject) => {
    queryWsprApi(query)
      .catch((error) => {
        console.error("Error fetching WSPR Base data", error);
        reject(error);
      })
      .then((data) => {
        let rows = formatWsprData(data.data, 5);
        resolve(rows);
      });
  });
}

export async function mergeWsprData(): Promise<DecodedWsprData[]> {
  return Promise.all([getBaseWsprData(), getTelemetryWsprData()]).then(
    (data) => {
      //merge the data based on the timestamp
      const [baseData, telemetryData] = data;
      let mergedData: { [key: string]: DecodedWsprData } = {};

      Object.keys(baseData).forEach((timestamp) => {
        if (telemetryData.hasOwnProperty(timestamp)) {
          let encodedWsprMessagePayload = {
            callsign: telemetryData[timestamp][2],
            locator: telemetryData[timestamp][3],
            dBm: telemetryData[timestamp][4],
          };

          let decodedWsprData = decodeWsprMessagePayload(
            encodedWsprMessagePayload
          );

          let fullGrid = baseData[timestamp][3] + decodedWsprData.gridSuffix;
          let latLong = gridSquareToCoordinates(fullGrid);

          mergedData[timestamp] = {
            timestamp: baseData[timestamp][0],
            callsign: baseData[timestamp][2],
            locator: fullGrid,
            dBm: baseData[timestamp][4],
            altitude: decodedWsprData.altitude,
            temperature: decodedWsprData.temperature,
            voltage: decodedWsprData.voltage,
            speed: decodedWsprData.speed,
            gpsValid: decodedWsprData.gpsValid,
            lat: latLong.Lat,
            long: latLong.Long,
          };
        } else {
          let latLong = gridSquareToCoordinates(baseData[timestamp][3]);

          mergedData[timestamp] = {
            timestamp: baseData[timestamp][0],
            callsign: baseData[timestamp][2],
            locator: baseData[timestamp][3],
            dBm: baseData[timestamp][4],
            altitude: undefined,
            temperature: undefined,
            voltage: undefined,
            speed: undefined,
            gpsValid: false,
            lat: latLong.Lat,
            long: latLong.Long,
          };
        }
      });

      return Object.values(mergedData);
    }
  );
}
