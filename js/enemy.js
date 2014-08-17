function Enemy() {
  this.level          = 1;
  this.difficulty = Quality.Poor;
	
  this.baseStrength   = 0;
  this.baseAgility    = 0;
  this.baseStamina    = 0;
}
Enemy.prototype = new Entity();

Enemy.prototype.generateRandomEnemy = function(level, dropQuality) {
  this.level = level;
  this.difficulty = dropQuality;
  this.baseStrength = this.baseStrength + level;
  this.baseAgility = this.baseAgility + level;
  this.baseStamina = this.baseStamina + level;
  this.gear = this.generateRandomGear(level, dropQuality);
  this.getAttributesWithGear();
  return this;
}

Enemy.prototype.generateRandomGear = function(level, averageQuality) {
  var gear = [];
  for (var slot = 0; slot <= Slot.Max; slot++) {

    var item = null;

    // Enemies under level 10 have a chance to be missing gear
    if (slot == Slot.MainHand || level > 10 || level * Math.random() > 0.5) {
      var dropQuality = Equipment.getDropQuality(averageQuality);

      
      if (slot === Slot.MainHand) {
        item = new Weapon();
        item = item.generateRandomItem(slot, level, dropQuality);
      }
      else {
        item = new Armor();
        item = item.generateRandomItem(slot, level, dropQuality);
      }
    }

    gear.push(item);
  }

  return gear;
}