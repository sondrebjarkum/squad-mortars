import './styles/style.css'
import html from "./helpers/html.js"
import App from './app.js'

document.querySelector('#app').innerHTML = html`
    <div class="container">
      <div id="map"></div>
    </div>
`
App.init()
