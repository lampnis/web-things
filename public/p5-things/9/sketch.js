// THE OLD VERSION
const detail = 6; // how many triangles to use for 3d shapes
const TRAIL_LENGTH = 5000;

let params;
let oscs;
let selector;

let position;
// let velocity;
// let boxSide;
let ballRadius;
let r;
let theta;
let sliders;
// let myShader;
// let trailModel;
let radius;
let angle = 0;


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

    set_val(name, val) {
        this.container[name].slider.value(val);
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
    constructor(num_oscillators) {
        this.num_oscillators = num_oscillators;
        this.oscillators = [];
    }

    // initiating a number of oscillators
    // and adding those to the oscillator
    // list. They should have multiple properties
    set_origins() {
        for (let i = 0; i < this.num_oscillators; i++) {
            this.oscillators.push(
                {
                    id: i,
                    originX: random(-windowWidth/2, windowWidth/2),
                    originY: random(-windowHeight/2, windowHeight/2),
                    originZ: random(-1000, 1000),
                    theta: random(TWO_PI),
                    angle: 0,
                    trail: [],
                    config: {
                        big_radius: random(0.1, 1),
                        amplitude: random(0.1, 1),
                        phase: random(0, 1),
                        small_radius: (0, 200),
                        period: random(20, 80),
                        offset: random(-windowHeight, windowHeight),
                        z_pos: random(-3, 3),
                        angle_velocity: random(0.05, 100),
                        color_shift: random(0.01, 0.1)
                    }
                }
            );
        }
    }

    show_origins() {
        for (let i of this.oscillators) {
            push();
            // fill(g, b, r, 255);
            fill(0, 0, 0, 255);
            stroke(255, 255, 255);
            strokeWeight(0.5);
            translate(i.originX, i.originY, i.originZ);
            sphere(params.get("small_radius"), detail, detail);
            pop();   
        }
    }

}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    pixelDensity(1);
    
    // sliders
    oscs = new Oscillators(10);
    oscs.set_origins();
    params = new Sliders;
    params.add_slider("big_radius", 0, 1, 0.5, 0.01);
    params.add_slider("amplitude", 0, 1, 0.5, 0.01);
    params.add_slider("phase", 0, 1, 0.5, 0.01);
    params.add_slider("small_radius", 0, 200, 10, 0.5);
    params.add_slider("period", 0, 100, 50, 0.5, "(smaller -> faster)");
    params.add_slider("offset", -windowHeight, windowHeight, 0, windowHeight/1000)
    params.add_slider("z_pos", -3.0, 3.0, 0.0, 0.1, "(depth coord)");
    params.add_slider("angle_velocity", 0.05, 100, 0.05, 0.05, "(larger -> faster)")
    params.add_slider("color_shift", 0.001, 0.1, 0.05, 0.001, "(color speed)")

    // buttons
    let button = createButton('clear spheres');
    button.position(windowWidth/3*2, 10);
    button.mousePressed(clearSpheres);

    position = createVector(100, 100, 100);
    // velocity = createVector(2.5, 2, 2);
    radius = height * 0.4;
    theta = 1;
    params.create_sliders()
}

function draw() {

    background(0);
    orbitControl();

    // testing oscillators class
    oscs.show_origins();

    // P5 ONLY    

    var r = map(sin(angle * params.get("color_shift")), -1, 1, 0, 255)
    var g = map(sin(angle * params.get("color_shift") + 90), -1, 1, 0, 255);
    var b = map(cos(angle * params.get("color_shift") + 180), -1, 1, 0, 255);

    // background(r, g, b);
    // stroke(b, r, g);
    // translate(width/2, height/2);
    orbitControl(1, 1, 1);

    // let x = r * cos(theta);
    // let y = r * sin(theta);
    position.x = p5.Vector.fromAngle(theta).x; // would be the same as above two lines
    position.y = p5.Vector.fromAngle(theta).y;
    position.z = params.get("z_pos");
    position.mult(params.get("amplitude") * radius * sin(angle / params.get("period") + params.get("phase")) + params.get("offset"));
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
        sphere(params.get("small_radius"), detail, detail);
        pop();
    }
    
    theta += 0.0125;

    if (spheres.length > TRAIL_LENGTH) {
        spheres.shift();
    }

    params.update_labels();
    angle += params.get("angle_velocity");
}



// Optional: Adjust canvas size when window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


// // THE NEW VERSION (NEED TO REVIEW)
// const detail = 6; // Lowered for performance
// const TRAIL_LENGTH = 1000; // Total points per oscillator

// let params;
// let oscs;
// let selector;

// class Sliders {
//     constructor() {
//         this.container = {};
//     }

//     add_slider(name, min, max, val, step, comment = "") {
//         this.container[name] = {
//             slider: createSlider(min, max, val, step),
//             label: createSpan(name),
//             note: comment
//         }
//     }

//     // New method to force-set a slider value (used when switching oscillators)
//     set_val(name, val) {
//         this.container[name].slider.value(val);
//     }

//     create_sliders(x = 10, startY = 10, spacing = 25, width = 200) {
//         let idx = 0;
//         for (let name in this.container) {
//             let item = this.container[name];
//             let y = startY + idx * spacing;
//             item.slider.position(x, y);
//             item.slider.size(width);
//             item.label.position(x + width + 10, y);
//             item.label.style('font-family', 'sans-serif');
//             item.label.style('font-size', '12px');
//             item.label.style('color', 'lightgreen');
//             idx++;
//         }
//     }

//     update_labels() {
//         for (let name in this.container) {
//             let item = this.container[name];
//             let val = item.slider.value();
//             item.label.html(`${name}: ${val} ${item.note}`);
//         }
//     }

//     get(name) {
//         return this.container[name].slider.value();
//     }
// }

// class Oscillators {
//     constructor(num_oscillators) {
//         this.num_oscillators = num_oscillators;
//         this.oscillators = [];
//     }

//     set_origins() {
//         for (let i = 0; i < this.num_oscillators; i++) {
//             this.oscillators.push({
//                 id: i,
//                 originX: random(-200, 200),
//                 originY: random(-200, 200),
//                 originZ: random(-100, 100),
//                 theta: random(TWO_PI),
//                 angle: 0,
//                 trail: [],
//                 // Individual settings for this specific oscillator
//                 config: {
//                     big_radius: random(0.1, 1),
//                     amplitude: random(0.1, 1),
//                     phase: random(0, 1),
//                     small_radius: 5,
//                     period: random(20, 80),
//                     offset: 0,
//                     z_pos: 0,
//                     angle_velocity: random(0.01, 0.1),
//                     color_shift: 0.05
//                 }
//             });
//         }
//     }

//     update_and_show() {
//         let activeID = parseInt(selector.value());

//         for (let osc of this.oscillators) {
//             // 1. If this is the "Selected" one, update its config from sliders
//             if (osc.id === activeID) {
//                 for (let key in osc.config) {
//                     osc.config[key] = params.get(key);
//                 }
//             }

//             // 2. Math logic (moved from main draw loop)
//             let radius = height * 0.4;
//             let pos = p5.Vector.fromAngle(osc.theta);
            
//             // Calculate movement
//             let wave = sin(osc.angle / osc.config.period + osc.config.phase);
//             let scalar = osc.config.amplitude * radius * wave + osc.config.offset;
            
//             pos.mult(scalar);
            
//             // Calculate colors
//             let r = map(sin(osc.angle * osc.config.color_shift), -1, 1, 0, 255);
//             let g = map(sin(osc.angle * osc.config.color_shift + 90), -1, 1, 0, 255);
//             let b = map(cos(osc.angle * osc.config.color_shift + 180), -1, 1, 0, 255);

//             // Add to trail
//             osc.trail.push({
//                 x: osc.originX + pos.x,
//                 y: osc.originY + pos.y,
//                 z: osc.originZ + osc.config.z_pos,
//                 r: r, g: g, b: b
//             });

//             if (osc.trail.length > TRAIL_LENGTH) osc.trail.shift();

//             // 3. Draw trail
//             for (let p of osc.trail) {
//                 push();
//                 translate(p.x, p.y, p.z);
//                 fill(0);
//                 stroke(p.r, p.g, p.b);
//                 strokeWeight(0.5);
//                 sphere(osc.config.small_radius, detail, detail);
//                 pop();
//             }

//             // 4. Draw origin point (the white dot)
//             push();
//             translate(osc.originX, osc.originY, osc.originZ);
//             stroke(255);
//             noFill();
//             point(0,0,0);
//             pop();

//             // Update internal counters
//             osc.theta += 0.0125;
//             osc.angle += osc.config.angle_velocity;
//         }
//     }

//     clearTrails() {
//         for (let osc of this.oscillators) osc.trail = [];
//     }
// }

// function setup() {
//     createCanvas(windowWidth, windowHeight, WEBGL);
    
//     // 1. Setup Sliders
//     params = new Sliders();
//     params.add_slider("big_radius", 0, 1, 0.5, 0.01);
//     params.add_slider("amplitude", 0, 1, 0.5, 0.01);
//     params.add_slider("phase", 0, 1, 0.5, 0.01);
//     params.add_slider("small_radius", 1, 50, 5, 0.5);
//     params.add_slider("period", 1, 100, 50, 0.5);
//     params.add_slider("offset", -200, 200, 0, 1);
//     params.add_slider("z_pos", -200, 200, 0, 1);
//     params.add_slider("angle_velocity", 0.01, 0.5, 0.05, 0.01);
//     params.add_slider("color_shift", 0.01, 0.1, 0.05, 0.005);
//     params.create_sliders();

//     // 2. Setup Oscillators
//     oscs = new Oscillators(3);
//     oscs.set_origins();

//     // 3. Setup Selector (Dropdown)
//     selector = createSelect();
//     selector.position(windowWidth - 150, 10);
//     for (let i = 0; i < 10; i++) {
//         selector.option("Oscillator " + i, i);
//     }
//     selector.changed(syncSlidersToOscillator);

//     // 4. Setup Buttons
//     let button = createButton('Clear Trails');
//     button.position(windowWidth - 150, 40);
//     button.mousePressed(() => oscs.clearTrails());

//     // Initialize sliders to match the first oscillator
//     syncSlidersToOscillator();
// }

// function syncSlidersToOscillator() {
//     let id = parseInt(selector.value());
//     let target = oscs.oscillators[id].config;
//     // Update every slider to match this oscillator's saved config
//     for (let key in target) {
//         params.set_val(key, target[key]);
//     }
// }

// function draw() {
//     background(0);
//     orbitControl();

//     // The class now handles everything
//     oscs.update_and_show();
    
//     params.update_labels();
// }

// function windowResized() {
//     resizeCanvas(windowWidth, windowHeight);
// }