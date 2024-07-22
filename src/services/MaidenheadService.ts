import { LatLong } from "../types/LatLong";

export function gridSquareToCoordinates(gridSquare: string): LatLong {
  const charA = "A".charCodeAt(0);

  if (gridSquare.length !== 4 && gridSquare.length !== 6) {
    throw new Error("Invalid grid square");
  }

  let gridSquareUpper = gridSquare.toUpperCase();
  let lon = -180;
  let lat = -90;

  let baseLat = (gridSquareUpper.charCodeAt(1) - charA) * 10;
  let detailLat = parseInt(gridSquareUpper[3]);
  lat += baseLat + detailLat;

  if (gridSquareUpper.length === 6) {
    lat += (gridSquareUpper.charCodeAt(5) - charA) / 24 + 1 / 48;
  }

  let baseLon = (gridSquareUpper.charCodeAt(0) - charA) * 20;
  let detailLon = parseInt(gridSquareUpper[2]) * 2;
  lon += baseLon + detailLon;

  if (gridSquareUpper.length === 6) {
    lon += (gridSquareUpper.charCodeAt(4) - charA) / 12 + 1 / 24;
  }

  return { Lat: lat, Long: lon };
}
