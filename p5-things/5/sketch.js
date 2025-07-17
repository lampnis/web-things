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
    let rUp = random(1);
    let rLeft = random(1);
    let p = 0.49;

    if (rUp <= p) {
      this.y--;
    } else {
      this.y++;
    }

    if (rLeft <= p) {
      this.x--;
    } else {
      this.x++;
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
