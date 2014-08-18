function Weapon() {
  this.minDamage  = 0;
  this.maxDamage  = 0;
}
Weapon.prototype = new Equipment();

Weapon.prototype.generateRandomItem = function(slot, level, quality) {
  Equipment.prototype.generateRandomItem.call(this, slot, level, quality);
  this.minDamage = 4 + level * (quality + 1) + Math.round(level * Math.random());
  this.maxDamage = this.minDamage + 2 * level;
  return this;
}

Weapon.prototype.getWeaponDamage = function() {
  return this.minDamage + (Math.round(this.maxDamage  * Math.random() - this.minDamage));
}