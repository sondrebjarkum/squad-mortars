
import html from "../helpers/html";

class SelectBoxComponent extends HTMLElement {
  constructor() {
    super();

    // Attach a shadow root to the element.
    // this.attachShadow({ mode: 'open' });

    // // Define the HTML structure as a string.
    // const template = html`
    //   <select>
    //     <slot></slot>
    //   </select>
    // `;

    // // Set the innerHTML of the shadow root.
    // this.shadowRoot.innerHTML = template;

    // // Add an event listener to fire a custom event on change.
    // this.shadowRoot.querySelector('select').addEventListener('change', (event) => {
    //   const customEvent = new CustomEvent('select-change', {
    //     detail: {
    //       // @ts-ignore
    //       value: event.target.value
    //     }
    //   });
    //   document.dispatchEvent(customEvent);
    // });
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'closed' })
    root.innerHTML = `
      <button hx-get="/my-component-clicked" hx-target="next div">Click me!</button>
      <div></div>
    `
    htmx.process(root) // Tell HTMX about this component's shadow DOM
  }
}

// Define the new element.
customElements.define('sq-select', SelectBoxComponent);
