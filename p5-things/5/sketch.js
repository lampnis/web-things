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
    let move = random(5);
    let rUp = random(1);
    let rLeft = random(1);
    let pUp = 0.49;
    let pLeft = 0.49;

    if (rUp <= pUp) {
      this.y -= Math.pow(move, 2);
    } else {
      this.y += Math.pow(move, 2);
    }

    if (rLeft <= pLeft) {
      this.x -= Math.pow(move, 2);
    } else {
      this.x += Math.pow(move, 2);
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
