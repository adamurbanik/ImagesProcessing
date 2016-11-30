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
}