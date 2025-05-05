function colwheel(n) {
  if (n == 0) {
    return 'rgb(0, 0, 0)';
  }
  if (n > 0 && n <= 85) {
    return `rgb(0, ${int(255 - n * 3)}, ${int(3 * n)})`;
  }
  if (n > 85 && n <= 170) {
    n -= 85
    return `rgb(${int(n)} * 3), 0, ${int(255 - n * 3)})`;
  }
  if (n > 170 && n <= 255) {
    n -= 170
    return `rgb(${int(255 - n * 3)}, ${int(n * 3)}, 0)`;
  }
}

function setup() {
  // Create canvas using the current window dimensions
  createCanvas(windowWidth, windowHeight);
  // Your drawing code here
  background(0);
  noStroke();
  colorMode(RGB);
}


let colwheel1 = Math.floor(255 * Math.random());
let colwheel2 = Math.floor(colwheel1 / 2);
let updateAfterFrames = 60;
let startFrames = 0;

function draw() {
  if (colwheel2 == 255) {
    colwheel2 = 0;
  } else {
    colwheel2 += 1;
  }

  if (colwheel1 == 255) {
    colwheel1 = 0;
  } else {
    colwheel1 += 1;
  }

  background(colwheel2);
  fill(colwheel1);
  circle(mouseX, mouseY, 1000 / Math.sqrt((Math.abs(mouseX - windowWidth / 2) + Math.abs(mouseY - windowHeight / 2))));

}

// This function is automatically called by p5.js whenever the browser window is resized
function windowResized() {
  // Resize the canvas to the new window dimensions
  resizeCanvas(windowWidth, windowHeight);
}

// Optional: Remove default body margins/padding for a true full-screen feel
// You would typically put this in your HTML file's <style> tag or a separate CSS file:
/*
body {
  margin: 0;
  padding: 0;
  overflow: hidden; // Prevent scrollbars caused by the canvas
}
*/
