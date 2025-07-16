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
    let choice = floor(random(4));
    if (choice === 0) {
      this.x++;
    } else if (choice === 1) {
      this.x--;
    } else if (choice === 2) {
      this.y++;
    } else {
      this.y--;
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
}

// Optional: Adjust canvas size when window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
