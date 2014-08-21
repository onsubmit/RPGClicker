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
  return this.minDamage + Math.round((this.maxDamage - this.minDamage) * Math.random());
}

Weapon.prototype.generateName = function(slot, level, quality) {
  return Equipment.prototype.generateName.call(this, slot, level, quality);
}

Weapon.prototype.getInventoryTooltipStatsTable = function(equipped) {
  if (!equipped) {
    return this.getCharacterTooltipStatsTable();
  }

  var self = this;
  var extraRow = Equipment.prototype.getInventoryTooltipStatsRow.call(this, 'Damage', this.getDamageString(), equipped.getDamageString(), function() { return Equipment.compare(self.maxDamage, equipped.maxDamage)});

  return Equipment.prototype.getInventoryTooltipStatsTable.call(this, equipped, extraRow);
}

Weapon.prototype.getCharacterTooltipStatsTable = function() {
  var t = $('<table/>', {
              class: 'stats'
            });

  var extraRow = Equipment.prototype.getCharacterTooltipStatsRow.call(this, 'Damage', this.getDamageString());
  return Equipment.prototype.getCharacterTooltipStatsTable.call(this, extraRow);
}

Weapon.prototype.getDamageString = function() {
  return this.minDamage + '\u2013' + this.maxDamage;
}
