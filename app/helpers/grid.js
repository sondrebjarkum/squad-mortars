import App from '../app';

const intervals = {
  mainGrid: 300 / 3 ** 0,
  subGrid: (part) => 300 / 3 ** part,
};

/**
 * Gets Grid Coordinates based on latlng and precision (# of subcoordinates). Precision defaults to map zoom.
 * @param {L.LatLng} latlng
 * @param {{precision: number, maxPrecision: number}} param1
 * @returns
 */
export function getGridCoordinates(
  latlng,
  { precision, maxPrecision } = { precision: 0, maxPrecision: 4 },
) {
  if (!precision) {
    const zoom = App.squadMap.map.getZoom();
    if (zoom > 2) precision = zoom - 3; // TODO: eller - 3? med -2 må jeg påse at griden synes på den precision, ellers -3
    if (precision > maxPrecision) precision = maxPrecision;
  }

  const gridCoordinates = latLngToGridPosition(latlng, precision);
  const [firstCoords, ...subCoords] = gridCoordinates.split('-');

  let coordinates = firstCoords;

  for (let i = 0; i < precision; i++) {
    coordinates += '-' + subCoords[i];
  }

  return coordinates;
}

/**
 * Converts a grid position string into latitude and longitude coordinates.
 * Supports unlimited amount of sub-keypads.
 * Throws an error if the grid position string is too short or parsing results in invalid coordinates.
 * @param {string} gridPosition - The grid coordinates, e.g. "A02-3-5-2".
 * @param {number} precision - How many subgrids to add together (defaults to 4)
 * @returns {{lat: number, lng: number}} An object containing the latitude and longitude.
 */
export function gridPositionToLatLng(gridPosition, precision = 4) {
  const subGridCells = 9;
  const parts = gridPosition.split('-');

  const firstCoordinates = parts[0];
  const gridLetter = firstCoordinates[0].charCodeAt(0);
  const gridNumber = parseInt(firstCoordinates.slice(1), 10);

  let x =
    (gridLetter >= 97 ? gridLetter - 97 + 26 : gridLetter - 65) *
    intervals.mainGrid;
  let y = (gridNumber - 1) * intervals.mainGrid;

  // Add all subgrids to x y
  for (let part = 1; part <= precision; part++) {
    const sub = parseInt(parts[part], 10) || 5; // 5 = default to center of grid
    const subX = (sub - 1) % 3;
    const subY = Math.floor((subGridCells - sub) / 3);
    const s = intervals.subGrid(part);
    x += subX * s;
    y += subY * s;
  }

  return {
    lat: -y / App.squadMap.mapToGameScale,
    lng: x / App.squadMap.mapToGameScale,
  };
}

export function latLngToGridPosition({ lat, lng }, precision = 4) {
  const x = lng * App.squadMap.mapToGameScale;
  const y = -lat * App.squadMap.mapToGameScale;

  const kpCharCode = 65 + Math.floor(x / intervals.mainGrid);
  const kpLetter = String.fromCharCode(
    kpCharCode > 90 ? kpCharCode + 6 : kpCharCode,
  );
  const kpNumber = Math.floor(y / intervals.mainGrid) + 1;

  let gridPosition = `${kpLetter}${kpNumber}`;

  for (let part = 1; part <= precision; part++) {
    const subY = Math.floor(y / intervals.subGrid(part)) % 3;
    let subNumber = 10 - (subY + 1) * 3;
    subNumber += Math.floor(x / intervals.subGrid(part)) % 3;
    gridPosition += '-' + subNumber;
  }

  return gridPosition;
}

/**
 * Parses the initial part of the grid position string.
 * @param {string} part - The initial part of the grid position string.
 * @returns {Object} An object containing the letter index and keypad number.
 */
function parseInitialPart(part) {
  const letterCode = part.charCodeAt(0);
  if (letterCode < 65) {
    return { letterIndex: -1, keypadNumber: -1 };
  }
  const letterIndex = letterCode - 65;
  const keypadNumber = Number(part.slice(1)) - 1;
  return { letterIndex, keypadNumber };
}
