import { define, html, } from "hybrids";

function fireChangeEvent(host, value, eventSuffix) {
  const event = new CustomEvent('x-select-change#' + eventSuffix, {
    detail: { value },
  });
  document.dispatchEvent(event);
}

const XSelect = {
  tag: "x-select",
  name: "",
  render: ({ children, name }) => {
    const options = [...children].map(child => {
      if (child.tagName === 'OPTION') {
        return child;
      }
      return null;
    });

    return html`
    <select onchange="${(host, event) => {
        fireChangeEvent(host, event.target.value, name);
      }}">
      ${options}
    </select>
  `;
  },
};

define(XSelect);
