let walkers = [];
let N_WALKERS = 200;
const CELL_SIZE = 8;
let grid;
let params;
let stats;

function init_population() {
  walkers = [];
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
  params.add_slider("walkers", "d_reproduction", 1, 5, 2, 0.1, "reproduction distance");

  params.add_slider("hunters", "p_aging", 0.4, 0.6, 0.5, 0.001, "aging speed");
  params.add_slider("hunters", "d_reproduction", 1, 5, 2, 0.1, "reproduction distance");

  stats = new Statistics();
  stats.init_stats();

  grid = new SpatialGrid(CELL_SIZE);

  init_population(walkers);

  button_1 = createButton("reset population");
  button_1.position(windowWidth - 150, 10);
  button_1.mousePressed(init_population);

  button_2 = createButton("reset camera");
  button_2.position(windowWidth - 150, 40);
  button_2.mousePressed(reset_camera);

  font = await loadFont("assets/Fira_Sans_Condensed/FiraSansCondensed-Regular.ttf");
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

  stats.update_stat("Current world population", walkers.length);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function reset_camera() {
  camera(0, 0, 800, 0, 0, 0, 0, 1, 0);
}
