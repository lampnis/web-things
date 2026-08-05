class Walker {

  constructor(init_x, init_y, step_size) {
    this.position = createVector(init_x, init_y);
    this.sizer = 4;
  }

  show() {
    stroke(255);
    fill(255);
    circle(this.position.x, this.position.y - 1 * this.sizer, 2 * this.sizer);
  }

  step() {
    let move = random(2);
    let r_up = random(1);
    let r_left = random(1);
    let p_up = 0.5;
    let p_left = 0.5;

    if (r_up <= p_up) {
      this.position.y -= Math.pow(move, 2);
    } else {
      this.position.y += Math.pow(move, 2);
    }

    if (r_left <= p_left) {
      this.position.x -= Math.pow(move, 2);
    } else {
      this.position.x += Math.pow(move, 2);
    }
  }

}
