let sliderOne;
let sliderTwo;
let t = 0.0;
const numLines = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  sliderOne = createSlider(0, 20, 9, 0);
  sliderTwo = createSlider(0, 10, 2, 0);
  sliderOne.position(10, 10)
  sliderTwo.position(10, 30)
  sliderOne.size(150)
  sliderTwo.size(150)

}


function draw() {
  background(0);


  for (let j = 0; j < numLines; j++) {
    let xoff = t + j * 1e4;
    noFill();
    stroke(map(sin(frameCount / Math.pow(10, sliderOne.value()) * j), 0, 1, 0, 255), 25 * j, 10 * j);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < width; i++) {
      let y = map(noise(xoff), 0, 1, 0, height) * j / map(sin(frameCount * (i / Math.pow(10, sliderTwo.value()))), 0, 1, -100, 100);
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
