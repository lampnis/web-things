let position;
let velocity;
let boxSide;
let ballRadius;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  position = createVector(100, 100, 100);
  velocity = createVector(2.5, 2, 2);
}

function draw() {

  ambientLight(50);
  directionalLight(50, 250, 250, -1, -1, -1);

  background(10, 10, 25);
  position.add(velocity);
  boxSide = 300;
  ballRadius = 30;

  if (position.x > boxSide / 2 - ballRadius || position.x < -boxSide / 2 + ballRadius) {
    velocity.x = velocity.x * -1;
  }

  if (position.y > boxSide / 2 - ballRadius || position.y < -boxSide / 2 + ballRadius) {
    velocity.y = velocity.y * -1;
  }

  if (position.z > boxSide / 2 - ballRadius || position.z < -boxSide / 2 + ballRadius) {
    velocity.z = velocity.z * -1;
  }

  noFill();
  orbitControl();
  stroke(255);
  box(boxSide, boxSide, boxSide);
  push();
  noStroke();
  translate(position);

  ambientMaterial(70, 244, 50);
  sphere(ballRadius);
  pop();

}

// Optional: Adjust canvas size when window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
