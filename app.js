class ImagesProcessingApp {
  constructor() {
    let model = new ListModel([]),
      view = new ListView(model, {
        'gallery': document.getElementById('gallery'),
        'inputButton': document.getElementById('input_element')
      }),
      controller = new ListController(model, view);

    view.show();

  }
}

new ImagesProcessingApp();


