class Sliders {
  constructor() {
      this.container = {};
  }

  add_slider(name, min, max, val, step, comment="") {

    let slider = createSlider(min, max, val, step);
    let input = createInput(val.toString(), "number");

    input.size(45);
    input.style('font-family', 'sans-serif');
    input.style('font-size', '12px');
    input.attribute("min", min);
    input.attribute("step", step);
    input.attribute("max", max);
    
    this.container[name] = {
      slider: slider,
      input: input,
      label: createSpan(name),
      note: comment
    }

    // SYNC: changing input box value changes also slider
    input.input(() => {
        let newVal = input.value();
        slider.value(newVal);
    })

    // SYNC: moving slider updates box
    slider.input(() => {
      input.value(slider.value());
    })

  }

  set_val(name, val) {
    this.container[name].slider.value(val);
    this.container[name].input.value(val);
  }

  create_sliders(x=10, startY=10, spacing=25, width=200) {
    let idx = 0;
    for (let name in this.container) {

      let slider = this.container[name].slider;
      let input = this.container[name].input;
      let label = this.container[name].label;
      let y = startY + idx*spacing;

      slider.position(x, y);
      slider.size(width);
      input.position(x + width + 10, y);
      label.position(x + width + 70, y)
      label.style('font-family', 'sans-serif');
      label.style('font-size', '12px');
      label.style('color', 'lightgreen');
      idx++;
    }
  }

  update_labels() {
    for (let name in this.container) {
      let item = this.container[name];
      let note = this.container[name].note;
      let val = item.slider.value();
      item.label.html(`${name}: ${val} ${note}`);
    }
  }

  get(name) {
    return parseFloat(this.container[name].slider.value());
  }
}
