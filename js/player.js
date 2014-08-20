function Player() {
  this.inventory = new Inventory();

  this.regen = 150.0;

  this.baseStrength = 10;
  this.baseAgility = 8;
  this.baseStamina = 9;

  this.baseDodgeChance    = 0.05;
  this.baseHitChance      = 0.9;
  this.baseCritChance     = 0.04;
  this.baseCritMultiplier = 2.0;

  this.money = 0;
  this.xp   = 0;
  this.xpMax = 20;

  this.getAttributesWithGear();
}
Player.prototype = new Entity();

Player.prototype.addXP = function(xpPercentage) {
  this.xp += Math.round(this.xpMax * xpPercentage / 100);
  if (this.xp >= this.xpMax) {
    this.levelUp();
  }
}

Player.prototype.levelUp = function() {
  Entity.prototype.levelUp.call(this);
  
  this.baseStrength = this.baseStrength + Math.floor(3 * Math.random()) + 1;
  this.baseAgility = this.baseAgility + Math.floor(2 * Math.random()) + 1;
  this.baseStamina = this.baseStamina + Math.floor(5 * Math.random()) + 1;
  
  this.getAttributesWithGear();

  this.health = this.getMaxHealth();
  this.xp = this.xp - this.xpMax;
  this.xpMax = Math.round(this.xpMax * (1.8 + (this.level / 100)));
}

Player.prototype.regenHealth = function(intervalInMilliseconds) {
  Player.prototype.heal.call(this, this.regen / (5000 / intervalInMilliseconds));
}

Player.prototype.getBaseHealth = function() {
  var baseHealth = 146;
  var lvlMultiplier = 26;
  return baseHealth + (this.level - 1) * lvlMultiplier;
}

Player.prototype.getMaxHealth = function() {
  return Entity.prototype.getMaxHealth.call(this);
}

Player.prototype.getStamHealth = function() {
  var jumpPoint = 15;
  var multiplier = 10;
  
  // Stamina provides 1 health per stamina for the first 'jumpPoint' points of stamina, and 'multiplier' health per point of stamina thereafter.
  return this.stamina <= jumpPoint ? this.stamina : jumpPoint + multiplier * (this.stamina - jumpPoint);
}

Player.prototype.equipDrop = function(item) {
  if (!item) { return; }

  var itemMovedToInventory = false;

  if (this.gear[item.slot]) {
    if (!this.inventory.isFull()) {
      this.inventory.push(this.gear[item.slot]);
      itemMovedToInventory = true;
    }
    else {
      alert('Inventory full. Can\'t equip item');
      return;
    }
  }

  this.gear[item.slot] = item;
  this.getAttributesWithGear();

  return itemMovedToInventory;
}

Player.prototype.equipItemFromInventory = function(item) {
  if (!item) { return; }

  var gearToReplace = this.gear[item.slot];

  if (gearToReplace) {
    this.inventory.replace(item, gearToReplace);
  }
  else {
    this.inventory.remove(item);
  }

  item.inventoryIndex = -1;
  this.gear[item.slot] = item;

  this.getAttributesWithGear();
  return gearToReplace;
}

Player.prototype.removeItemFromInventory = function(item) {
  if (!item) { return; }
  this.inventory.remove(item);
}

Player.prototype.unEquipItem = function(item) {
  if (!item) { return; }
  this.gear[item.slot] = null;
  this.getAttributesWithGear();
}

Player.prototype.sellItem = function(item) {
  if (!item) { return; }

  this.money += item.sellValue;
  this.removeItemFromInventory(item);
}
