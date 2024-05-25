import L from 'leaflet';

export default class MarkerBase extends L.Marker {
  options = {
    draggable: true,
    riseOnHover: true,
    keyboard: false,
    animate: true,
  };

  constructor(latlng, options, map) {
    super(latlng, options);
    this.map = map;
    this.id = Math.random().toString(16).slice(2);
    this.on('dragstart', this._handleDragStart, this);
    this.on('dragend', this._handleDragEnd, this);
  }

  /**
   * Force a given event to stay inside the map bounds
   */
  keepOnMap(event) {
    if (event.latlng.lng > this.map.tilesSize) {
      event.latlng.lng = this.map.tilesSize;
    }
    if (event.latlng.lat < -this.map.tilesSize) {
      event.latlng.lat = -this.map.tilesSize;
    }
    if (event.latlng.lng < 0) {
      event.latlng.lng = 0;
    }
    if (event.latlng.lat > 0) {
      event.latlng.lat = 0;
    }
    return event;
  }

  _handleDragStart() {
    throw new Error('Not implemented.');
  }

  _handleDragEnd() {
    throw new Error('Not implemented.');
  }
}
