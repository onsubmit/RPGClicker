function Game()
{
  this.player = new Player();
  this.enemy = this.makeEnemy();
  this.enemyHealthShown = false;
  this.experienceShown = false;
  setInterval(this.updateUI, 50);
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
  $('#playerHealthBar').width(healthWidth).css('background-color', rgb);
  $('#playerHealthText').text(Math.round(p.health) + ' / ' + p.maxHealth);

  healthWidth = Math.ceil(150 * e.health / e.maxHealth);
  var red = Math.floor(255 * (1 - healthWidth / 150));
  var green = Math.floor(192 * (healthWidth / 150));
  rgb = 'rgb(' + red + ', ' + green + ', 0)';
  $('#enemyHealthBar').width(healthWidth).css('background-color', rgb);

  $('#enemyHealth').css('border-color', g.getEnemyDifficultyColor());
  if (g.enemyHealthShown) {
    $('#enemyHealthText').text(g.getEnemyHealthText());
  }
  else {
    $('#enemyHealthText').text(g.getEnemyName());
  }

  var xpWidthPercentage = 100 * p.xp / p.xpMax;

  $('#experienceBar').width(xpWidthPercentage + '%');

  if (g.experienceShown) {
    $('#experienceBarText').text(g.getPlayerExperienceText());
  }
  else {
    $('#experienceBarText').text(g.getPlayerLevelText());
  }
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

Game.prototype.getEnemyDifficultyColor = function() {
  switch (this.enemy.difficulty) {
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

Game.prototype.updatePlayerCombatText = function(damage) {
  $('#playerCombatText').show().text(damage > 0 ? '-' + damage : 'Miss!').fadeOut(200, function() { $(this).text(''); });
}

Game.prototype.updateEnemyCombatText = function(damage) {
  $('#enemyCombatText').show().text(damage > 0 ? '-' + damage : 'Miss!').fadeOut(200, function() { $(this).text(''); });
}

Game.prototype.step = function() {
  this.updateUI();
  console.log('Player: ' + this.player.health);
  console.log('Enemy: ' + this.enemy.health);

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
  console.log('Player attacks for ' + damage + ' damage');
  console.log('Player: ' + this.player.health);
  console.log('Enemy: ' + this.enemy.health);

  if (this.enemy.isDead()) {
      this.lootEnemy();
      this.enemy = this.makeEnemy();
      this.updateUI();
  }
  else {
    damage = this.enemy.attack(this.player);
    this.updatePlayerCombatText(damage);
    console.log('Enemy attacks for ' + damage + ' damage');

    if (this.player.isDead()) {
      if (confirm("You died. Play again?")) {
        this.player = new Player();
        this.enemy = this.makeEnemy();
        this.updateUI();
      }
    }
  }

  console.log('Player: ' + this.player.health);
  console.log('Enemy: ' + this.enemy.health);
}

Game.prototype.attackPlayer = function() {
  var damage = this.enemy.attack(this.player);
  this.updatePlayerCombatText(damage);
  console.log('Enemy attacks for ' + damage + ' damage');
  console.log('Player: ' + this.player.health);
  console.log('Enemy: ' + this.enemy.health);

  if (this.player.isDead()) {
    if (confirm("You died. Play again?")) {
      this.player = new Player();
      this.enemy = this.makeEnemy();
      this.updateUI();
    }
  }
  else {
    damage = this.player.attack(this.enemy);
    this.updateEnemyCombatText(damage);
    console.log('Player attacks for ' + damage + ' damage');

    if (this.enemy.isDead()) {
        this.lootEnemy();
        this.enemy = this.makeEnemy();
        this.updateUI();
    }
  }

  console.log('Player: ' + this.player.health);
  console.log('Enemy: ' + this.enemy.health);
}

Game.prototype.lootEnemy = function() {
  var drops = this.enemy.dropLoot();
  var gold = drops[0];
  this.player.gold += gold;

  var xpPercentage = drops[1];
  this.player.addXP(xpPercentage);

  var loot = drops[1];
  if (loot) {
    if (!this.player.gear[loot.slot]) {
      this.player.equipItem(loot);
    }
    else if (this.player.inventory.length < 25) {
      this.player.inventory.push(loot);
    }
    else {
      alert('Inventory full. Can\'t loot item.');
    }
  }
}

Game.prototype.makeEnemy = function() {
  var quality = Quality.Poor;
  var rand = Math.random();

  if (this.player.level < 3 || rand < 0.2) {
    quality = Quality.Poor;
  }
  else {
    quality = Quality.Common;
  }

  if (this.player.level > 4 && rand < 0.75) {
    quality = Quality.Uncommon;
  }
  else if (this.player.level > 9 && rand < 0.90) {
    quality = Quality.Rare;
  }
  else if (this.player.level > 19 && rand < 0.95) {
    quality = Quality.Epic;
  }
  else if (this.player.level > 29 && rand < 0.98) {
    quality = Quality.Legendary;
  }
  else if (this.player.level > 59 && rand < 0.99) {
    quality = Quality.Artifact;
  }

  var index = Math.floor(Enemies.list.length * Math.random());
  var enemy = Enemies.list[index];
  return (new enemy()).generateRandomEnemy(this.player.level, quality);
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
});