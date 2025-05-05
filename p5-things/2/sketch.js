function colwheel(n) {
  if (n == 0) {
    return color(0, 0, 0);
  }
  if (n > 0 && n <= 85) {
    return color(0, int(255 - n * 3), int(3 * n));
  }
  if (n > 85 && n <= 170) {
    n -= 85
    return color(int(n * 3), 0, int(255 - n * 3));
  }
  if (n > 170 && n <= 255) {
    n -= 170
    return color(int(255 - n * 3), int(n * 3), 0);
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
// let colwheel2 = Math.floor(colwheel1 / 2);

function draw() {
  if (frameCount % 5 == 0) {
    colwheel1 = (colwheel1 + 1) % 256;
    // colwheel2 = (colwheel2 + 1) % 256;
  }

  circleSize = 1000 / Math.sqrt((Math.abs(mouseX - windowWidth / 2) + Math.abs(mouseY - windowHeight / 2)));
  // background(colwheel2);
  fill(colwheel1);
  circle(mouseX, mouseY, circleSize);

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
