import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import WsprLocation from "../../classes/WsprLocation";

import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import MapController from "../MapController/MapController";
import classes from "./WsprLocationsMap.module.css";

export default function WsprLocationsMap(props: { wsprData: WsprLocation[] }) {
  const [pointIcons, setPointIcons] = useState<JSX.Element[]>([]);

  const icon = new Icon({
    iconUrl: "./map-dot.svg",
    iconSize: [35, 35],
  });

  useEffect(() => {
    if (props.wsprData.length > 0) {
      let pointIcons = props.wsprData
        .filter((wsprData) => wsprData.gpsValid)
        .map((wsprData, index) => {
          return (
            <Marker
              key={index}
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

  const displayMap = useMemo(() => {
    return (
      <MapContainer
        className={classes.wsprLocationsMap}
        center={[0, 0]}
        zoom={4}
        scrollWheelZoom={true}
      >
        <MapController wsprData={props.wsprData} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pointIcons}
      </MapContainer>
    );
  }, [pointIcons]);

  return <div className={classes.wsprLocationsMapContainer}>{displayMap}</div>;
}
