function Enemies() {}
Enemies.list = [ Brute, Demon, Dinosaur, Dragon, Elemental, Giant, Goblin, Mech, Nymph, Ogre];

function Brute() {
  this.name = "Brute"
  
  this.baseStrength   = 2;
  this.baseAgility    = 1;
  this.baseStamina    = 4;
}
Brute.prototype = new Entity();

Brute.prototype.generateRandomEnemy = function(level, dropQuality) {
  return Enemy.prototype.generateRandomEnemy.call(this, level, dropQuality);
}

Brute.prototype.generateRandomGear = function(level, averageQuality) {
  return Enemy.prototype.generateRandomGear.call(this, level, averageQuality);
}

Brute.prototype.dropLoot = function() {
  return Enemy.prototype.dropLoot.call(this);
}

function Demon() {
  this.name = "Demon"
  
  this.baseStrength   = 1;
  this.baseAgility    = 3;
  this.baseStamina    = 3;
}
Demon.prototype = new Entity();

Demon.prototype.generateRandomEnemy = function(level, dropQuality) {
  return Enemy.prototype.generateRandomEnemy.call(this, level, dropQuality);
}

Demon.prototype.generateRandomGear = function(level, averageQuality) {
  return Enemy.prototype.generateRandomGear.call(this, level, averageQuality);
}

Demon.prototype.dropLoot = function() {
  return Enemy.prototype.dropLoot.call(this);
}

function Dinosaur() {
  this.name = "Dinosaur"
  
  this.baseStrength   = 4;
  this.baseAgility    = 2;
  this.baseStamina    = 5;
}
Dinosaur.prototype = new Entity();

Dinosaur.prototype.generateRandomEnemy = function(level, dropQuality) {
  return Enemy.prototype.generateRandomEnemy.call(this, level, dropQuality);
}

Dinosaur.prototype.generateRandomGear = function(level, averageQuality) {
  return Enemy.prototype.generateRandomGear.call(this, level, averageQuality);
}

Dinosaur.prototype.dropLoot = function() {
  return Enemy.prototype.dropLoot.call(this);
}

function Dragon() {
  this.name = "Dragon"
  
  this.baseStrength   = 4;
  this.baseAgility    = 3;
  this.baseStamina    = 5;
}
Dragon.prototype = new Entity();

Dragon.prototype.generateRandomEnemy = function(level, dropQuality) {
  return Enemy.prototype.generateRandomEnemy.call(this, level, dropQuality);
}

Dragon.prototype.generateRandomGear = function(level, averageQuality) {
  return Enemy.prototype.generateRandomGear.call(this, level, averageQuality);
}

Dragon.prototype.dropLoot = function() {
  return Enemy.prototype.dropLoot.call(this);
}

function Elemental() {
  this.name = "Elemental"
  
  this.baseStrength   = 1;
  this.baseAgility    = 5;
  this.baseStamina    = 2;
}
Elemental.prototype = new Entity();

Elemental.prototype.generateRandomEnemy = function(level, dropQuality) {
  return Enemy.prototype.generateRandomEnemy.call(this, level, dropQuality);
}

Elemental.prototype.generateRandomGear = function(level, averageQuality) {
  return Enemy.prototype.generateRandomGear.call(this, level, averageQuality);
}

Elemental.prototype.dropLoot = function() {
  return Enemy.prototype.dropLoot.call(this);
}

function Giant() {
  this.name = "Giant"
  
  this.baseStrength   = 4;
  this.baseAgility    = 1;
  this.baseStamina    = 5;
}
Giant.prototype = new Entity();

Giant.prototype.generateRandomEnemy = function(level, dropQuality) {
  return Enemy.prototype.generateRandomEnemy.call(this, level, dropQuality);
}

Giant.prototype.generateRandomGear = function(level, averageQuality) {
  return Enemy.prototype.generateRandomGear.call(this, level, averageQuality);
}

Giant.prototype.dropLoot = function() {
  return Enemy.prototype.dropLoot.call(this);
}

function Goblin() {
  this.name = "Goblin"
  
  this.baseStrength   = 1;
  this.baseAgility    = 3;
  this.baseStamina    = 3;
}
Goblin.prototype = new Entity();

Goblin.prototype.generateRandomEnemy = function(level, dropQuality) {
  return Enemy.prototype.generateRandomEnemy.call(this, level, dropQuality);
}

Goblin.prototype.generateRandomGear = function(level, averageQuality) {
  return Enemy.prototype.generateRandomGear.call(this, level, averageQuality);
}

Goblin.prototype.dropLoot = function() {
  return Enemy.prototype.dropLoot.call(this);
}

function Mech() {
  this.name = "Mech"
  
  this.baseStrength   = 2;
  this.baseAgility    = 2;
  this.baseStamina    = 3;
}
Mech.prototype = new Entity();

Mech.prototype.generateRandomEnemy = function(level, dropQuality) {
  return Enemy.prototype.generateRandomEnemy.call(this, level, dropQuality);
}

Mech.prototype.generateRandomGear = function(level, averageQuality) {
  return Enemy.prototype.generateRandomGear.call(this, level, averageQuality);
}

Mech.prototype.dropLoot = function() {
  return Enemy.prototype.dropLoot.call(this);
}

function Nymph() {
  this.name = "Nymph"
  
  this.baseStrength   = 1;
  this.baseAgility    = 1;
  this.baseStamina    = 3;
}
Nymph.prototype = new Entity();

Nymph.prototype.generateRandomEnemy = function(level, dropQuality) {
  return Enemy.prototype.generateRandomEnemy.call(this, level, dropQuality);
}

Nymph.prototype.generateRandomGear = function(level, averageQuality) {
  return Enemy.prototype.generateRandomGear.call(this, level, averageQuality);
}

Nymph.prototype.dropLoot = function() {
  return Enemy.prototype.dropLoot.call(this);
}

function Ogre() {
  this.name = "Ogre"
  
  this.baseStrength   = 4;
  this.baseAgility    = 1;
  this.baseStamina    = 3;
}
Ogre.prototype = new Entity();

Ogre.prototype.generateRandomEnemy = function(level, dropQuality) {
  return Enemy.prototype.generateRandomEnemy.call(this, level, dropQuality);
}

Ogre.prototype.generateRandomGear = function(level, averageQuality) {
  return Enemy.prototype.generateRandomGear.call(this, level, averageQuality);
}

Ogre.prototype.dropLoot = function() {
  return Enemy.prototype.dropLoot.call(this);
}