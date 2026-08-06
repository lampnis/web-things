class Hunter extends Walker {

  constructor(x, y, step) {
    super(x, y, step);
    this.color = createVector(34, 139, 34);
  }

  show() {

    strokeWeight
    stroke(this.color.x, this.color.y, this.color.z);
    point(this.position.x, this.position.y, 0);

  }

}
