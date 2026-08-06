class SpatialGrid {
  constructor(cell_size) {
    this.cell_size = cell_size;
    this.grid = new Map();
  }

  clear() {
    this.grid.clear();
  }

  _key(cx, cy) {
    return `${cx}, ${cy}`;
  }

  insert(entity) {
    const cx = Math.floor(entity.position.x / this.cell_size);
    const cy = Math.floor(entity.position.y / this.cell_size);
    const key = this._key(cx, cy);

    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key).push(entity);
  }

  get_nearby(entity) {
    const cx = Math.floor(entity.position.x / this.cell_size);
    const cy = Math.floor(entity.position.y / this.cell_size);
    const nearby = [];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        const key = this._key(cx + x, cy + y);
        if (this.grid.has(key)) {
          const cell = this.grid.get(key);
          for (let i = 0; i < cell.length; i++) {
            nearby.push(cell[i]);
          }
        }
      }
    }
    return nearby;
  }
}
