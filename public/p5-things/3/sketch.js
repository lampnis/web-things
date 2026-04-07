function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
}

function draw() {

  var r = map(sin(frameCount*0.1), -1, 1, 0, 255)
  var g = map(sin(frameCount*0.1 + 90), -1, 1, 0, 255);
  var b = map(cos(frameCount*0.1 + 180), -1, 1, 0, 255);
  console.log("mouseX: ", mouseX)
  console.log("mouseY: ", mouseY)
  background(r, g, b);
  rotateX(60);
  var mouse_scale_x = map(mouseX, 0, windowWidth, 0.0, 5.0) - 2.5;
  var mouse_scale_y = map(mouseY, 0, windowHeight, 0.0, 2.0) - 1.0; 
  noFill();
  

  stroke(g, b, r);
  for (var i = 0; i < 70; i++) {
    beginShape();
    rotate(3*mouse_scale_x);
    for (var j = 0; j < 360; j += 60) {
      var radius = i * 4.5;
      var x = radius * cos(j);
      var y = radius * sin(j);
      var z = mouse_scale_y * 100*sin(frameCount*2 + i*10);
      
      vertex(x, y, z);
    }
    endShape(CLOSE);
  
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
