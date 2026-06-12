class Sliders {
    constructor() {
        this.container = {};
    }

    add_slider(name, min, max, val, step, comment="") {
        this.container[name] = {
            slider: createSlider(min, max, val, step),
            label: createSpan(name),
            note: comment
        }
    }

    set_val(name, val) {
        this.container[name].slider.value(val);
    }

    create_sliders(x=10, startY=10, spacing=25, width=windowWidth/5*2) {
        let idx = 0;
        for (let name in this.container) {

            let slider = this.container[name].slider;
            let label = this.container[name].label;
            let y = startY + idx*spacing;

            slider.position(x, y);
            slider.size(width);
            label.position(x + width + 10, y);
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
          return this.container[name].slider.value();
    }
}