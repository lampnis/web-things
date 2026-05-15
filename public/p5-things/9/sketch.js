let position;
let velocity;
let boxSide;
let ballRadius;
let r;
let theta;
let sliderLine;
let sliderCircle;


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

    // let x = r * cos(theta);
    // let y = r * sin(theta);
    let position = p5.Vector.fromAngle(theta); // would be the same as above two lines
    position.mult(r);


    fill(127);
    stroke(255);
    line(0, 0, position.x, position.y);
    circle(position.x, position.y, 48);
    theta += 0.0125;

}

// Optional: Adjust canvas size when window is resized
function windowResized() {
  resizecanvas(windowwidth, windowheight);
}
