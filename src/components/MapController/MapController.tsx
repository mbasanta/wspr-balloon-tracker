import { useEffect } from "react";
import { useMap } from "react-leaflet";
import WsprLocation from "../../classes/WsprLocation";

export default function MapController(props: { wsprData: WsprLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (props.wsprData.length > 0) {
      const lat = props.wsprData.reduce((sum, wsprData) => {
        return sum + wsprData.lat;
      }, 0);
      const long = props.wsprData.reduce((sum, wsprData) => {
        return sum + wsprData.long;
      }, 0);
      map.setView([lat / props.wsprData.length, long / props.wsprData.length]);
    }
  }, [props.wsprData]);

  return null;
}
