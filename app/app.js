import { Weapons } from './constants/weapons';
import { getKP, getLatLng } from './helpers/calculations';
import { gridPositionToLatLng } from './helpers/grid';
import { SquadMap } from './map';
import { Mortar } from './mortar';
import { Target } from './target';

/**
 * App logic
 */

class AppBase {
  /** @type {SquadMap} */
  squadMap;
  /** @type {Mortar} */
  mortar;
  /** @type {Target[]} */
  targets = [];

  config = {
    gravity: 9.8,
    mapSize: 255,
    activeWeapon: Weapons[0],
  };

  constructor() {
    this.registerListeners();
  }

  init() {
    this.squadMap = new SquadMap({
      handleContextMenu: (e) => this.handleContextMenu(e),
      handleDoubleClick: (e) => this.addMarker(e),
      handleMouseOut: () => null,
      handleLayerRemove: (e) => this.handleLayerRemove(e),
      handleMouseMove: (e) => this.handleMouseMove(e),
    });
  }

  registerListeners() {}

  addMarker(e) {
    if (!this.mortar) {
      return this.addMortar(e.latlng);
    }
    return this.addTarget(e.latlng);
  }

  addMarkerByGridPosition(gridPosition) {
    const uppercased = gridPosition.toUpperCase();
    const latlng = gridPositionToLatLng(uppercased);

    this.addMarker({ latlng });
  }

  addMortar(latlng) {
    const mortar = new Mortar(latlng, this.squadMap);
    this.mortar = mortar;
    this.recalculateTargets();
  }

  addTarget(latlng) {
    const target = new Target(latlng, this.squadMap);
    this.targets.push(target);
  }

  handleContextMenu(e) {
    // kan vise en generell context menu, med add mortar, target, etc?
  }

  handleLayerRemove(e) {
    const { id = undefined, instanceName = '' } = e.layer.options;

    if (instanceName === 'Mortar') {
      this.mortar = undefined;
      this.recalculateTargets();
    }

    if (instanceName === 'Target') {
      this.targets = this.targets.filter((target) => target.options.id !== id);
    }
  }

  recalculateTargets() {
    if (this.targets.length) {
      for (const target of this.targets) {
        target.recalculate();
      }
    }
  }

  handleMouseMove(e) {
    // if no mouse support
    if (!matchMedia('(pointer:fine)').matches) {
      return 1;
    }
    console.log('--------------');
    console.log('ACTUAL LATLNG', e.latlng.lat + ' : ' + e.latlng.lng);
    const KP = getKP(
      -e.latlng.lat * this.squadMap.mapToGameScale,
      e.latlng.lng * this.squadMap.mapToGameScale,
    );
    console.log('CALUCLATED LATLNG', getLatLng(KP));
    console.log('KP:', KP);
  }
}

const App = new AppBase();

export default App;
