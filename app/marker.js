import L from 'leaflet';
import autoBind from './helpers/auto-bind';

export default class MarkerBase extends L.Marker {
  options = {
    draggable: true,
    riseOnHover: true,
    keyboard: false,
    animate: true,
    id: Math.random().toString(16).slice(2),
    instanceName: this.constructor.name,
  };

  /**
   *
   * @param {L.LatLng} latlng
   * @param {import("./map").SquadMap} map
   * @param {L.MarkerOptions} options
   */
  constructor(latlng, map, options) {
    super(latlng, options);
    this.instanceName = this.constructor.name;
    this.latlng = latlng;
    this.squadMap = map;
    this.id = Math.random().toString(16).slice(2);

    this.on('dragstart', this._handleDragStart, this);
    this.on('dragend', this._handleDragEnd, this);
    // this.on('click', (e) => console.log('dbclick', e));

    autoBind(this);
    console.log('this.options.instanceName:', this.options.instanceName);
    document.dispatchEvent(
      new CustomEvent('created#' + this.options.instanceName),
    );
  }

  /**
   *
   * @param {L.Marker} marker
   */
  addToMap(marker) {
    console.log('marker.getLatLng():', marker.getLatLng());
    if (this.outOfBounds(marker.getLatLng())) {
      // throw new Error('Marker out of bounds');
    }
    return this.squadMap.addMarker(marker);
  }

  /**
   * Force a given event to stay inside the map bounds
   */
  outOfBounds(latlng) {
    return (
      latlng.lng > this.squadMap.tileSize ||
      latlng.lat < -this.squadMap.tileSize ||
      latlng.lng < 0 ||
      latlng.lat > 0
    );
  }

  keepOnMap(e) {
    const { tileSize } = this.squadMap;
    if (e.latlng.lng > tileSize) {
      e.latlng.lng = tileSize;
    }
    if (e.latlng.lat < -tileSize) {
      e.latlng.lat = -tileSize;
    }
    if (e.latlng.lng < 0) {
      e.latlng.lng = 0;
    }
    if (e.latlng.lat > 0) {
      e.latlng.lat = 0;
    }
    return e;
  }

  createIcon(url, opts = {}) {
    return L.icon({
      iconUrl: url,
      ...opts,
    });
  }

  _handleDragStart() {
    throw new Error('Not implemented.');
  }

  _handleDragEnd() {
    throw new Error('Not implemented.');
  }
}
