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

Armor.prototype.getTooltipStatsTable = function(t) {
  var t = $('<table/>', {
              class: 'stats'
            });

  t.append(Equipment.getStatsRow('Armor', this.armor, this.hasExtraArmor ? 'font-weight: bold; color: #0f0' : ''));
  return Equipment.prototype.getTooltipStatsTable.call(this, t);
}