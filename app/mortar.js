import { Circle, CircleMarker } from 'leaflet';
import MarkerBase from './marker';
import MortarIcon from './public/icons/markers/mortar.webp';
import ShadowIcon from './public/icons/markers/shadow.webp';
import App from './app';

export class Mortar extends MarkerBase {
  /**
   * @type { {self: L.Marker, circles:{ minRangeCircle: L.Circle,maxRangeCircle: L.Circle,miniCircle: L.CircleMarker}}}
   */
  instances = {
    self: null,
    circles: {
      minRangeCircle: null,
      maxRangeCircle: null,
      miniCircle: null,
    },
  };

  constructor(latlng, map) {
    super(latlng, map, {
      autoPan: false,
    });

    this.options.icon = this.createIcon(MortarIcon, {
      shadowUrl: ShadowIcon,
      iconSize: [38, 47],
      shadowSize: [38, 47],
      iconAnchor: [19, 47],
      shadowAnchor: [10, 47],
      className: 'animatedWeaponMarker',
    });

    this.instances.self = this.addToMap(this);

    this.maxDistCircleOn = {
      radius:
        App.config.activeWeapon.getMaxDistance() * this.squadMap.gameToMapScale,
      opacity: 0.7,
      color: '#00137f',
      fillOpacity: 0,
      weight: 2,
      autoPan: false,
      // className: cursorClass,
    };

    this.minDistCircleOn = {
      radius:
        App.config.activeWeapon.minDistance * this.squadMap.gameToMapScale,
      opacity: 0.7,
      color: '#90137f',
      fillOpacity: 0.2,
      weight: 1,
      autoPan: false,
      // className: cursorClass,
    };

    this.miniCircleOptions = {
      radius: 4,
      opacity: 1,
      color: '#00137f',
      fillOpacity: 0,
      weight: 1,
      autoPan: false,
    };

    this.drawCircles();
    this.instances.self.on('remove', this._onRemove);
    this.instances.self.on('contextmenu', this.removeSelf);
    this.instances.self.on('drag', this._onDrag);
  }

  removeSelf() {
    this.squadMap.map.removeLayer(this.instances.self);
    for (const [, circle] of Object.entries(this.instances.circles)) {
      this.squadMap.map.removeLayer(circle);
    }
  }

  drawCircles() {
    this.instances.circles.minRangeCircle = new Circle(
      this.latlng,
      this.minDistCircleOn,
    ).addTo(this.squadMap.map);
    this.instances.circles.maxRangeCircle = new Circle(
      this.latlng,
      this.maxDistCircleOn,
    ).addTo(this.squadMap.map);
    this.instances.circles.miniCircle = new CircleMarker(
      this.latlng,
      this.miniCircleOptions,
    ).addTo(this.squadMap.map);
  }

  setCoordinates(latlng) {
    this.latlng = latlng;
    this.instances.self.setLatLng(this.latlng);
  }

  _onDrag(e) {
    e = this.keepOnMap(e);

    const { latlng } = e;

    this.latlng = latlng;

    for (const [, circle] of Object.entries(this.instances.circles)) {
      circle.setLatLng(this.latlng);
    }

    //TODO: should just check whether it is out of bounds and then set it
    this.instances.self.setLatLng(latlng);

    document.dispatchEvent(
      new CustomEvent('mortardrag', { detail: { latlng } }),
    );
  }

  _onRemove(e) {
    document.dispatchEvent(
      new CustomEvent('mortarremoved', { detail: { id: this.id } }),
    );
  }
}
