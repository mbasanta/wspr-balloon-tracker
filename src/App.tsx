import { useEffect, useState } from "react";
import "./App.css";
import WsprLocation from "./classes/WsprLocation";
import WsprLocationsTable from "./components/WsprLocationsTable/WsprLocationsTable";
import { mergeWsprData } from "./services/WsprDataService";

function App() {
  const [wsprData, setWsprData] = useState<WsprLocation[]>([]);

  useEffect(() => {
    mergeWsprData().then((data) => {
      setWsprData(data);
    });
  }, []);

  return <WsprLocationsTable wsprData={wsprData} />;
}

export default App;
