/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

class ListView {
  constructor(model, elements, processImages) {
    this.model = model;
    this.elements = elements;
    this.listModified = new Event(this);
    this.inputButtonClicked = new Event(this);
    this.galleryModified = new Event(this);

    this.processImages = processImages;
    
    this.attachModelListeners();
    this.attachHtmlListeners();
  }

  attachModelListeners() {
    this.model.itemAdded.attach(() => this.rebuildList());
  }

  attachHtmlListeners() {
    this.elements.inputButton.onchange = () => this.inputButtonClicked.notify();

    document.ondragover = (event) => event.preventDefault();
    document.ondragenter = (event) => event.preventDefault();
    document.ondrop = (event) => this.ondropHandler(event);

  }

  ondropHandler(event) {
    event.preventDefault();
    this.galleryModified.notify(event);
  }

  show() {
    this.rebuildList();
  }

  rebuildList() {
    let images = this.model.getItems();
    this.elements.gallery.innerHTML = '';
    images.forEach((image) => this.drawImage(image))
  }

  drawImage(image) {
    let thumb = this.processImages.createImage(image);
    thumb.onclick = (event) => this.openImage(event);
    this.elements.gallery.appendChild(thumb);
  }

  openImage(event) {
    let myWindow = window.open(event.currentTarget.alt, "mywin",
      'resizable=yes,scrollbars=yes,location=yes');
  }

}