import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import WsprLocation from "../../classes/WsprLocation";

import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import classes from "./WsprLocationsMap.module.css";

export default function WsprLocationsMap(props: { wsprData: WsprLocation[] }) {
  const [position, setPosition] = useState({ lat: 38, lng: -84.5 });
  const [pointIcons, setPointIcons] = useState<JSX.Element[]>([]);

  const icon = new Icon({
    iconUrl: "./map-dot.svg",
    iconSize: [35, 35],
  });

  useEffect(() => {
    if (props.wsprData.length > 0) {
      let pointIcons = props.wsprData
        .filter((wsprData) => wsprData.gpsValid)
        .map((wsprData) => {
          return (
            <Marker
              icon={icon}
              position={{ lat: wsprData.lat, lng: wsprData.long }}
            >
              <Popup>
                <div>
                  <p>{wsprData.callsign}</p>
                  <p>{wsprData.locator}</p>
                  <p>{wsprData.dBm} dBm</p>
                  <p>{wsprData.altitude} m</p>
                </div>
              </Popup>
            </Marker>
          );
        });
      setPointIcons(pointIcons);
    }
  }, [props.wsprData]);

  return (
    <MapContainer
      className={classes.wsprLocationsMap}
      center={position}
      zoom={9}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pointIcons}
    </MapContainer>
  );
}
