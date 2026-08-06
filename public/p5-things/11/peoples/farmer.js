class Farmer extends Walker {
  constructor(x, y, step) {
    super(x, y, step);
  }

  show() {
    point(this.position.x, this.position.y - 1 * this.sizer, 2 * this.sizer);
  }
}
