function Entity() {
  this.name = "";
  
  this.level = 1;
  this.health = -1;
  this.maxHealth = 0;
  this.regen = 0.0;
  this.difficulty = Quality.Common;
	
  this.baseStrength = 3;
  this.baseAgility = 2;
  this.baseStamina = 4;

  this.baseDodgeChance    = 0.03;
  this.baseHitChance      = 0.9;
  this.baseCritChance     = 0.03;
  this.baseCritMultiplier = 2.0;
  
  this.strength = 0;
  this.agility  = 0;
  this.stamina  = 0;
  this.armor    = 0;

  this.dodgeChance     = 0.0;
  this.hitChance       = 0.0;
  this.critChance      = 0.0;
  this.critMultiplier  = 0.0;
  
  this.gear = [];
}

Entity.prototype.levelUp = function() {
  this.level++;
}

Entity.prototype.isDead = function() {
  return this.health <= 0;
}

Entity.prototype.getAttributesWithGear = function() {
  this.strength = this.baseStrength;
  this.agility = this.baseAgility;
  this.stamina = this.baseStamina;
  this.armor = 0;
  this.dodgeChance = this.baseDodgeChance + this.agility * 0.001 + this.agility / (100 * this.level);
  this.hitChance = this.baseHitChance;
  this.critChance = this.baseCritChance + this.agility * 0.001 + this.agility / (100 * this.level);
  this.critMultiplier = this.baseCritMultiplier;

  for(var i = 0; i < this.gear.length; i++)
  {
    var item = this.gear[i];
    if(item) {
      this.strength = this.strength + item.strength;
      this.agility = this.agility + item.agility;
      this.stamina = this.stamina + item.stamina;
      this.armor = this.armor + item.armor;
      this.dodgeChance = this.dodgeChance + item.dodgeChance;
      this.hitChance = this.hitChance + item.hitChance;
      this.critChance = this.critChance + item.critChance;
      this.critMultiplier = this.critMultiplier + item.critMultiplier;
    }
  }

  this.maxHealth = this.getMaxHealth();

  if (this.health < 0) {
    this.health = this.maxHealth;
  }
}

Entity.prototype.getBaseHealth = function() {
  var baseHealth = 46;
  var lvlMultiplier = 26;
  return baseHealth + (this.level - 1) * lvlMultiplier;
}

Entity.prototype.getMaxHealth = function() {
  var baseHealth = this.getBaseHealth();
  var stamHealth = this.getStamHealth();
  this.maxHealth = baseHealth + stamHealth;
  return this.maxHealth;
}

Entity.prototype.getStamHealth = function() {
  var jumpPoint = 15;
  var multiplier = 10;
  
  // Stamina provides 1 health per stamina for the first 'jumpPoint' points of stamina, and 'multiplier' health per point of stamina thereafter.
  return this.stamina <= jumpPoint ? this.stamina : jumpPoint + multiplier * (this.stamina - jumpPoint);
}

Entity.prototype.attack = function(enemy, damageModifier) {
  if (Math.random() > this.hitChance) {
    return [0, 'Missed'];
  }

  if (Math.random() < enemy.dodgeChance) {
    return [0, 'Dodged'];
  }

  var damage = 0;
  var status = 'Hit';
  var attackPower = this.level + (2 * this.strength);
  damage = damage + attackPower + this.getWeaponDamage(this.gear[Slot.MainHand]);

  var critAmount = 0;
  if (Math.random() <= this.critChance) {
    critAmount = damage * (this.critMultiplier - 1);
    damage = damage + critAmount;
    status = 'Crit'
  }

  var damageReduction = (enemy.armor / this.level + 1) * (enemy.difficulty / Quality.Max + 1) / 8;
  damage = damage / damageReduction;

  if (damageModifier) {
    damage *= damageModifier;
  }

  damage = Math.round(damage);

  enemy.takeDamage(damage);
  return [damage, status, critAmount];
}

Entity.prototype.getWeaponDamage = function(weapon) {
  if (!weapon) {
    return 2 + Math.round(3 * Math.random()); // PUNCH!
  }

  return weapon.getWeaponDamage();
}

Entity.prototype.takeDamage = function(amount) {
  this.health = Math.max(0, this.health - amount);
  return this;
}

Entity.prototype.heal = function(amount) {
  this.health = Math.min(this.maxHealth, this.health + amount);
  return this;
}

Entity.getDifficultyColor = function(difficulty) {
  switch (difficulty) {
    case Quality.Poor :
      return '#808080';
    case Quality.Common :
      return '#DDDDDD';
    case Quality.Uncommon :
      return '#00FF00';
    case Quality.Rare :
      return '#0000FF';
    case Quality.Epic :
      return '#CC00FF';
  }
}