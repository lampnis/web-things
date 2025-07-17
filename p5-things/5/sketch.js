class Walker {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
  }

  show() {
    stroke(255);
    point(this.x, this.y);
  }

  step() {
    let choiceX = random(-1, 0, 1);
    let choiceY = random(-1, 0, 1);
    this.x += choiceX + 0.1;
    this.y += choiceY + 0.1;
  }
}

let walker;

function setup() {
  createCanvas(windowWidth, windowHeight);
  walker = new Walker();
  background(0);
}

function draw() {
  walker.step();
  walker.show();
}

// Optional: Adjust canvas size when window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
