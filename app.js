/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

class ListController {
  constructor(model, view, processImages) {
    this.model = model;
    this.view = view;
    this.processImages = processImages;
    this.attachViewListeners();
  }

  attachViewListeners() {
    this.view.inputButtonClicked.attach((sender) => this.addItem(sender));
    this.view.galleryModified.attach((sender, args) => this.updateGallery(sender, args));
  }

  addItem(sender) {
    let files = Array.from(sender.elements.inputButton.files);
    if (files) this.processFiles(files);
  }

  updateGallery(sender, args) {
    let files = Array.from(args.dataTransfer.files);
    if (files) this.processFiles(files);
  }

  processFiles(files) {
    this.processImages.getImages(files).then((images) => images.forEach((image) => this.model.addItem(image)));
  }

}


class Event {
  constructor(sender) {
    this.sender = sender;
    this.listeners = [];
  }

  attach(listener) {
    this.listeners.push(listener);
  }
  notify(args) { 
    this.listeners.forEach((item) => item(this.sender, args));
  }
}


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



class ProcessImages {

  getImages(files) {
    return new Promise((resolve, reject) => {
      let images = [];
      files.forEach((file, index) => {
        this.getImage(file)
          .then((image) => {
            images.push(image);
            if (index === files.length - 1) resolve(images);
          });
      })
    })

  }

  getImage(file) {
    const readReader = () => {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        let url = reader.readAsDataURL(file);
        reader.onload = (event) => resolve(event);
        reader.onerror = (err) => reject(err);
      })
    }

    const getReaderImage = (event) => {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = (event) => resolve(event.path[0]);
        img.src = event.target.result;
      });
    }

    return readReader()
      .then(getReaderImage);
  }

  createImage(image) {
    let dimensions = this.calculateDimensions(image);

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

    return thumb;
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

}



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


class ImagesProcessingApp {
  constructor() {
    let processImages = new ProcessImages();
    let model = new ListModel([]),
      view = new ListView(model, {
        'gallery': document.getElementById('gallery'),
        'inputButton': document.getElementById('input_element')
      }, processImages),
      controller = new ListController(model, view, processImages);

    view.show();

  }
}

new ImagesProcessingApp();