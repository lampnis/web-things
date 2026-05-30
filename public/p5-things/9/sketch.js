let position;
let velocity;
let boxSide;
let ballRadius;
let r;
let theta;
let sliders;
let params;
let spheres = [];

let period = 120; // in frameCount units
let amplitude = 100;

function clearSpheres() {
    spheres = [];
}

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


class Oscillators {
    constructor() {
        this.oscillators = [];
    }

    add_oscillator() {

    }



}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    // sliders
    params = new Sliders;
    params.add_slider("big_radius", 0, 1, 0.5, 0.01);
    params.add_slider("amplitude", 0, 1, 0.5, 0.01);
    params.add_slider("phase", 0, 1, 0.5, 0.01);
    params.add_slider("small_radius", 0, 200, 10, 0.5);
    params.add_slider("period", 0, 100, 50, 0.5, "(smaller -> faster)");
    params.add_slider("offset", -windowHeight, windowHeight, 0, windowHeight/1000)
    params.add_slider("z_pos", -3, 3, 0, 0.1, "(depth coord)");

    // buttons
    let button = createButton('clear spheres');
    button.position(windowWidth/3*2, 10);
    button.mousePressed(clearSpheres);

    position = createVector(100, 100, 100);
    velocity = createVector(2.5, 2, 2);
    radius = height * 0.4;
    theta = 1;
    params.create_sliders()
}

function draw() {

    background(0);

    var r = map(sin(frameCount*0.005), -1, 1, 0, 255)
    var g = map(sin(frameCount*0.005 + 90), -1, 1, 0, 255);
    var b = map(cos(frameCount*0.005 + 180), -1, 1, 0, 255);

    // background(r, g, b);
    // stroke(b, r, g);
    // translate(width/2, height/2);
    orbitControl();

    // let x = r * cos(theta);
    // let y = r * sin(theta);
    position.x = p5.Vector.fromAngle(theta).x; // would be the same as above two lines
    position.y = p5.Vector.fromAngle(theta).y;
    position.z = params.get("z_pos");
    position.mult(params.get("amplitude") * radius * sin(PI * frameCount / params.get("period") + params.get("phase")) + params.get("offset"));
    // position.x += params.get("offset");
    // position.y += params.get("offset");

    spheres.push({
        x: position.x,
        y: position.y,
        z: position.z,
        r: r,
        g: g,
        b: b
    });

    
    // line(0, 0, position.x, position.y);
    // circle(position.x, position.y, 10);
    for (let s of spheres) {
        push();
        // fill(g, b, r, 255);
        fill(0, 0, 0, 255);
        stroke(s.r, s.g, s.b);
        strokeWeight(0.5);
        translate(s.x, s.y, s.z);
        sphere(params.get("small_radius"));
        pop();
    }

    theta += 0.0125;
    params.update_labels();


}

// Optional: Adjust canvas size when window is resized
function windowResized() {
  resizeCanvas(windowwidth, windowheight);
}
