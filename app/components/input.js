import { define, html } from 'hybrids';
import { objectToAttributes } from '../helpers/html';

function fireChangeEvent(host, value, eventSuffix) {
  const event = new CustomEvent('x-input-change#' + eventSuffix, {
    detail: { value },
  });
  document.dispatchEvent(event);
}

function fireEnterEvent(host, value, isEnter, eventSuffix) {
  if (isEnter) {
    const event = new CustomEvent('x-input-enter#' + eventSuffix, {
      detail: { value },
    });
    document.dispatchEvent(event);
  }
}

const XInput = {
  tag: 'x-input',
  name: '',
  render: ({ name, ...attrs }) => {
    const attibutes = objectToAttributes(attrs);
    return html`
      <input
        name="name"
        ${attibutes}
        oninput="${(host, event) => {
          fireChangeEvent(host, event.target.value, name);
        }}"
        onkeydown="${(host, event) => {
          fireEnterEvent(host, event.target.value, event.key === 'Enter', name);
        }}"
      />
    `;
  },
};

define(XInput);
