import './styles/style.css'
import html from "./helpers/html.js"
import { setupMap } from './map.js'

document.querySelector('#app').innerHTML = html`
  <div>
    <p>test</p>
    <div id="map"></div>
  </div>
`

setupMap()
