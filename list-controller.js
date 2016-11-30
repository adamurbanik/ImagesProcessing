/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */

class ListController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.attachViewListeners();
  }

  attachViewListeners() {
    this.view.inputButtonClicked.attach((sender) => this.addItem(sender));
    this.view.galleryModified.attach((sender, args) => this.updateGallery(sender, args));
  }

  addItem(sender) {
    let files = Array.from(sender.elements.inputButton.files);
    if (files) this.getImages(files).then((images) => images.forEach((image) => this.model.addItem(image)));
  }

  updateGallery(sender, args) { console.log('updating',sender, args)
    let files = Array.from(args.dataTransfer.files);
    if (files) this.getImages(files).then((images) => images.forEach((image) => this.model.addItem(image)));    
  }

  getImages(files) {
    return new Promise((resolve, reject) => {
      let images = [];
      files.forEach((file, index) => {
        this.getImage(file)
          .then((image) => {
            images.push(image); console.log(index)
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

    // const storeImage = (image) => {
    //   return new Promise((resolve, reject) => {

    //   })
    // }
    // this.images.push(image); //this.model.addItem(image);


    return readReader()
      .then(getReaderImage);
    // .then(storeImage)


  }
}
