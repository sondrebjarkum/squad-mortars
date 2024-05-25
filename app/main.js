import './styles/style.css'
// import './components/select.js'; 
import html from "./helpers/html.js"
import App from './app.js'
// import { setupMap } from './map.js'

document.querySelector('#app').innerHTML = html`
    <div class="container">
      <div id="map"></div>
      <sq-select>
        <option value="anvil">Anvil</option>
        <option value="chora">Chora</option>
      </sq-select>
    </div>
`
App.init()
// setupMap()
