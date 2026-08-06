let walkers = [];
let N_WALKERS = 200;
const CELL_SIZE = 8;
let grid;
let params;

function init_population() {
  let N_WALKERS = params.get("global", "n_walkers");
  let step = params.get("global", "step_size");

  let classes = [Walker, Hunter];

  for (let i = 0; i < N_WALKERS; i++) {
    let WalkerChoice = random(classes);
    let w = new WalkerChoice(
      random(-windowWidth / 2, windowWidth / 2),
      random(-windowHeight / 2, windowHeight / 2),
      step
    );
    walkers.push(w);
  }
}

async function setup() {

  createCanvas(windowWidth, windowHeight, WEBGL);

  params = new SliderTree("Sim control panel");

  params.add_slider("global", "n_walkers", 100, 500, 200, 1, "total population");
  params.add_slider("global", "step_size", 1, 10, 3, 1, "step size");

  params.add_slider("walkers", "p_aging", 0.4, 0.6, 0.5, 0.001, "aging speed");
  params.add_slider("walkers", "d_reproduction", 1, 5, 0.1, "reproduction distance");

  params.add_slider("hunters", "p_aging", 0.4, 0.6, 0.5, 0.001, "aging speed");
  params.add_slider("hunters", "d_reproduction", 1, 5, 0.1, "reproduction distance");

  grid = new SpatialGrid(CELL_SIZE);

  init_population(walkers);

  button = createButton("reset population");
  button.position(windowWidth - 150, 10);
  button.mousePressed(init_population);

  button = createButton("reset camera");
  button.position(windowWidth - 150, 40);
  button.mousePressed(reset_camera);

  font = await loadFont("assets/FiraSansCondensed-Regular.ttf");
  fill("white");
  textFont(font);
  textSize(22);

}

function draw() {

  background(0);
  orbitControl(1, 3, 1);
  grid.clear();

  for (let i = 0; i < walkers.length; i++) {
    if (!walkers[i].is_dead()) {
      grid.insert(walkers[i]);
    }
  }

  let newborns = [];

  for (let i = 0; i < walkers.length; i++) {

    let curr = walkers[i];
    let group = "walkers";
    if (curr instanceof Hunter) group = "hunters";

    if (curr.is_dead()) continue;

    curr.sync_params(params, group);
    curr.step();
    curr.show();

    let neighbors = grid.get_nearby(curr);

    for (let j = 0; j < neighbors.length; j++) {

      let other = neighbors[j];

      if (curr === other) { continue };

      let child = curr.check_overlap(other);

      if (child) {
        newborns.push(child);
      }
    }
  }

  if (newborns.length > 0) {
    walkers.push(...newborns);
  }

  walkers = walkers.filter(w => !w.is_dead());

  text(`Current world population: ${walkers.length}`, 0, 10);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function reset_camera() {
  camera(0, 0, 800, 0, 0, 0, 0, 1, 0);
}
