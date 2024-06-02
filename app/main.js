import './styles/style.css';
import './components/counter.js';
import './components/input.js';
import './components/select.js';
import html from './helpers/html.js';
import App from './app.js';

document.querySelector('#app').innerHTML = html`
  <div class="container">
    <div id="map"></div>
    <div>
      <label>Layer</label>
      <x-select name="map-picker">
        <option value="Kohat">Kohat</option>
        <option value="Anvil">Anvil</option>
        <option value="Narva">Narva</option>
      </x-select>
    </div>
    <div>
      <label>Add mortar/target</label>
      <x-input
        name="mortar-target-grid-coordinates"
        value="A02-3-5-2"
      ></x-input>
    </div>
  </div>
`;

App.init();

document.addEventListener(
  'x-select-change#map-picker',
  (/** @type {CustomEvent}*/ event) => {
    const { value } = event.detail;
    App.squadMap.setLayer(value);
  },
);

document.addEventListener(
  'x-input-enter#mortar-target-grid-coordinates',
  (/** @type {CustomEvent}*/ event) => {
    const { value } = event.detail;
    App.addMarkerByGridPosition(value);
  },
);
