import MarkerBase from './marker';
import TargetIcon from './public/icons/markers/target.webp';
import ShadowIcon from './public/icons/markers/shadow.webp';

export class Target extends MarkerBase {
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

    this.instance = this.addToMap(this);

    this.instance.on('contextmenu', this.removeSelf);
  }

  removeSelf() {
    this.squadMap.map.removeLayer(this.instance);
  }
}
