/*
 * name
 * calculations
 * properties
 */

import App from './app';

export class Weapon {
  constructor(
    name,
    { velocity, gravityScale, minElevation, minDistance, unit, moa },
    { icon: logo, logoCannonPos, type, angleType, elevationPrecision },
  ) {
    this.name = name;
    this.velocity = velocity;
    this.gravityScale = gravityScale;
    this.minElevation = minElevation;
    this.unit = unit;
    this.logo = logo;
    this.logoCannonPos = logoCannonPos;
    this.type = type;
    this.angleType = angleType;
    this.elevationPrecision = elevationPrecision;
    this.minDistance = minDistance;
    this.moa = moa;
  }

  /**
   * Return the weapon velocity
   * @param {number}  [distance] - distance between mortar and target from getDist()
   * @returns {number} - Velocity of the weapon for said distance
   */
  getVelocity(distance) {
    if (this.velocity.constructor != Array) {
      return this.velocity;
    }

    for (let i = 1; i < this.velocity.length; i += 1) {
      if (distance < this.velocity[i][0]) {
        return (
          this.velocity[i - 1][1] +
          ((distance - this.velocity[i - 1][0]) /
            (this.velocity[i][0] - this.velocity[i - 1][0])) *
            (this.velocity[i][1] - this.velocity[i - 1][1])
        );
      }
    }
  }

  /**
   * Return the angle factor from 45°
   * @returns {1 | -1} -1 = 0-45° / 1 = 45-90°
   */
  getAngleType() {
    return this.angleType === 'high' ? -1 : 1;
  }

  /**
   * Return maximum distance for 45°
   * https://en.wikipedia.org/wiki/Projectile_motion#Maximum_distance_of_projectile
   * @returns {number} [distance]
   */
  getMaxDistance() {
    if (this.velocity.constructor != Array) {
      return this.velocity ** 2 / App.config.gravity / this.gravityScale;
    }

    // When using UB32, return last value from UB32_table
    return this.velocity.slice(-1)[0][0];
  }
}
