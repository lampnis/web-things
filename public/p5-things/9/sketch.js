let position;
let velocity;
let boxSide;
let ballRadius;
let r;
let theta;
let sliderOne;
let sliderTwo;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    position = createVector(100, 100, 100);
    velocity = createVector(2.5, 2, 2);
    r = height * 0.45;
    theta = 0;
}

function draw() {

    background(0);
    // translate(width/2, height/2);

    let x = r * cos(theta);
    let y = r * sin(theta);

    fill(127);
    stroke(255);
    line(0, 0, x, y);
    circle(x, y, 48);
    theta += 0.0125;

}

// Optional: Adjust canvas size when window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
