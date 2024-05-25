import { SquadMap } from './map';
import { Mortar } from './mortar';
import { Target } from './target';

/**
 * App logic
 */

class AppBase {
  /** @type {SquadMap} */
  map;
  mortar;
  targets = [];

  constructor() {
    this.registerListeners();
  }

  init() {
    this.map = new SquadMap({
      handleContextMenu: (e) => this.handleContextMenu(e),
      handleDoubleClick: (e) => this.addMarker(e),
      handleMouseOut: () => null,
    });
  }

  registerListeners() {
    document.addEventListener('layerremove', (e) => {
      console.log('WERE LISTENING BBY:', e);

      const { id, instanceName } = e.detail;

      if (instanceName === 'Mortar') {
        this.mortar = undefined;
      }

      if (instanceName === 'Target') {
        this.targets = this.targets.filter(
          (target) => target.options.id !== id,
        );
      }

      console.log('targets', this.targets);
      console.log('mortar', this.mortar);
    });
  }

  addMarker(e) {
    if (!this.mortar) {
      return this.addMortar(e.latlng);
    }

    return this.addTarget(e.latlng);
  }

  addMortar(latlng) {
    const mortar = new Mortar(latlng, this.map);
    this.mortar = mortar;
  }

  addTarget(latlng) {
    const target = new Target(latlng, this.map);
    this.targets.push(target);
    console.log('this.targets:', this.targets);
  }

  handleContextMenu(e) {
    console.log('e:', e);
    // if instance of Target - delete target
    // if instance of Mortar - context menu? with delete etc
  }
}

const App = new AppBase();

export default App;
