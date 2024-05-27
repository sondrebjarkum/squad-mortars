export default function html(strings, ...values) {
  return String.raw({ raw: strings }, ...values);
}

/**
 * Converts an object of attributes to a string representation.
 *
 * @example
 *   const attributes = {
 *     id: 'myElement',
 *     class: 'container',
 *     disabled: true,
 *   };
 *   const attributesString = toAttributesString(attributes);
 *   // Result: 'id="myElement" class="container" disabled'
 *
 * @param {object} attrs - The object containing attributes.
 * @returns {string} - A string representation of attributes for use in HTML.
 */
export function objectToAttributes(attrs) {
  return Object.keys(attrs)
    .map((key) =>
      attrs[key] === '' ? key : !attrs[key] ? '' : `${key}="${attrs[key]}"`,
    )
    .join(' ');
}
