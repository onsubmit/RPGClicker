function Player() {
  this.inventory = [];

  this.regen = 25.0;

  this.baseStrength = 4;
  this.baseAgility = 2;
  this.baseStamina = 8;

  this.baseDodgeChance    = 0.05;
  this.baseHitChance      = 0.9;
  this.baseCritChance     = 0.04;
  this.baseCritMultiplier = 2.0;
  this.gold = 0;

  this.getAttributesWithGear();
}
Player.prototype = new Entity();

Player.prototype.levelUp = function() {
  Entity.prototype.levelUp.call(this);
  
  this.baseStrength = this.baseStrength + 1;
  this.baseAgility = this.baseAgility + 1;
  this.baseStamina = this.baseStamina + 1;
  
  this.getAttributesWithGear();
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

Player.prototype.equipItem = function(item) {
  if (!item) { return; }

  if (this.gear[item.slot]) {
    if (this.inventory.length < 25) {
      this.inventory.push(this.gear[item.slot]);
    }
    else {
      alert('Inventory full. Can\'t equip item');
      return;
    }
  }

  this.gear[item.slot] = item;
  this.getAttributesWithGear();
}

Player.prototype.equipItemFromInventory = function(invetoryIndex) {
  var item = this.inventory[inventoryIndex];
  if (!item) { return; }

  var temp = this.gear[item.slot];
  this.gear[item.slot] = item;
  this.inventory[inventoryIndex] = temp;
}