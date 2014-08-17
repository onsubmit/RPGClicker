function Brute() {
  this.level          = 1;
	
  this.baseStrength   = 1;
  this.baseAgility    = 1;
  this.baseStamina    = 4;
}
Brute.prototype = new Entity();

Brute.prototype.generateRandomEnemy = function(level, dropQuality) {
  return Enemy.prototype.generateRandomEnemy.call(this, level, dropQuality);
}

Brute.prototype.generateRandomGear = function(level, averageQuality) {
  return Enemy.prototype.generateRandomGear.call(this, level, averageQuality);
}