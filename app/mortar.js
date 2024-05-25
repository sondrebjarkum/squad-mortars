import MarkerBase from './marker';
import MortarIcon from './public/icons/markers/mortar.webp';
import ShadowIcon from './public/icons/markers/shadow.webp';

export class Mortar extends MarkerBase {
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

    this.instance = this.addToMap(this);

    this.instance.on('contextmenu', this.removeSelf);
  }

  removeSelf() {
    this.squadMap.map.removeLayer(this.instance);
  }
}
