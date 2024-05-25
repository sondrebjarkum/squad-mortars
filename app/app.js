import { SquadMap } from './map';
import { Mortar } from './mortar';
import { Target } from './target';

/**
 * App logic
 */

class AppBase {
  map;
  mortar;
  targets = [];

  constructor() {}

  init() {
    this.map = new SquadMap({
      handleContextMenu: (e) => console.log(e),
      handleDoubleClick: (e) => {
        this.addMarker(e);
        console.log('mortar', this.mortar);
        console.log('targets', this.targets);
      },
      handleMouseOut: () => null,
    });
  }

  setMortar(lat, lng) {
    this.mortar = new Mortar(lat, lng);
  }

  addTarget(lat, lng) {
    this.targets.push(new Target(lat, lng, this.mortar));
  }

  addMarker(e) {
    const { lat, lng } = e.latlng;

    if (!this.mortar) {
      return this.setMortar(lat, lng);
    }

    return this.addTarget(lat, lng);
  }
}

const App = new AppBase();

export default App;
