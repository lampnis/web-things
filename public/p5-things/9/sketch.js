let position;
let velocity;
let boxSide;
let ballRadius;
let r;
let theta;
let sliders;

let period = 120; // in frameCount units
let amplitude = 100;

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

    create_sliders(x=10, startY=10, spacing=25, width=200) {
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
            label.style('color', 'green');



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


class Oscillators {
    constructor() {
        this.oscillators = [];
    }



}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    params = new Sliders;
    params.add_slider("big_radius", 0, 1, 0.5, 0.01);
    params.add_slider("amplitude", 0, 1, 0.5, 0.01);
    params.add_slider("phase", 0, 1, 0.5, 0.01);
    params.add_slider("small_radius", 0, 200, 10, 0.5);
    params.add_slider("period", 0, 100, 50, 0.5, "(smaller -> faster)");
    params.add_slider("offset", -windowHeight, windowHeight, 0, windowHeight/1000)

    position = createVector(100, 100, 100);
    velocity = createVector(2.5, 2, 2);
    r = height * 0.4;
    theta = 0;
    background(0);
    params.create_sliders()
}

function draw() {

    // background(0);
    // translate(width/2, height/2);
    orbitControl();

    // let x = r * cos(theta);
    // let y = r * sin(theta);
    let position = p5.Vector.fromAngle(theta); // would be the same as above two lines
    position.mult(params.get("amplitude") * r * sin(PI * frameCount / params.get("period") + params.get("phase")) + params.get("offset"));
    // position.x += params.get("offset");
    // position.y += params.get("offset");


    
    // line(0, 0, position.x, position.y);
    // circle(position.x, position.y, 10);
    push();
    fill(0, 0, 0, 255);
    stroke(255);
    translate(position.x, position.y, position.z);
    sphere(params.get("small_radius"));
    pop();

    theta += 0.0125;
    params.update_labels();


}

// Optional: Adjust canvas size when window is resized
function windowResized() {
  resizecanvas(windowwidth, windowheight);
}
