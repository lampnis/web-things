function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
}

function draw() {
  var r = map(sin(frameCount / 2), -1, 1, 100, 200);
  var g = map(i / 2, 0, 50, 100, 200);
  var b = map(cos(frameCount), -1, 1, 100, 200);

  background(g, b, r);
  rotateX(60);
  var mouse_scale_x = map(mouseX, 0, windowWidth, 0.0, 5.0) - 2.5;
  var mouse_scale_y = map(mouseY, 0, windowHeight, 0.0, 2.0) - 1.0;
  noFill();
  stroke(r, g, b);

  for (var i; i < 70; i++) {
    beginShape();
    rotate(3 * mouse_scale_x);
    for (var j = 0; j < 360; j += 60) {
      var radius = i * 4.5;
      var x = radius * cos(j);
      var y = radius * sin(j);
      var z = mouse_scale_y * 100 * sin(frameCount * 2 + i * 10);

      vertex(x, y, z);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
