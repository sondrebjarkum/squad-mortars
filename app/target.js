export class Target {
  constructor(lat, lng, mortar) {
    this.lat = lat;
    this.lng = lng;
    this.id = Math.floor(Math.random() * 10000);
    this.mortar = mortar;
  }
}
