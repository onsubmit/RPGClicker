function Game()
{
  this.player = new Player();
  this.enemy = this.makeEnemy();
  setInterval(this.updateUI, 50);
}

Game.prototype.updateUI = function() {
  var p = window.game.player;
  var e = window.game.enemy;
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
  $('#enemyHealthText').text(Math.round(e.health) + ' / ' + e.maxHealth);
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
        this.enemy = this.makeEnemy();
        this.updateUI();
    }
  }

  console.log('Player: ' + this.player.health);
  console.log('Enemy: ' + this.enemy.health);
}

Game.prototype.makeEnemy = function() {
  var quality = Quality.Poor;
  var rand = Math.random();

  if (this.player.level < 3 || rand < 0.2) {
    quality = Quality.Poor;
  }
  else {
    quality = quality.Common;
  }

  if (this.player.level > 4 && rand < 0.75) {
    quality = quality.Uncommon;
  }
  else if (this.player.level > 9 && rand < 0.90) {
    quality = quality.Rare;
  }
  else if (this.player.level > 19 && rand < 0.95) {
    quality = quality.Epic;
  }
  else if (this.player.level > 29 && rand < 0.98) {
    quality = quality.Legendary;
  }
  else if (this.player.level > 59 && rand < 0.99) {
    quality = quality.Artifact;
  }

  return (new Brute()).generateRandomEnemy(this.player.level, quality);
}

var game = new Game();