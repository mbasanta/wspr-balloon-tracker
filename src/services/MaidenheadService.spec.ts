import { describe, expect, it } from "vitest";
import { gridSquareToCoordinates } from "./MaidenheadService";

describe("MaidenheadService.gridSquareToCoordinates", () => {
  it.each([
    { gridSquare: "JN58td", expectedCoordinates: [48.1458, 11.625] },
    { gridSquare: "GF15vc", expectedCoordinates: [-34.8958, -56.2083] },
    { gridSquare: "FM18lw", expectedCoordinates: [38.9375, -77.0417] },
    { gridSquare: "RE78ir", expectedCoordinates: [-41.2708, 174.7083] },
    { gridSquare: "FN31pr", expectedCoordinates: [41.7292, -72.7083] },
    { gridSquare: "CM87wj", expectedCoordinates: [37.3958, -122.125] },
    { gridSquare: "EM75kb", expectedCoordinates: [35.0625, -85.125] },
    { gridSquare: "IO91xm", expectedCoordinates: [51.5208, -0.0417] },
    { gridSquare: "GM22xn", expectedCoordinates: [32.5625, -54.0417] },
    { gridSquare: "IO93", expectedCoordinates: [53, -2] },
    { gridSquare: "EM77", expectedCoordinates: [37, -86] },
  ])(
    "should convert a valid Maidenhead grid square to coordinates correctly",
    ({ gridSquare, expectedCoordinates }) => {
      const result = gridSquareToCoordinates(gridSquare);
      expect(result.Lat).toBeCloseTo(expectedCoordinates[0], 4);
      expect(result.Long).toBeCloseTo(expectedCoordinates[1], 4);
    }
  );

  it("should handle invalid grid square inputs gracefully", () => {
    const invalidGridSquare = "XXX";
    expect(() => {
      gridSquareToCoordinates(invalidGridSquare);
    }).toThrow("Invalid grid square");
  });
});
