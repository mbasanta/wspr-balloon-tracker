import { useEffect, useState } from "react";
import "./App.css";
import WsprLocationsTable from "./components/LocationsTable/LocationsTable";
import { mergeWsprData } from "./services/WsprDataService";
import { DecodedWsprData } from "./types/DecodedWsprData";

function App() {
  const [wsprData, setWsprData] = useState<DecodedWsprData[]>([]);

  useEffect(() => {
    mergeWsprData().then((data) => {
      setWsprData(data);
    });
  }, []);

  return <WsprLocationsTable wsprData={wsprData} />;
}

export default App;
