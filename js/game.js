function Game()
{
  this.enemyDamageModifier = 0.6;

  this.player = new Player();
  this.enemyLevel = this.player.level;
  this.enemy = this.makeEnemy();
  this.enemyHealthShown = false;
  this.experienceShown = false;
  this.experienceAnimationNeeded = false;
  this.autoAttackTimerId = -1;
  this.autoSellQualities = [];
  setInterval(this.updateUI, 50);
  setInterval(this.autoSell, 1000);
}

Game.prototype.autoSell = function() {
  var g = window.game;
  var p = g.player;
  var q = g.autoSellQualities;
  for (var i = 0; i < p.inventory.items.length; i++) {
    var item = p.inventory.items[i];
    if (item && q[item.quality]) {
      g.removeItemFromInventory(item);
      p.sellItem(item);
    }
  }
}

Game.prototype.updateUI = function() {
  var g = window.game;
  var p = g.player;
  var e = g.enemy;
  p.regenHealth(50);
  var healthWidth = Math.ceil(150 * p.health / p.maxHealth);
  var red = Math.floor(255 * (1 - healthWidth / 150));
  var green = Math.floor(192 * (healthWidth / 150));
  var rgb = 'rgb(' + red + ', ' + green + ', 0)';
  var healthString = Math.round(p.health) + ' / ' + p.maxHealth;
  $('#playerHealthBar').width(healthWidth).css('background-color', rgb);
  $('#playerHealthText').text(healthString);

  healthWidth = Math.ceil(150 * e.health / e.maxHealth);
  var red = Math.floor(255 * (1 - healthWidth / 150));
  var green = Math.floor(192 * (healthWidth / 150));
  rgb = 'rgb(' + red + ', ' + green + ', 0)';
  $('#enemyHealthBar').width(healthWidth).css('background-color', rgb);

  $('#enemyHealth').css('border-color', Entity.getDifficultyColor(e.difficulty));
  if (g.enemyHealthShown) {
    $('#enemyHealthText').text(g.getEnemyHealthText());
  }
  else {
    $('#enemyHealthText').text(g.getEnemyName());
  }

  var xpWidthPercentage = 100 * p.xp / p.xpMax;

  if (this.experienceAnimationNeeded) {
    this.experienceAnimationNeeded = false;
    $('#experienceBar').animate({ width: xpWidthPercentage + '%' }, 50);
  }

  if (g.experienceShown) {
    $('#experienceBarText').text(g.getPlayerExperienceText());
  }
  else {
    $('#experienceBarText').text(g.getPlayerLevelText());
  }

  var ilvl = 0;
  for (var i = 0; i < Slot.Max; i++) {
    var equipped = p.gear[i];
    if (equipped) {
      ilvl += equipped.ilvl;
    }
  }


  $('#statsItemLevel').text(ilvl);
  $('#statsHealth').text(healthString);
  $('#statsStamina').text(p.stamina);
  $('#statsStrength').text(p.strength);
  $('#statsAgility').text(p.agility);
  $('#statsArmor').text(p.armor);
  $('#statsHit').text((100 * p.hitChance).toFixed(2));
  $('#statsDodge').text((100 * p.dodgeChance).toFixed(2));
  $('#statsCrit').text((100 * p.critChance).toFixed(2));
  $('#statsCritMult').text(p.critMultiplier.toFixed(2));
  $('#statsHP5').text((100 * p.hp5Pct).toFixed(2));
  $('#statsHPKill').text((100 * p.hpKillPct).toFixed(2) + ' (' + Math.round(p.hpKillPct * p.maxHealth) + ')');

  $('#money').text(Equipment.getMoneyString(p.money))
}

Game.prototype.getPlayerLevelText = function() {
  return 'Level ' + this.player.level;
}

Game.prototype.getPlayerExperienceText = function() {
  return Math.round(this.player.xp) + ' / ' + this.player.xpMax;
}

Game.prototype.getEnemyHealthText = function() {
  return Math.round(this.enemy.health) + ' / ' + this.enemy.maxHealth;
}

Game.prototype.getEnemyName = function() {
  return this.enemy.name + ' (' + this.enemy.level + ')';
}

Game.prototype.updatePlayerCombatText = function(damage) {
  this.updateCombatText('playerCombatText', damage);
}

Game.prototype.updateEnemyCombatText = function(damage) {
  this.updateCombatText('enemyCombatText', damage);
}

Game.prototype.clearCombatText = function() {
  this.updateCombatText('playerCombatText');
  this.updateCombatText('enemyCombatText');
}

Game.prototype.updateCombatText = function(id, damage) {
    if (!damage) {
      $('#' + id).text('');
      return;
    }

    var value = damage[0];
    var state = damage[1];
    var critValue = damage[2];

    if (value > 0) {
      $('#' + id).text(value).css('font-weight', critValue > 0 ? 'bold' : 'normal');
    }
    else {
      $('#' + id).text(state).css('font-weight', 'normal');
    }
}

Game.prototype.runAway = function() {
  this.enemy = this.makeEnemy();
  this.clearCombatText();
  this.updateUI();
}

Game.prototype.step = function() {
  this.updateUI();

  var playerAttackFirst = Math.random() > 0.5;

  if (playerAttackFirst) {
    this.attackEnemy();
  }
  else {
    this.attackPlayer();
  }
}

Game.prototype.attackEnemy = function() {
  var damage = this.player.attack(this.enemy);
  this.updateEnemyCombatText(damage);

  if (this.enemy.isDead()) {
      this.lootEnemy();
      this.player.heal(this.player.hpKillPct * this.player.maxHealth);
      this.enemy = this.makeEnemy();
      this.updateUI();
  }
  else {
    damage = this.enemy.attack(this.player, this.enemyDamageModifier);
    this.updatePlayerCombatText(damage);

    if (this.player.isDead()) {
      if (confirm("You died. Play again?")) {
        this.player = new Player();
        this.enemyLevel = this.player.level;
        this.enemy = this.makeEnemy();
        this.updateUI();
      }
    }
  }
}

Game.prototype.attackPlayer = function() {
  var damage = this.enemy.attack(this.player, this.enemyDamageModifier);
  this.updatePlayerCombatText(damage);

  if (this.player.isDead()) {
    if (confirm("You died. Play again?")) {
      this.player = new Player();
      this.enemyLevel = this.player.level;
      this.enemy = this.makeEnemy();
      this.updateUI();
    }
  }
  else {
    damage = this.player.attack(this.enemy);
    this.updateEnemyCombatText(damage);

    if (this.enemy.isDead()) {
        this.lootEnemy();
        this.player.heal(this.player.hpKillPct * this.player.maxHealth);
        this.enemy = this.makeEnemy();
        this.updateUI();
    }
  }
}

Game.prototype.setEnemyLevel = function(level) {
  this.enemyLevel = level;
}

Game.prototype.lootEnemy = function() {
  var drops = this.enemy.dropLoot();
  var money = drops[0];
  this.player.money += money;

  var oldLevel = this.player.level;
  var xpPercentage = drops[1];
  this.player.addXP(xpPercentage);
  this.experienceAnimationNeeded = true;

  if (this.player.level > oldLevel) {
    this.enemyLevel = this.player.level;
  }

  var loot = drops[2];
  if (loot) {
    if (!this.player.gear[loot.slot]) {
      this.equipDrop(loot);
    }
    else if (!this.player.inventory.isFull()) {
      this.addItemToInventory(loot);
      $('#autoSell' + loot.quality).show();
    }
    else {
      if ($('#autoAttack').is(':checked') && game.autoAttackTimerId >= 0)
      $('#autoAttack').prop('checked', false);
      clearInterval(game.autoAttackTimerId);
      game.autoAttackTimerId = -1;
      alert('Inventory full. Can\'t loot item.');
    }
  }
}

Game.prototype.addItemToInventory = function(item) {
  this.player.inventory.add(item);
  if (item.inventoryIndex >= 0) {
    this.displayItemInInventory(item);
  }
}

Game.prototype.displayItemInInventory = function(item) {
  var selector = '#i' + item.inventoryIndex + ' div';
  var icon = Equipment.getIcon(item);
  $(selector).replaceWith(icon);
}

Game.prototype.removeItemFromInventory = function(item) {
  var selector = '#i' + item.inventoryIndex + ' div';
  var self = $(selector);
  self.fadeOut("fast", function() { self.replaceWith($('<div/>')) });
}

Game.prototype.sellAllItemsFromInventory = function() {
  for (var i = 0; i < this.player.inventory.items.length; i++) {
    var item = this.player.inventory.items[i];

    if (item) {
      this.removeItemFromInventory(item);
      this.player.sellItem(item);
    }
  }
}

Game.prototype.displayItemOnCharacter = function(item) {
  var selector = '#c' + item.slot + ' div';
  var icon = Equipment.getIcon(item);
  $(selector).replaceWith(icon);
}

Game.prototype.removeItemFromCharacter = function(item) {
  var selector = '#c' + item.slot + ' div';
  $(selector).replaceWith($('<div/>'));
}

Game.prototype.equipDrop = function(item) {
  var itemMovedToInventory = this.player.equipDrop(item);

  if (itemMovedToInventory) {
    this.displayItemInInventory(item);
  }
  else {
    this.displayItemOnCharacter(item);
  }
}

Game.prototype.unEquipItem = function(item) {
  if (this.player.inventory.isFull()) {
    alert('Inventory full. Can\'t unequip item.');
    return;
  }

  var invSelector = '#i' + this.player.inventory.firstOpenSlot + ' div';
  var chrSelector = '#c' + item.slot + ' div';

  var posInv = $(invSelector).position();
  var posChr = $(chrSelector).position();

  var g = this;
  $(chrSelector + ' div.tooltip').remove();
  $(chrSelector).css({ position: 'absolute', top: posChr.top, left: posChr.left }).animate({
      top: posInv.top - $(chrSelector).height() / 2,
      left: posInv.left,
      opacity: '0'
    }, 250).promise().done(
    function(){
      g.player.unEquipItem(item);
      g.removeItemFromCharacter(item);
      g.addItemToInventory(item);
    });
}

Game.prototype.equipItemFromInventory = function(item) {
  var invSelector = '#i' + item.inventoryIndex + ' div';
  var chrSelector = '#c' + item.slot + ' div';

  var posInv = $(invSelector).position();
  var posChr = $(chrSelector).position();

  var g = this;
  if (this.player.gear[item.slot]) {
    $(chrSelector + ' div.tooltip').remove();

    $(chrSelector).css({ position: 'absolute', top: posChr.top, left: posChr.left }).animate({
        top: posInv.top - $(chrSelector).height() / 2,
        left: posInv.left,
        opacity: '0'
      }, 250);
  }

  $(invSelector + ' div.tooltip').remove();
  $(invSelector).css({ position: 'absolute', top: posInv.top, left: posInv.left }).animate({
      top: posChr.top - $(invSelector).height() / 2,
      left: posChr.left,
      opacity: '0'
    }, 250).promise().done(
    function(){
      g.removeItemFromInventory(item);
      var itemReplacedFromGear = g.player.equipItemFromInventory(item);
      g.displayItemOnCharacter(item);

      if (itemReplacedFromGear) {
        g.displayItemInInventory(itemReplacedFromGear);
      }
    });
}

Game.prototype.makeEnemy = function() {
  var quality = Quality.Poor;
  var rand = Math.random();

  if (this.player.level < 3) {
    quality = Quality.Poor;
  }
  else {
    quality = Quality.Common;
  }

  if (this.player.level > 3 && rand < 0.5) {
    quality = Quality.Uncommon;
  }
  else if (this.player.level > 6 && rand < 0.75) {
    quality = Quality.Rare;
  }
  else if (this.player.level > 13 && rand < 0.9) {
    quality = Quality.Epic;
  }
  else if (this.player.level > 19 && rand < 0.98) {
    quality = Quality.Legendary;
  }
  else if (this.player.level > 29) {
    quality = Quality.Artifact;
  }

  var index = Math.floor(Enemies.list.length * Math.random());
  var enemy = Enemies.list[index];
  return (new enemy()).generateRandomEnemy(this.enemyLevel, quality);
}

var game = new Game();

$(document).ready(function() {
    $('#enemyHealthText').hover(
      function() {
        game.enemyHealthShown = true;
        $(this).text(game.getEnemyHealthText())
      },
      function() {
        game.enemyHealthShown = false;
        $(this).text(game.getEnemyName())
      }
    );

    $('#experienceBarText').hover(
      function() {
        game.experienceShown = true;
        $(this).text(game.getPlayerExperienceText())
      },
      function() {
        game.experienceShown = false;
        $(this).text(game.getPlayerLevelText())
      }
    );

    var changeCheck = function() {
      var data = $(this).val();
      var quality = data[0];
      var checked = data[1] == "true";
      $(this).text(checked ? '\u2610' : '\u2611');
      $(this).val([quality, !checked]);
      game.autoSellQualities[quality] = !checked;
    }

    $('#sell').click(function() { game.sellAllItemsFromInventory() });
    $('#autoSell0').css('color', Entity.getDifficultyColor(Quality.Poor)).val([Quality.Poor, false]).click(changeCheck);
    $('#autoSell1').css('color', Entity.getDifficultyColor(Quality.Common)).val([Quality.Common, false]).click(changeCheck).hide();
    $('#autoSell2').css('color', Entity.getDifficultyColor(Quality.Uncommon)).val([Quality.Uncommon, false]).click(changeCheck).hide();
    $('#autoSell3').css('color', Entity.getDifficultyColor(Quality.Rare)).val([Quality.Rare, false]).click(changeCheck).hide();
    $('#autoSell4').css('color', Entity.getDifficultyColor(Quality.Epic)).val([Quality.Epic, false]).click(changeCheck).hide();
    $('#autoSell5').css('color', Entity.getDifficultyColor(Quality.Legendary)).val([Quality.Legendary, false]).click(changeCheck).hide();
    $('#autoSell6').css('color', Entity.getDifficultyColor(Quality.Artifact)).val([Quality.Artifact, false]).click(changeCheck).hide();

    $('#autoAttack').change(function() {
      var self = $(this);
      var isChecked = self.is(':checked');

      if(isChecked) {
        game.autoAttackTimerId = setInterval(function() {
          if (game.player.health / game.player.maxHealth < 0.25 && game.autoAttackTimerId >= 0) {
            self.prop('checked', false);
            clearInterval(game.autoAttackTimerId);
            game.autoAttackTimerId = -1;
            return;
          }

          game.step.call(game);
        }, 50);
      } else {
        clearInterval(game.autoAttackTimerId);
      }
    });


    $('body')
      .bind("contextmenu", function(e) { return false; })
      .attr('unselectable', 'on')
      .css({
        MozUserSelect: 'none',
        KhtmlUserSelect: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      })
      .each(function() { 
        this.onselectstart = function() { return false; };
    });
});