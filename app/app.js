import { SquadMap } from './map';

class AppBase {
  map;
  mortar;
  targets;

  constructor() {}

  init() {
    this.map = new SquadMap();
  }

  setMortar(lat, lng) {
    this.mortar = new Mortar(lat, lng);
  }

  addTarget(lat, lng) {
    this.targets.push(new Target(lat, lng));
  }
}

const App = new AppBase();

export default App;

export class Mortar {
  constructor(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }

  setMortar(lat, lng) {
    this.mortar = new Mortar(lat, lng);
  }
}

export class Target {
  constructor(lat, lng, mortar) {
    this.lat = lat;
    this.lng = lng;
    this.id = Math.floor(Math.random() * 10000);
    this.mortar = mortar;
  }

  addTarget(lat, lng) {
    this.targets.push(new Target(lat, lng, this.mortar));
  }

  removeTarget(id) {
    this.targets = this.targets.filter((target) => target.id !== id);
  }

  // har ref til mortaren i targeten
  // når mortar flytter seg, må jeg update calculations i target
}
