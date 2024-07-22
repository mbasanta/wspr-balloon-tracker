import { useEffect, useState } from "react";
import "./App.css";
import { mergeWsprData } from "./services/WsprDataService";

function App() {
  const [wsprData, setWsprData] = useState<any>([]);

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
      console.log(Object.values(data));
      setWsprData(Object.values(data));
    });
  });

  let tableData = wsprData.map((row: any, index: number) => (
    <tr key={index}>
      <td>{row[0].toISOString()}</td>
      <td>{row[2]}</td>
      <td>{row[3]}</td>
      <td>{row[4]}</td>
    </tr>
  ));

  return <table>{tableData}</table>;
}

export default App;
