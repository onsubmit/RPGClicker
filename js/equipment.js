Slot = {
  Head : 0,
  Shoulder : 1,
  Chest : 2,
  Back : 3,
  Wrist : 4,
  Hands : 5,
  Waist : 6,
  Legs : 7,
  Feet : 8,
  Neck : 9,
  Trinket1 : 10,
  Trinket2 : 11,
  MainHand : 12,
  OffHand : 13,
  Max : 13
}

Quality = {
  Poor : 0,
  Common : 1,
  Uncommon : 2,
  Rare : 3,
  Epic : 4,
  Legendary : 5,
  Artifact : 6,
  Max : 6
}

Attributes = {
  Strength : 1,
  Agility : 2,
  Stamina : 3,
  ExtraArmor : 4,
  DodgeChance : 5,
  HitChance : 6,
  CritChance : 7,
  CritMultiplier : 8
}

function Equipment() {
  this.strength   = 0;
  this.agility    = 0;
  this.stamina    = 0;
  this.armor    = 0;

  this.dodgeChance     = 0.0;
  this.hitChance       = 0.0;
  this.critChance      = 0.0;
  this.critMultiplier  = 0.0;
}

Equipment.getDropQuality = function(quality) {
  var rand = Math.random();
  var newQuality = quality;

  if(rand > 0.5) {
    newQuality -= 1;
  }
  else if (rand > 0.75) {
    newQuality -= 2;
  }

  quality = Math.max(0, newQuality);
  
  return quality;
}

Equipment.getAttributeArray = function() {
  return [ Attributes.Strength, Attributes.Agility, Attributes.Stamina, Attributes.ExtraArmor, Attributes.DodgeChance, Attributes.HitChance, Attributes.CritChance, Attributes.CritMultiplier ];
}

Equipment.getAttributeTypes = function(slot, quality) {
  var attributes = [];
  var baseAttributes = Equipment.getAttributeArray();
  var numAttributes = Math.min(quality, Quality.Max);
  for (var i = 0; i < numAttributes; i++)
  {
    var index = Math.floor(baseAttributes.length * Math.random());

    // Weapons can't have armor
    if (slot === Slot.MainHand) {
      while(index == Attributes.ExtraArmor) {
        index = Math.floor(baseAttributes.length * Math.random());
      }
    }
    attributes.push(baseAttributes.splice(index, 1));
  }
  
  return attributes;
}

Equipment.prototype.generateRandomItem = function(slot, level, quality) {
  this.slot = slot;
  this.quality = quality;
  
  var baseStat = level * (this.quality + 1);
  var attributeTypes = Equipment.getAttributeTypes(slot, quality);
  
  for (var i = 0; i < attributeTypes.length; i++) {
    var attributeType = attributeTypes[i][0];
    switch (attributeType) {
      case Attributes.Strength:
        this.strength = baseStat + Math.round(level * Math.random());
        break;
      case Attributes.Agility:
        this.agility = baseStat + Math.round(level * Math.random());
        break;
      case Attributes.Stamina:
        this.stamina = baseStat + Math.round(level * Math.random());
        break;
      case Attributes.ExtraArmor:
        this.m_hasExtraArmor = true;
        this.armor += baseStat + Math.round(level * Math.random());
        break;
      case Attributes.DodgeChance:
        this.dodgeChance = 0.005 + 0.025 * Math.random();
        break;
      case Attributes.HitChance:
        this.hitChance = 0.02 * Math.random();
        break;
      case Attributes.CritChance:
        this.critChance = 0.02 * Math.random();
        break;
      case Attributes.CritMultiplier:
        this.critMultiplier = 0.1 * Math.min(100, baseStat) * Math.random();
        break;
    }
  }
  
  return this;
}