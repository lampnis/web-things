let angle = 0;
let angleVelocity = 0.1;
let NUM;
let dims = false;
let button;
const CIRCLE_SIZE = 20;
const N_WAVES = 20;


function setup() {

    let ORIGIN_2D = createVector(windowWidth/2, windowHeight/2);
    createCanvas(windowWidth, windowHeight);

    params = new Sliders();

    params.add_slider("angle_velocity", 0.01, 1, 0.01, 0.01, "(speed)");
    params.add_slider("n_waves", 1, 1000, 2, 1, "(number of waves)");
    params.add_slider("n_balls", 10, 10000, 1000, 1, "(reduce for performance..?)");
    params.add_slider("circle_size", 1, 1000, 15, 1, "(just the size)");
    params.add_slider("color_shift", 0.001, 0.1, 0.05, 0.001, "(color speed)")
    params.add_slider("phase_y", 0.001, 10, 0.5, 0.001, "(phase y)")
    params.add_slider("phase_x", 0.001, 10, 0.5, 0.001, "(phase x)")

    params.create_sliders();

    button = createButton("toggle lissajous");
    button.position(windowWidth - 150, 10);
  
}

function draw() {
  
    var r = map(sin(angle * params.get("color_shift")), -1, 1, 0, 255)
    var g = map(sin(angle * params.get("color_shift") + 90), -1, 1, 0, 255);
    var b = map(cos(angle * params.get("color_shift") + 180), -1, 1, 0, 255);

    button.mousePressed(toggle_3d);
  
    background(0);
    stroke(r, g, b);
    fill(b, r, g);
    NUM = params.get("n_balls");
    for (let i = 0; i < NUM; i++) {

      if (dims) {
        
        let wave_y = sin(params.get("n_waves") * (TWO_PI * params.get("phase_y")) / NUM * i + angle) / 2;
        let wave_x = cos(params.get("n_waves") * (TWO_PI * params.get("phase_x")) / NUM * i + angle) / 2;
        let y = windowHeight * wave_y + windowHeight/2;
        let x = windowWidth * wave_x + windowWidth/2;
        
        circle(x, y, params.get("circle_size"));
      
      } else {
        
        let x = windowWidth - i * windowWidth/NUM - CIRCLE_SIZE/4;
        let wave_y = sin(params.get("n_waves") * (TWO_PI * params.get("phase_y")) / NUM * i + angle) / 2;
        let y = windowHeight * wave_y + windowHeight/2;

        circle(x, y, params.get("circle_size"));
      
      }
    }
    
    angle += params.get("angle_velocity");
    params.update_labels();
  
}

function toggle_3d() {
  if (dims == false) {
    dims = true;
  } else {
    dims = false;
  }
}
