class Walker {

  constructor(init_x, init_y, step_size) {
    this.color = createVector(127, 127, 127);
    this.position = createVector(init_x, init_y);
    this.step_size = step_size; // ability for far travel
    this.sizer = 4; // general scaling for graphics
    this.health = 500; // max age of an individual
    this.p_aging = 0.5; // random chance to age
    this.p_accident = 0.001; // chance of accidental death
    this.d_reproduction = 2; // fertility index
    this.reproduce_cooldown = 180; // for humans: around a year
    this.n_children = 0; // initial amount of children
    this.max_children = 3; // some amount of children (genetic and base)
    // and based on advancment/education
    // more advanced -> less children
    // could be more complex
  }

  sync_params(params, group) {
    this.p_aging = params.get(group, "p_aging");
    this.d_reproduction = params.get(group, "d_reproduction");
  }

  show() {
    strokeWeight(2);
    stroke(this.color.x, this.color.y, this.color.z);
    point(this.position.x, this.position.y, 0);
  }

  step() {

    let move_x = random(-this.step_size, this.step_size);
    let move_y = random(-this.step_size, this.step_size);

    this.position.x += move_x;
    this.position.y += move_y;

    if (this.reproduce_cooldown > 0) this.reproduce_cooldown--;

    if (random() > this.p_aging) {
      this.health -= 1;
    }

    if (random() < this.p_accident) {
      this.health = 0;
    }

  }

  check_overlap(obj) { // effectively child bearing function

    if (this.is_dead() || obj.is_dead()) return null;
    if (this.n_children >= (this.max_children + obj.max_children) / 2) return null;
    if (this.reproduce_cooldown > 0 || obj.reproduce_cooldown > 0) return 0;

    // use sqDist
    const dx = obj.position.x - this.position.x;
    const dy = obj.position.y - this.position.y;

    const dist_sq = dx * dx + dy * dy;
    const max_dist_sq = this.d_reproduction * this.d_reproduction;

    if (dist_sq === 0 || dist_sq > max_dist_sq) return null;

    const parent = (Math.random() < 0.5) ? this.constructor : obj.constructor;

    this.reproduce_cooldown = 18;
    obj.reproduce_cooldown = 18;

    return new parent(
      this.position.x + random(-1, 1),
      this.position.y + random(-1, 1),
      this.step_size
    );
  }

  is_dead() {
    return (this.health == 0);
  }


}
