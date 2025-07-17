let t = 0.0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}


function draw() {
  background(0);
  let xoff = t;
  noFill();
  stroke(255);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < width; i++) {
    let y = noise(xoff) * height;
    xoff += 0.01;
    vertex(i, y);
  }
  endShape();
  t += 0.01;
}

// Optional: Adjust canvas size when window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
