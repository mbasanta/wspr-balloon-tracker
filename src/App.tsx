import { useEffect, useState } from "react";
import "./App.css";
import WsprLocation from "./classes/WsprLocation";
import WsprLocationsMap from "./components/WsprLocationsMap/WsprLocationsMap";
import WsprLocationsTable from "./components/WsprLocationsTable/WsprLocationsTable";
import { mergeWsprData } from "./services/WsprDataService";

function App() {
  const [wsprData, setWsprData] = useState<WsprLocation[]>([]);

  useEffect(() => {
    mergeWsprData().then((data) => {
      setWsprData(data);
    });
  }, []);

  return (
    <>
      <WsprLocationsMap wsprData={wsprData} />
      <WsprLocationsTable wsprData={wsprData} />
    </>
  );
}

export default App;
