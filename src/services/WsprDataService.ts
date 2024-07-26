import WsprLocation from "../classes/WsprLocation";
import { WsprData } from "../types/WsprData";
import axiosClient from "./AxiosClient";
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

async function queryWsprApi(query: string): Promise<(string | number)[]> {
  return new Promise((resolve, reject) => {
    axiosClient
      .get(`/?query=${encodeURI(query)}`)
      .catch((error) => {
        console.error("Error fetching WSPR data", error);
        reject(error);
      })
      .then((response: any) => {
        resolve(response.data.data);
      });
  });
}

function formatWsprData(
  data: (string | number)[],
  adjustTime: boolean = false
): { [key: string]: WsprData } {
  let formatedData = data.reduce(function (acc: any, item: any) {
    let timestring = item[0].split(" ").join("T") + "Z";
    let timestamp = new Date(timestring);
    timestring = timestamp.toISOString();

    if (adjustTime) {
      timestamp.setMinutes(timestamp.getMinutes() - 2);
      timestring = timestamp.toISOString();
    }

    if (!acc[timestring]) {
      acc[timestring] = {
        timestamp,
        minutes: item[1],
        tx_sign: item[2],
        tx_locator: item[3],
        tx_power: item[4],
        rx_data: [
          {
            rx_sign: item[5],
            rx_locator: item[6],
            frequency: item[7],
          },
        ],
      };
    } else {
      acc[timestring].rx_data.push({
        rx_sign: item[5],
        rx_locator: item[6],
        frequency: item[7],
      });
    }

    return acc;
  }, {});

  return formatedData;
}

export async function getTelemetryWsprData(): Promise<{
  [key: string]: WsprData;
}> {
  const query = createTelemetryWsprQuery();
  return new Promise((resolve, reject) => {
    queryWsprApi(query)
      .catch((error) => {
        console.error("Error fetching WSPR Telemetry data", error);
        reject(error);
      })
      .then((data) => {
        let rows = formatWsprData(data ?? [], true);
        resolve(rows);
      });
  });
}

export async function getBaseWsprData(): Promise<{
  [key: string]: WsprData;
}> {
  const query = createBaseWsprQuery();
  return new Promise((resolve, reject) => {
    queryWsprApi(query)
      .catch((error) => {
        console.error("Error fetching WSPR Base data", error);
        reject(error);
      })
      .then((data) => {
        let rows = formatWsprData(data ?? []);
        resolve(rows);
      });
  });
}

export async function mergeWsprData(): Promise<WsprLocation[]> {
  return Promise.all([getBaseWsprData(), getTelemetryWsprData()]).then(
    (data) => {
      //merge the data based on the timestamp
      const [baseData, telemetryData] = data;
      let mergedData: { [key: string]: WsprLocation } = {};

      Object.keys(baseData).forEach((timestamp) => {
        if (telemetryData.hasOwnProperty(timestamp)) {
          let decodedWsprData = decodeWsprMessagePayload(
            telemetryData[timestamp]
          );

          mergedData[timestamp] = new WsprLocation(
            baseData[timestamp].timestamp,
            baseData[timestamp].tx_sign,
            baseData[timestamp].tx_locator + decodedWsprData.gridSuffix,
            baseData[timestamp].tx_power,
            decodedWsprData.gpsValid
          );

          mergedData[timestamp].hasTelemetry = true;
          mergedData[timestamp].altitude = decodedWsprData.altitude;
          mergedData[timestamp].temperature = decodedWsprData.temperature;
          mergedData[timestamp].voltage = decodedWsprData.voltage;
          mergedData[timestamp].speed = decodedWsprData.speed;
        } else {
          mergedData[timestamp] = new WsprLocation(
            baseData[timestamp].timestamp,
            baseData[timestamp].tx_sign,
            baseData[timestamp].tx_locator,
            baseData[timestamp].tx_power,
            false
          );
        }
      });

      return Object.values(mergedData);
    }
  );
}
