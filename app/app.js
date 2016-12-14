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


