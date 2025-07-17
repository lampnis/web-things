class Walker {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  show() {
    stroke(255);
    point(this.x, this.y);
  }

  step() {
    let move = randomGaussian(2, 1);
    let rUp = random(1);
    let rLeft = random(1);
    let p = 0.49;

    if (rUp <= p) {
      this.y -= move;
    } else {
      this.y += move;
    }

    if (rLeft <= p) {
      this.x -= move;
    } else {
      this.x += move;
    }
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
  rect
}

// Optional: Adjust canvas size when window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
