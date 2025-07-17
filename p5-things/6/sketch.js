let t = 0.0;
const numLines = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
}


function draw() {
  background(0);


  for (let i = 0; i < numLines; i++) {
    let xoff = t + i * 1e4;
    noFill();
    stroke(10, 25 * i, 10);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < width; i++) {
      let y = noise(xoff) * height * (i / 5);
      xoff += 0.01 * i;
      vertex(i, y);
    }
    endShape();
  }
  t += 0.01;
}

// Optional: Adjust canvas size when window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
