let t = 0.0;
const numLines = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
}


function draw() {
  background(0);


  for (let j = 0; j < numLines; j++) {
    let xoff = t + j * 1e4;
    noFill();
    stroke(map(sin(frameCount / 1e1 * j), 0, 1, 0, 255), 25 * j, 10 * j);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < width; i++) {
      let y = map(noise(xoff), 0, 1, 0, height) * j / map(sin(frameCount / 1e2 * i), 0, 1, -100, 100);
      xoff += 0.01;
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
