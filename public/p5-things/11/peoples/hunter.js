const GRID_SIZE = 9;
let margin = 10;
let spacing = 1;

class Hunter extends Walker {

  constructor(x, y, step) {
    super(x, y, step);
  }

  show() {

    push();

    translate(this.position.x, this.position.y, 0);
    fill(127);
    stroke(127);

    beginShape();

    vertex(-1 * this.sizer, -4 * this.sizer, 0);
    vertex(0, -this.sizer * 3, 0);
    vertex(1 * this.sizer, -4 * this.sizer, 0);
    vertex(0, 4 * this.sizer, 0);

    endShape(CLOSE);

    pop();

  }

}
