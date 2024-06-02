import './styles/style.css';
import 'leaflet/dist/leaflet.css';
import L, { LatLng, Popup } from 'leaflet';
import { Layers } from './constants/layers';
import { getGridCoordinates } from './helpers/grid';

export class SquadMap {
  tileSize = 256;
  layer;
  /** @type {L.Map} */
  map;

  constructor({
    handleContextMenu,
    handleDoubleClick,
    handleMouseOut,
    handleLayerRemove,
    handleMouseMove,
  }) {
    this.init(
      handleContextMenu,
      handleDoubleClick,
      handleMouseOut,
      handleLayerRemove,
      handleMouseMove,
    );

    this.gameToMapScale = this.tileSize / this.layer.size;
    this.mapToGameScale = this.layer.size / this.tileSize;
  }

  createLayer(layer) {
    return L.tileLayer(
      'maps' + layer.mapURL + 'basemap' + '/{z}_{x}_{y}.webp',
      { maxNativeZoom: 4, maxZoom: 7 },
    );
  }

  getActiveLayer() {
    return this.map;
  }

  getLayer(layerName) {
    return layerName
      ? Layers.find((layer) => layer.name === layerName)
      : Layers[11];
  }

  setLayer(layerName) {
    const activeLayer = this.getLayer(layerName);
    const tileLayer = this.createLayer(activeLayer);

    this.map.eachLayer((layer) => this.map.removeLayer(layer));
    this.map.addLayer(tileLayer);
    this.layer = activeLayer;

    this.gameToMapScale = this.tileSize / this.layer.size;
    this.mapToGameScale = this.layer.size / this.tileSize;
  }

  addMarker(marker) {
    return L.marker(marker._latlng, marker.options).addTo(this.map);
  }

  updateGridCoordinatesPopup(e) {
    // if no mouse support
    if (!matchMedia('(pointer:fine)').matches) {
      return 1;
    }

    // If out of bounds
    if (
      e.latlng.lat > 0 ||
      e.latlng.lat < -this.tileSize ||
      e.latlng.lng < 0 ||
      e.latlng.lng > this.tileSize
    ) {
      this.mouseLocationPopup.close();
      return;
    }

    this.currentLatLng = e.latlng;

    this.mouseLocationPopup.setLatLng(e.latlng).openOn(this.map);
    this.mouseLocationPopup.setContent(
      '<p>' + getGridCoordinates(e.latlng) + '</p>',
    );
  }

  init(
    handleContextMenu,
    handleDoubleClick,
    handleMouseOut,
    handleLayerRemove,
    handleMouseMove,
  ) {
    // const activeMap = this.getLayer();

    // const tileLayer = this.createLayer(activeMap);

    this.map = L.map('map', {
      center: new LatLng(-this.tileSize / 2, this.tileSize / 2),
      attributionControl: false,
      crs: L.CRS.Simple,
      minZoom: 1,
      zoomControl: false,
      doubleClickZoom: false,
      renderer: L.svg({ padding: 3 }),
      closePopupOnClick: false,
      wheelPxPerZoomLevel: 75,
      boxZoom: true,
      fadeAnimation: true,
      zoom: 2,
    });

    L.control
      .scale({
        imperial: false,
      })
      .addTo(this.map);
    this.setLayer(this.getLayer().name);

    this.map.on('dblclick', handleDoubleClick, this);
    this.map.on('contextmenu', handleContextMenu, this);
    this.map.on('mouseout', handleMouseOut, this);
    this.map.on('mousemove', handleMouseMove, this);
    this.map.on('mousemove', this.updateGridCoordinatesPopup, this);
    this.map.on(
      'zoom',
      () => this.updateGridCoordinatesPopup({ latlng: this.currentLatLng }),
      this,
    );

    this.map.addEventListener('layerremove', handleLayerRemove);

    this.mouseLocationPopup = new Popup({
      closeButton: false,
      className: 'kpPopup',
      autoClose: false,
      closeOnEscapeKey: false,
      offset: [0, 75],
      autoPan: false,
      interactive: false,
    });

    return this.map;
  }
}
