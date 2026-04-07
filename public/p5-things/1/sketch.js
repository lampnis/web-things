function setup() {
  // Create canvas using the current window dimensions
  createCanvas(windowWidth, windowHeight);
  // Your drawing code here
  background(220);
}

function draw() {

  circle(mouseX, mouseY, 100); // Example: Center an ellipse
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
