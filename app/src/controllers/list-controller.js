/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

class ListController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.processImages = new ProcessImages();
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

  processFiles(files){
    this.processImages.getImages(files).then((images) => images.forEach((image) => this.model.addItem(image)));    
  }

}
