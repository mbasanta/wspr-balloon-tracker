import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import WsprLocation from "../../classes/WsprLocation";
import useWsprLocationsMap from "./useWsprLocationsMap";

import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import classes from "./WsprLocationsMap.module.css";

export default function WsprLocationsMap(props: { wsprData: WsprLocation[] }) {
  const { wsprData } = props;
  const { position } = useWsprLocationsMap({ wsprData });

  const icon = new Icon({
    iconUrl: "./map-dot.svg",
    iconSize: [35, 35],
  });

  return (
    <MapContainer
      className={classes.wsprLocationsMap}
      center={position}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker icon={icon} position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
