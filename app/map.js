import './styles/style.css';
import 'leaflet/dist/leaflet.css';
import L, { LatLng } from 'leaflet';
import { Layers } from './constants/maps';

export class SquadMap {
  constructor() {
    this.map = this.init();
  }

  createLayer(layer) {
    return L.tileLayer(
      'maps' + layer.mapURL + 'basemap' + '/{z}_{x}_{y}.webp',
      { maxNativeZoom: 4, maxZoom: 7 },
    );
  }

  getLayer(layerName) {
    return layerName
      ? Layers.find((layer) => layer.name === layerName)
      : Layers[11];
  }

  setLayer(layerName) {
    const activeMap = this.getLayer(layerName);
    const tileLayer = this.createLayer(activeMap);

    this.map.eachLayer((layer) => this.map.removeLayer(layer));
    this.map.addLayer(tileLayer);
  }

  init() {
    const activeMap = this.getLayer();

    const tileLayer = this.createLayer(activeMap);

    const map = L.map('map', {
      center: new LatLng(-256 / 2, 256 / 2),
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
      layers: [tileLayer],
    });

    L.control
      .scale({
        imperial: false,
      })
      .addTo(map);

    return map;
  }
}

// const getMapConfig = (tilesSize, id = 'map') => {
//   const options = {
//     center: new LatLng(-tilesSize / 2, tilesSize / 2),
//     attributionControl: false,
//     crs: L.CRS.Simple,
//     minZoom: 1,
//     maxZoom: 8,
//     zoomControl: false,
//     doubleClickZoom: false,
//     edgeBufferTiles: 5,
//     renderer: L.svg({ padding: 3 }),
//     closePopupOnClick: false,
//     wheelPxPerZoomLevel: 75,
//     boxZoom: true,
//     fadeAnimation: true,
//     zoom: 2,
//   };

//   // const Map = new L.Map(id, options)

//   const Map = L.map(id, options);

//   // L.setOptions(Map, options);
//   // L.Map.prototype.initialize.call(Map, id, options);

//   // Default map to Kohat
//   const activeMap = Layers.find((elem, index) => index == 11);

//   const imageBounds = L.latLngBounds(
//     L.latLng(0, 0),
//     L.latLng(-tilesSize, tilesSize),
//   );
//   const tileLayerOption = {
//     maxNativeZoom: activeMap.maxZoomLevel,
//     noWrap: true,
//     bounds: imageBounds,
//     tileSize: tilesSize,
//   };

//   const layerGroup = L.layerGroup().addTo(Map);
//   const markersGroup = L.layerGroup().addTo(Map);
//   const activeTargetsMarkers = L.layerGroup().addTo(Map);
//   const activeWeaponsMarkers = L.layerGroup().addTo(Map);
//   const grid = '';
//   const mouseLocationPopup = L.popup({
//     closeButton: false,
//     className: 'kpPopup',
//     autoClose: false,
//     closeOnEscapeKey: false,
//     offset: [0, 75],
//     autoPan: false,
//     interactive: false,
//   });

//   // Custom events handlers
//   // on("dblclick", _handleDoubleCkick, this);
//   // on("contextmenu", _handleContextMenu, this);
//   // on("mouseout", _handleMouseOut, this);
//   // if (App.userSettings.keypadUnderCursor) {
//   //   on("mousemove", _handleMouseMove, this);
//   // }

//   return {
//     Map,
//     options,
//     activeMap,
//     imageBounds,
//     tileLayerOption,
//     layerGroup,
//     markersGroup,
//     activeTargetsMarkers,
//     activeWeaponsMarkers,
//     grid,
//     mouseLocationPopup,
//     tilesSize,
//   };
// };

// export function setupMap(mapLayerName) {
//   // const m_mono = L.tileLayer('https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png');

//   // const map = L.map('map', {
//   //   center: [35.681, 139.767],
//   //   zoom: 11,
//   //   zoomControl: true,
//   //   layers: [m_mono]
//   // });

//   // L.control.scale({
//   //   imperial: false,
//   //   maxWidth: 300
//   // }).addTo(map);

//   // const activeMap = MAPS.find((elem, index) => index == 11);
//   const activeMap = mapLayerName
//     ? Layers.find((layer) => layer.name === mapLayerName)
//     : Layers[11];

//   const layer = L.tileLayer(
//     'maps' + activeMap.mapURL + 'basemap' + '/{z}_{x}_{y}.webp',
//     { maxNativeZoom: 4, maxZoom: 7 },
//   );

//   const map = L.map('map', {
//     center: new LatLng(-256 / 2, 256 / 2),
//     attributionControl: false,
//     crs: L.CRS.Simple,
//     minZoom: 1,
//     zoomControl: false,
//     doubleClickZoom: false,
//     // edgeBufferTiles: 5,
//     renderer: L.svg({ padding: 3 }),
//     closePopupOnClick: false,
//     wheelPxPerZoomLevel: 75,
//     boxZoom: true,
//     fadeAnimation: true,
//     zoom: 2,
//     layers: [layer],
//   });

//   L.control
//     .scale({
//       imperial: false,
//     })
//     .addTo(map);

//   return map;

//   // const mapConfig = getMapConfig(256)

//   // const activeMap = MAPS.find((elem, index) => index == 11);

//   // const tileLayerOption = {
//   //   maxNativeZoom: activeMap.maxZoomLevel,
//   //   noWrap: true,
//   //   bounds: mapConfig.imageBounds,
//   //   tileSize: mapConfig.tileSize,
//   // };

//   // const layerMode = "basemap"

//   // const activeLayer = L.tileLayer("", tileLayerOption);
//   // activeLayer.setUrl("maps" + activeMap.mapURL + layerMode + "/{z}_{x}_{y}.webp");
//   // activeLayer.addTo(mapConfig.layerGroup);
// }
