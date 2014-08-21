function Armor() {
  this.hasExtraArmor = false;
  
  this.armor      = 0;
}
Armor.prototype = new Equipment();

Armor.prototype.generateRandomItem = function(slot, level, quality) {
  Equipment.prototype.generateRandomItem.call(this, slot, level, quality);
  var baseStat = level * (quality + 1);
  this.armor = baseStat + Math.round(level * Math.random());
  return this;
}

Armor.prototype.generateName = function(slot, level, quality) {
  return Equipment.prototype.generateName.call(this, slot, level, quality);
}

Armor.prototype.getInventoryTooltipStatsTable = function(equipped) {
  if (!equipped) {
    return this.getCharacterTooltipStatsTable();
  }

  var extraRow = null;
  if (this.armor > 0 || equipped.armor > 0) {
    extraRow = Equipment.prototype.getInventoryTooltipStatsRow.call(this, 'Armor', this.armor, equipped.armor, null, this.hasExtraArmor ? 'font-weight: bold' : '', equipped.hasExtraArmor ? 'font-weight: bold' : '');
  }

  return Equipment.prototype.getInventoryTooltipStatsTable.call(this, equipped, extraRow);
}

Armor.prototype.getCharacterTooltipStatsTable = function(){
  var t = $('<table/>', {
              class: 'stats'
            });

  var extraRow = null;
  if (this.armor > 0) {
    extraRow = Equipment.prototype.getCharacterTooltipStatsRow.call(this, 'Armor', this.armor, this.hasExtraArmor ? 'font-weight: bold' : '');
  }

  return Equipment.prototype.getCharacterTooltipStatsTable.call(this, extraRow);
}