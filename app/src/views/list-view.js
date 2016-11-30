/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */

class ListView {
  constructor(model, elements) {
    this.model = model;
    this.elements = elements;
    this.listModified = new Event(this);
    this.inputButtonClicked = new Event(this);
    this.galleryModified = new Event(this);

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
    let images = this.model.getItems(); console.log(images.length);
    this.elements.gallery.innerHTML = '';

    images.forEach((image) => {
      let dimensions = this.calculateDimensions(image);
      this.drawImage(image, dimensions);
    })
  }

  drawImage(image, dimensions) {
    let lowCanvas = document.createElement("canvas");
    lowCanvas.width = 150;
    lowCanvas.height = 150;
    let ctx = lowCanvas.getContext("2d");
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, lowCanvas.width, lowCanvas.height);
    ctx.drawImage(image, dimensions["positionX"], dimensions["positionY"], dimensions["width"], dimensions["height"]);
    let dataURL = lowCanvas.toDataURL();

    var thumb = document.createElement("img");
    thumb.src = dataURL;
    thumb.alt = image.src;

    thumb.onclick = (event) => openImage();

    let gallery = this.elements.gallery;
    gallery.appendChild(thumb);

  }

  calculateDimensions(img) {
    let maxWidth = 150;
    let maxHeight = 150;
    let ratio = 0;
    let width = img.width;
    let height = img.height;
    let positionX = 0;
    let positionY = 0;

    if (width > maxWidth) {
      ratio = maxWidth / width;
      height = height * ratio;
      width = width * ratio;
    }
    if (height > maxHeight) {
      ratio = maxHeight / height;
      width = width * ratio;
      height = height * ratio;
    }

    positionY = (maxHeight - height) / 2;
    positionX = (maxWidth - width) / 2;

    let dimensionsObj = {
      "width": width,
      "height": height,
      "positionY": positionY,
      "positionX": positionX
    };

    return dimensionsObj;

  }

  openImage(event) {
    let myWindow = window.open(event.currentTarget.alt, "mywin",
      'resizable=yes,scrollbars=yes,location=yes');
  }

}