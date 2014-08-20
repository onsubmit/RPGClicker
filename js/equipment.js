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
  this.name      = '';
  this.sellValue = 0;

  this.strength   = 0;
  this.agility    = 0;
  this.stamina    = 0;
  this.armor      = 0;

  this.dodgeChance     = 0.0;
  this.hitChance       = 0.0;
  this.critChance      = 0.0;
  this.critMultiplier  = 0.0;

  this.inventoryIndex = -1;
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
  this.name = this.generateName(slot, level, quality);
  this.slot = slot;
  this.quality = quality;
  
  var baseStat = level * (this.quality + 1);
  this.sellValue = 20 * (baseStat + Math.round(level * Math.random()));
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
        this.hasExtraArmor = true;
        this.armor += baseStat + Math.round(level * Math.random());
        break;
      case Attributes.DodgeChance:
        this.dodgeChance = 0.005 + 0.025 * Math.random();
        break;
      case Attributes.HitChance:
        this.hitChance = this.quality / Quality.Max * 0.02 + 0.01 * Math.random();
        break;
      case Attributes.CritChance:
        this.critChance = this.quality / Quality.Max * 0.02 + 0.01 * Math.random();
        break;
      case Attributes.CritMultiplier:
        this.critMultiplier = this.quality / Quality.Max + Math.random();
        break;
    }
  }
  
  return this;
}

Equipment.getIcon = function(item) {
  var borderColor = Entity.getDifficultyColor(item.quality);

  var d = $('<div/>', {
            class: 'item',
            style: 'border: 2px solid ' + borderColor,
            text: item.slot
        });

  var showToolip = function(icon, e) {
    var t = icon.children('.tooltip');

    var left = e.pageX + 10;
    var top = e.pageY + 10;

    if (left + t.width() > $(window).width() - 20) {
      left = e.pageX - t.width() - 10;
    }

    if (top + t.height() > $(window).height() - 20) {
      top = e.pageY - t.height() - 10;
    }

    t.show().css('left', left).css('top', top);
  }

  var hideToolip = function(icon) {
    var t = icon.children('.tooltip');
    t.hide();
  }

  d.append(Equipment.getTooltip(item));

  d.on('mousemove', function(e) { showToolip($(this), e); });
  d.on('mouseout', function(e) { hideToolip($(this)); });

  var rightClick = function() {
    var g = window.game;
    var itemInInventory = item.inventoryIndex >= 0;

    if (itemInInventory) {
      g.equipItemFromInventory(item);
    }
    else {
      g.unEquipItem(item);
    }
  }

  var shiftClick = function() {
    var itemInInventory = item.inventoryIndex >= 0;

    if (itemInInventory) {
      var g = window.game;
      var p = g.player;
      p.sellItem(item);
      g.removeItemFromInventory(item);
    }
  }

  d.mousedown(function(e) {
    switch (e.which) {
        case 1: // left
          if (e.shiftKey) {
            shiftClick();
          }
          break;
        case 2: // middle
          break;
        case 3: // right
            rightClick();
          break;
        default:
    }
  });

  return d;
}

Equipment.getTooltip = function(item) {
  var itemInInventory = item.inventoryIndex >= 0;
  var borderColor = Entity.getDifficultyColor(item.quality);

  var t = $('<div/>', {
            class: 'tooltip',
            style: 'border: 2px solid ' + borderColor
          }).append(
            $('<div/>', {
                style: 'color: ' + borderColor,
                text: item.name
            })
          ).append(item.getTooltipStatsTable());

  if (itemInInventory) {
    t.append($('<div/>', {
       text: 'Right-click to equip',
      style: 'font-style: italic'
    })).append($('<div/>', {
       text: 'Shift-click to sell',
      style: 'font-style: italic'
    }));
  }
  else {
    t.append($('<div/>', {
      text: 'Right-click to unequip',
      style: 'font-style: italic'
    }));
  }

  return t;
}

Equipment.getStatsRow = function(label, value, style) {
  var r = $('<tr/>').append(
            $('<td/>', {
              text: label + ':',
              class: 'alignRight'
            })
          ).append(
            $('<td/>', {
              text: value,
              style: style || ''
            })
          );

  return r;
}

Equipment.prototype.getTooltipStatsTable = function(t) {
    t = t || $('<table/>', {
                class: 'stats'
              });

    if (this.stamina > 0) {
      t.append(Equipment.getStatsRow('Stamina', this.stamina));
    }

    if (this.strength > 0) {
      t.append(Equipment.getStatsRow('Strength', this.strength));
    }

    if (this.agility > 0) {
      t.append(Equipment.getStatsRow('Agility', this.agility));
    }

    if (this.dodgeChance > 0) {
      t.append(Equipment.getStatsRow('Dodge %', (100 * this.dodgeChance).toFixed(2)));
    }

    if (this.hitChance > 0) {
      t.append(Equipment.getStatsRow('Hit %', (100 * this.hitChance).toFixed(2)));
    }

    if (this.critChance > 0) {
      t.append(Equipment.getStatsRow('Crit %', (100 * this.critChance).toFixed(2)));
    }

    if (this.critMultiplier > 0) {
      t.append(Equipment.getStatsRow('Crit Mult', this.critMultiplier.toFixed(2)));
    }

    if (this.sellValue > 0) {
      t.append(Equipment.getStatsRow('Sells for', Equipment.getMoneyString(this.sellValue)));
    }

    return t;
}

Equipment.prototype.generateName = function(slot, level, quality) {
  var prefixes = [];
  var suffixes = [];
  switch (quality) {
    case Quality.Poor :
      prefixes = ['Appalling', 'Broken', 'Defective', 'Embarassing', 'Laughable', 'Shameful', 'Shattered', 'Shitty' ];
      suffixes = ['Apathy', 'Idiocy', 'Ignorance', 'Flatulence'];
      break;
    case Quality.Common :
      prefixes = ['Decent', 'Inferior', 'Lowly', 'Mediocre', 'Plain', 'Simple'];
      suffixes = ['Civility', 'Dignity', 'Contentment', 'Normality'];
      break;
    case Quality.Uncommon :
      prefixes = ['Acceptable', 'Great', 'Satisfactory', 'Worthy'];
      suffixes = ['Intensity', 'Potency', 'Strength', 'Force'];
      break;
    case Quality.Rare :
      prefixes = ['Awesome', 'Fascinating', 'Incredible', 'Marvelous', 'Stunning'];
      suffixes = ['Dynanism', 'Endurance', 'Urgency', 'Vitality'];
      break;
    case Quality.Epic :
      prefixes = ['Epic', 'Heroic', 'Intimidating', 'Magnificent'];
      suffixes = ['Astonishment', 'Horror', 'Shock', 'Wonderment'];
      break;
    case Quality.Legendary :
      prefixes = ['Illustrious', 'Legendary', 'Mythical', 'Renowned'];
      suffixes = ['Authority', 'Greatness', 'Luster', 'Power'];
      break;
    case Quality.Artifact :
      prefixes = ['Ludicrous', 'Impossible', 'Ridiculous', 'Unbelievable'];
      suffixes = ['Prestige', 'Significance', 'Superiority'];
      break;
  }

  var names = []
  switch (slot) {
    case Slot.Head :
      names = ['Hat', 'Headgear', 'Helmet', 'Shako'];
      break;
    case Slot.Shoulder :
      names = ['Mantle', 'Pauldrons', 'Shoulderplates', 'Shoulders', 'Spaulders'];
      break;
    case Slot.Chest :
      names = ['Breastplate', 'Carapace', 'Chestguard', 'Chestpiece', 'Chestplate' ];
      break;
    case Slot.Back :
      names = ['Cape', 'Cloak', 'Drape', 'Wrap'];
      break;
    case Slot.Wrist :
      names = ['Armplates', 'Bracers', 'Wristplates', 'Shackles', 'Vambraces'];
      break;
    case Slot.Hands :
      names = ['Gauntlets', 'Fists', 'Gloves', 'Grips', 'Mitts'];
      break;
    case Slot.Waist :
      names = ['Belt', 'Clasp', 'Girdle', 'Girth', 'Waistband'];
      break;
    case Slot.Legs :
      names = ['Greaves', 'Leggaurds', 'Legplates', 'Pants'];
      break;
    case Slot.Feet :
      names = ['Boots', 'Shoes', 'Stompers', 'Treads'];
      break;
    case Slot.Neck :
      names = ['Amulet', 'Chain', 'Choker', 'Locket', 'Necklace', 'Pearls', 'Pendant', 'Strand'];
      break;
    case Slot.Trinket1 :
    case Slot.Trinket2 :
      names = ['Diamond', 'Crystal', 'Eyeball', 'Rock', 'Sigil', 'Talisman', 'Vial'];
      break;
    case Slot.MainHand :
    case Slot.OffHand :
      names = ['Axe', 'Blade', 'Cleaver', 'Knife', 'Hacker', 'Ripper', 'Saber', 'Scalpel', 'Scimitar', 'Sword'];
      break;
  }

  var index = Math.floor(prefixes.length * Math.random());
  var prefix = prefixes[index];

  index = Math.floor(names.length * Math.random());
  var name = names[index];

  index = Math.floor(suffixes.length * Math.random());
  var suffix = suffixes[index];

  return prefix + " " + name + " of " + suffix;
}

Equipment.getMoneyString = function(money) {
  var copper = Math.floor(money % 100);
  money = Math.floor((money - copper) / 100);
  var silver = Math.floor(money % 100);
  var gold = Math.floor((money - silver) / 100);

  var moneyString = '';
  moneyString += gold > 0 ? gold + 'g ' : '';
  moneyString += silver > 0 ? silver + 's ' : '';
  moneyString += copper + 'c';

  return moneyString;
}