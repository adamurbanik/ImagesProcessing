/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */

class ListModel {
  constructor(items) {
    this.items = items;
    this.itemAdded = new Event(this);
  }

  getItems() {
    return this.items || [];
  }

  addItem(item) { 
    this.items.push(item);
    this.itemAdded.notify({ item: item });
  }
}

