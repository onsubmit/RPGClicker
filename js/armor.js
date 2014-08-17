function Armor() {
  this.m_hasExtraArmor = false;
  
  this.armor      = 0;
}
Armor.prototype = new Equipment();

Armor.prototype.generateRandomItem = function(slot, level, quality) {
  Equipment.prototype.generateRandomItem.call(this, slot, level, quality);
  var baseStat = level * (quality + 1) - 1;
  this.armor = baseStat + Math.round(level * Math.random());
  return this;
}