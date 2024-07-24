import { useEffect, useState } from "react";
import "./App.css";
import { mergeWsprData } from "./services/WsprDataService";
import { DecodedWsprData } from "./types/DecodedWsprData";

function App() {
  const [wsprData, setWsprData] = useState<DecodedWsprData[]>([]);

  useEffect(() => {
    /*
    getBaseWsprData().then((data) => {
      console.log(data)
    });
    getTelemetryWsprData().then((data) => {
      console.log(data)
    });
    */
    mergeWsprData().then((data) => {
      setWsprData(data);
    });
  }, []);

  let tableData = wsprData.map((row: DecodedWsprData, index: number) => {
    return (
      <tr key={index}>
        <td>{row.timestamp.toISOString()}</td>
        <td>{row.callsign}</td>
        <td>{row.dBm}</td>
        <td>{row.locator}</td>
        <td>{row.altitude ? row.altitude : ""}</td>
        <td>{row.speed ? row.speed : ""}</td>
        <td>{row.temperature ? Math.round(row.temperature * 10) / 10 : ""}</td>
        <td>{row.voltage ? Math.round(row.voltage * 100) / 100 : ""}</td>
      </tr>
    );
  });

  return <table>{tableData}</table>;
}

export default App;
