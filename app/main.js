import './styles/style.css';
import './components/counter.js';
import './components/select.js';
import html from './helpers/html.js';
import App from './app.js';

document.querySelector('#app').innerHTML = html`
  <div class="container">
    <div id="map"></div>
    <x-select name="map-picker">
      <option value="Kohat">Kohat</option>
      <option value="Anvil">Anvil</option>
      <option value="Narva">Narva</option>
    </x-select>
  </div>
`;

App.init();

document.addEventListener('x-select-change#map-picker', (event) => {
  const { value } = event.detail;
  App.map.setLayer(value);
});
