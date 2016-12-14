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