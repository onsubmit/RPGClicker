function Inventory() {
  this.maxSize = 36;
  this.items = new Array(this.maxSize);
  this.firstOpenSlot = 0;
}

Inventory.prototype.isFull = function() {
  return this.firstOpenSlot < 0;
}

Inventory.prototype.determineFirstOpenSlot = function() {
  this.firstOpenSlot = -1;
  for (var i = 0; i < this.maxSize; i++) {
    if (!this.items[i]) {
      this.firstOpenSlot = i;
      break;
    }
  }

  return this.firstOpenSlot;
}

Inventory.prototype.add = function(item) {
  if (this.isFull()) {
    return -1;
  }

  var index = this.firstOpenSlot;
  item.inventoryIndex = index;
  this.items[index] = item;
  this.determineFirstOpenSlot();
  return index;
}

Inventory.prototype.remove = function(item) {
  if (item.inventoryIndex < this.maxSize && this.items[item.inventoryIndex]) {
    this.items[item.inventoryIndex] = null;
    this.determineFirstOpenSlot();
  }

  return item;
}

Inventory.prototype.replace = function(itemToReplace, replacement) {
  this.items[itemToReplace.inventoryIndex] = replacement;
  replacement.inventoryIndex = itemToReplace.inventoryIndex;
}