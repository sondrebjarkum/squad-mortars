import MarkerBase from './marker';
import TargetIcon from './public/icons/markers/target.webp';
import ShadowIcon from './public/icons/markers/shadow.webp';
import L from 'leaflet';
import App from './app';
import {
  getBearing,
  getDist,
  getElevation,
  getSpreadParameter,
  getTimeOfFlight,
  radToDeg,
  radToMil,
} from './helpers/calculations';
import { Ellipse } from './ellipse';

export class Target extends MarkerBase {
  miniCircleOptions = {
    radius: 4,
    opacity: 0,
    color: '#b22222',
    fillOpacity: 0,
    weight: 1,
    autoPan: false,
  };

  spreadMarkerStyle = {
    opacity: 1,
    fillOpacity: 0.26,
    color: '#b22222',
    weight: 1,
    stroke: 1,
    // className: 'cursorClass',
  };

  targetPopupStyle = {
    autoPan: false,
    autoClose: false,
    closeButton: false,
    closeOnEscapeKey: false,
    bubblingMouseEvents: false,
    interactive: false,
    className: 'calcPopup',
    minWidth: 100,
    offset: [-65, 0],
  };

  properties = {
    distance: 0,
    elevation: 0,
    bearing: 0,
    velocity: 0,
    weaponHeight: 0,
    targetHeight: 0,
    gravityScale: 0,
  };

  calculations = {
    diffHeight: 0,
    spreadParameters: { semiMajorAxis: 0, semiMinorAxis: 0, ellipseAngle: 0 },
    radiiElipse: [],
    timeOfFlight: 0,
  };

  instances = {
    self: null,
    calcMarker: null,
    spreadMarker: null,
  };

  getCalculationInstances() {
    const filteredEntries = Object.entries(this.instances).filter(
      ([key]) => key !== 'self',
    );
    return Object.fromEntries(filteredEntries);
  }

  constructor(latlng, map) {
    super(latlng, map, {
      autoPan: false,
    });

    this.options.icon = this.createIcon(TargetIcon, {
      shadowUrl: ShadowIcon,
      iconSize: [28, 34],
      shadowSize: [38, 34],
      iconAnchor: [14, 34],
      shadowAnchor: [12, 34],
    });

    this.options.calcMarker1 = null;
    this.options.spreadMarker1 = null;
    this.options.results = {};

    this.instances.self = this.addToMap(this);

    this.instances.self.on('contextmenu', this.removeSelf);
    this.instances.self.on('drag', this._onDrag);

    this.latlng = latlng;

    this.registerEventlisteners();
    this.recalculate();
  }

  _onDrag(e) {
    this.latlng = e.latlng;
    this.recalculate();
  }

  removeSelf() {
    for (const [, instance] of Object.entries(this.instances)) {
      this.squadMap.map.removeLayer(instance);
    }
  }

  registerEventlisteners() {
    document.addEventListener('mortardrag', this.onMortarChange);
    document.addEventListener('mortarremoved', this.onMortarChange);
    document.addEventListener('mortaradded', this.onMortarChange);
    document.addEventListener('created#Mortar', () => {
      console.log('created#Mortar');
      this.onMortarChange();
    });
  }

  onMortarChange() {
    console.log('MORTAR CHANGE');
    this.recalculate();
  }

  recalculate() {
    // må sjekke om mortar har blitt removed
    // om så, må jeg fjerne alt av radius calcs, og neste gang en mortar lages rekalkulere
    if (!this.latlng) {
      // remove the radius circles
      // and calculations
    }
    this.setProperties();
    this.setCalculations();
    this.setRadiusMarker();
  }

  setRadiusMarker() {
    if (this.instances.calcMarker) {
      this.instances.calcMarker
        .setLatLng(this.latlng)
        .setContent(this.getCalcPopupContent());
    } else {
      this.instances.calcMarker = L.popup(this.targetPopupStyle)
        .setLatLng(this.latlng)
        .openOn(this.squadMap.map)
        .addTo(this.squadMap.map)
        .setContent(this.getCalcPopupContent(this.calculations));
    }

    if (this.instances.spreadMarker) {
      this.instances.spreadMarker
        .setLatLng(this.latlng)
        .setRadius(this.calculations.radiiElipse)
        .setTilt(this.properties.bearing);
    } else {
      this.instances.spreadMarker = new Ellipse(
        this.latlng,
        this.calculations.radiiElipse,
        this.properties.bearing,
        this.spreadMarkerStyle,
      )
        .addTo(this.squadMap.map)
        .setRadius(this.calculations.radiiElipse);
    }
  }

  getCalcPopupContent() {
    const DIST = this.properties.distance;
    const BEARING = this.properties.bearing;
    let ELEV = this.properties.elevation;
    let TOF = this.calculations.timeOfFlight;
    let content;

    if (isNaN(ELEV)) {
      ELEV = '---';
    } else {
      if (App.config.activeWeapon.unit === 'mil') {
        ELEV = radToMil(ELEV).toFixed(0);
      } else {
        ELEV = radToDeg(ELEV).toFixed(1);
      }
    }

    if (isNaN(TOF)) {
      TOF = '---';
    } else {
      TOF = TOF.toFixed(1) + 's';
    }

    content = "<span class='calcNumber'></span></br><span>" + ELEV + '</span>';

    content +=
      "<br><span class='bearingUiCalc'>" + BEARING.toFixed(1) + '° </span>';

    // content += "<br><span class='bearingUiCalc'>" + TOF + '</span>';

    // content +=
    //   "<br><span class='bearingUiCalc'>" + DIST.toFixed(0) + 'm </span>';

    document.dispatchEvent(
      new CustomEvent('target-change', {
        detail: { ELEV, BEARING: BEARING.toFixed(1), id: this.id },
      }),
    );

    return content;
  }

  setProperties() {
    // weaponPos = this.map.activeWeaponsMarkers.getLayers()[0].getLatLng();
    const weaponPos = App.mortar?.latlng || { lat: 0, lng: 0 };

    // weaponHeight = this._map.heightmap.getHeight(weaponPos);
    const weaponHeight = 1;
    // targetHeight = this._map.heightmap.getHeight(latlng);
    const targetHeight = 1;

    const mortarPosition = L.latLng([
      weaponPos.lng * this.squadMap.mapToGameScale,
      -weaponPos.lat * this.squadMap.mapToGameScale,
    ]);
    const targetPosition = L.latLng([
      this.latlng.lng * this.squadMap.mapToGameScale,
      -this.latlng.lat * this.squadMap.mapToGameScale,
    ]);

    const distance = getDist(mortarPosition, targetPosition);
    const bearing = getBearing(mortarPosition, targetPosition);
    const velocity = App.config.activeWeapon.getVelocity(distance);
    const elevation = getElevation(
      distance,
      targetHeight - weaponHeight,
      velocity,
    );

    this.properties = {
      distance,
      elevation,
      bearing,
      velocity,
      weaponHeight,
      targetHeight,
      gravityScale: App.config.activeWeapon.gravityScale,
    };

    console.log(this.properties);
  }

  setCalculations() {
    const { elevation, velocity, weaponHeight, targetHeight } = this.properties;

    const spreadParameters = getSpreadParameter(elevation, velocity);

    const radiiElipse = [
      (spreadParameters.semiMajorAxis * this.squadMap.gameToMapScale) / 2,
      (spreadParameters.semiMinorAxis * this.squadMap.gameToMapScale) / 2,
    ];

    this.calculations = {
      diffHeight: targetHeight - weaponHeight,
      spreadParameters,
      radiiElipse,
      timeOfFlight: getTimeOfFlight(
        elevation,
        velocity,
        targetHeight - weaponHeight,
      ),
    };
  }
}

// updateRadiusMarker_old() {
//   if (!this.instances.calcMarker || !this.instances.spreadMarker) {
//     for (const [k, circle] of Object.entries(this.instances)) {
//       if (k === 'self') return;
//       this.squadMap.layer.removeLayer(circle);
//     }
//   }
//   // var angleElipse;
//   // var cursorClass;
//   // var popUpOptions_weapon1;
//   // var popUpOptions_weapon2;

//   // weaponPos = this.map.activeWeaponsMarkers.getLayers()[0].getLatLng();
//   const weaponPos = App.mortar.latlng;
//   // weaponHeight = this._map.heightmap.getHeight(weaponPos);
//   const weaponHeight = 1;
//   // targetHeight = this._map.heightmap.getHeight(latlng);
//   const targetHeight = 1;

//   const a = L.latLng([
//     weaponPos.lng * this.squadMap.layerToGameScale,
//     -weaponPos.lat * this.squadMap.layerToGameScale,
//   ]);
//   const b = L.latLng([
//     this.latlng.lng * this.squadMap.layerToGameScale,
//     -this.latlng.lat * this.squadMap.layerToGameScale,
//   ]);

//   const distance = getDist(a, b);
//   const velocity = App.config.activeWeapon.getVelocity(distance);
//   const elevation = getElevation(
//     distance,
//     targetHeight - weaponHeight,
//     velocity,
//   );

//   this.options.results = {
//     distance,
//     elevation,
//     bearing: getBearing(a, b),
//     velocity: velocity,
//     gravityScale: App.config.activeWeapon.gravityScale,
//     weaponHeight: weaponHeight,
//     targetHeight: targetHeight,
//     diffHeight: targetHeight - weaponHeight,
//     spreadParameters: getSpreadParameter(elevation, velocity),
//     timeOfFlight: getTimeOfFlight(
//       elevation,
//       velocity,
//       targetHeight - weaponHeight,
//     ),
//   };

//   this.instances.calcMarker = L.popup(this.targetPopupStyle)
//     .setLatLng(this.latlng)
//     .openOn(this.squadMap.layer)
//     .addTo(this.squadMap.layer);

//   this.instances.spreadMarker = new Ellipse(
//     this.latlng,
//     this.calculations.radiiElipse,
//     this.options.results.bearing,
//     this.spreadMarkerStyle,
//   ).addTo(this.squadMap.layer);

//   this.instances.spreadMarker.setRadius([
//     (this.options.results.spreadParameters.semiMajorAxis *
//       this.squadMap.gameToMapScale) /
//       2,
//     (this.options.results.spreadParameters.semiMinorAxis *
//       this.squadMap.gameToMapScale) /
//       2,
//   ]);
//   this.instances.spreadMarker.setStyle(this.spreadMarkerStyle);

//   this.instances.calcMarker.setContent(this.getContent(this.options.results));
// }
