import App from '../app';

/**
 * Converts a grid position string into latitude and longitude coordinates.
 * Supports unlimited amount of sub-keypads.
 * Throws an error if the grid position string is too short or parsing results in invalid coordinates.
 * @param {string} gridPosition - The keypad coordinates, e.g. "A02-3-5-2".
 * @returns {Object} An object containing the latitude and longitude.
 */
export function gridPositionToLatLng(gridPosition) {
  const kp = 300 / 3 ** 0; // interval of main keypad, e.g "A5"
  const s1 = 300 / 3 ** 1;
  const s2 = 300 / 3 ** 2;
  const s3 = 300 / 3 ** 3;
  const s4 = 300 / 3 ** 4;
  // const s5 = 300 / 3 ** 5;

  // Split the keypad coordinates
  const parts = gridPosition.split('-');
  const mainKeypad = parts[0];
  const sub1 = parts.length > 1 ? parseInt(parts[1], 10) : 5;
  const sub2 = parts.length > 2 ? parseInt(parts[2], 10) : 5;
  const sub3 = parts.length > 3 ? parseInt(parts[3], 10) : 5;
  const sub4 = parts.length > 4 ? parseInt(parts[4], 10) : 5;
  // const sub5 = parts.length > 5 ? parseInt(parts[5], 10) : 5;

  // Main keypad calculations
  const kpLetter = mainKeypad[0];
  const kpNumber = parseInt(mainKeypad.slice(1), 10);

  const kpCharCode = kpLetter.charCodeAt(0);
  const xMain =
    (kpCharCode >= 97 ? kpCharCode - 97 + 26 : kpCharCode - 65) * kp;
  const yMain = (kpNumber - 1) * kp;

  const gridSize = 9;

  let x = xMain;
  let y = yMain;

  if (sub1 !== null) {
    const sub1X = (sub1 - 1) % 3;
    const sub1Y = Math.floor((gridSize - sub1) / 3);
    x += sub1X * s1;
    y += sub1Y * s1;
  }

  if (sub2 !== null) {
    const sub2X = (sub2 - 1) % 3;
    const sub2Y = Math.floor((gridSize - sub2) / 3);
    x += sub2X * s2;
    y += sub2Y * s2;
  }

  if (sub3 !== null) {
    const sub3X = (sub3 - 1) % 3;
    const sub3Y = Math.floor((gridSize - sub3) / 3);
    x += sub3X * s3;
    y += sub3Y * s3;
  }

  if (sub4 !== null) {
    const sub4X = (sub4 - 1) % 3;
    const sub4Y = Math.floor((gridSize - sub4) / 3);
    x += sub4X * s4;
    y += sub4Y * s4;
  }

  // if (sub5 !== null) {
  //   const sub5X = (sub5 - 1) % 3;
  //   const sub5Y = Math.floor((10 - sub5) / 3);
  //   x += sub5X * s5;
  //   y += sub5Y * s5;
  // }

  return {
    lat: -y / App.squadMap.mapToGameScale,
    lng: x / App.squadMap.mapToGameScale,
  };
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

/**
 * Parses a sub-keypad part of the grid position string.
 * @param {string} part - The sub-keypad part of the grid position string.
 * @returns {number} The sub-keypad number.
 */
function parseSubKeypad(part) {
  return Number(part);
}

/**
 * Gets the coordinates of a sub-keypad based on its number.
 * @param {number} subKeypadNumber - The sub-keypad number.
 * @returns {Object} An object containing the sub-keypad X and Y coordinates.
 */
function getSubKeypadCoordinates(subKeypadNumber) {
  const subX = (subKeypadNumber - 1) % 3;
  const subY = 2 - Math.floor((subKeypadNumber - 1) / 3);
  return { subX, subY };
}

/**
 * Formats the keypad input by setting text to uppercase and adding dashes.
 * @param {string} text - The keypad string to be formatted.
 * @returns {string} The formatted string.
 */
function formatKeypad(text = '') {
  if (text.length === 0) {
    throw new Error('Keypad string cannot be empty.');
  }

  const upperText = text.toUpperCase().split('-').join('');
  const formattedParts = [upperText.slice(0, 3)];

  for (let i = 3; i < upperText.length; i++) {
    formattedParts.push(upperText[i]);
  }

  return formattedParts.join('-');
}
