function Enemy() {
  this.level          = 1;
  this.difficulty = Quality.Poor;
  this.dropLoot = this.dropLoot();
	
  this.baseStrength   = 0;
  this.baseAgility    = 0;
  this.baseStamina    = 0;

  this.baseDodgeChance    = 0.025;
  this.baseHitChance      = 0.8;
  this.baseCritChance     = 0.02;
  this.baseCritMultiplier = 1.5;
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

Enemy.prototype.dropLoot = function() {

  var multiplier = this.level * (this.difficulty + 1);
  var money =  multiplier + Math.round(multiplier * Math.random());

  var xpPercentage = (this.difficulty + 2) * (40 + 10 * Math.random()) / (this.level + 4);

  var rand = Math.random();
  var numItemsToDrop = (this.difficulty == Quality.Poor && rand < 0.3) ? 0 : 1;

  var loot = null;
  if (numItemsToDrop > 0) {
    var availableGear = [];
    for (var slot = 0; slot <= Slot.Max; slot++) {
      if (this.gear[slot] != null) {
        availableGear.push(this.gear[slot]);
      }
    }

    var index = Math.floor(availableGear.length * Math.random());
    loot = availableGear[index];
  }

  return [money, xpPercentage, loot];
}