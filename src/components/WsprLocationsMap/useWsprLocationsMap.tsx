import { useEffect, useState } from "react";
import WsprLocation from "../../classes/WsprLocation";

export default function useWsprLocationsMap(props: {
  wsprData: WsprLocation[];
}) {
  const [position, setPosition] = useState({ lat: 38, lng: -84.5 });

  useEffect(() => {
    if (props.wsprData.length > 0) {
      setPosition({
        lat: props.wsprData[0].lat,
        lng: props.wsprData[0].long,
      });
    }
  }, [props.wsprData]);

  return { position };
}
