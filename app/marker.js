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
  }

  /**
   *
   * @param {L.Marker} marker
   */
  addToMap(marker) {
    if (this.outOfBounds(marker)) return;
    return this.squadMap.addMarker(marker);
  }

  /**
   * Force a given event to stay inside the map bounds
   */
  outOfBounds(event) {
    return (
      event.latlng.lng > this.squadMap.tileSize ||
      event.latlng.lat < -this.squadMap.tileSize ||
      event.latlng.lng < 0 ||
      event.latlng.lat > 0
    );
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
