let test_obj_1;
let test_group_1 = [];
let n_test_group_1 = 100;

let test_obj_2;
let test_group_2 = [];
let n_test_group_2 = 50;

function setup() {

  createCanvas(windowWidth, windowHeight, WEBGL);
  background(0);

  for (let i = 0; i < n_test_group_1; i++) {
    test_obj_1 = new Walker(random(-windowWidth / 2, windowWidth / 2), random(-windowHeight / 2, windowHeight / 2));
    test_group_1.push(test_obj_1);
  }

  for (let i = 0; i < n_test_group_2; i++) {
    test_obj_2 = new Hunter(random(-windowWidth / 2, windowWidth / 2), random(-windowHeight / 2, windowHeight / 2));
    test_group_2.push(test_obj_2);
  }

}

function draw() {

  background(0);
  orbitControl(1, 3, 1);

  for (let test_obj of test_group_1) {
    test_obj.show();
    test_obj.step();
  }

  for (let test_obj of test_group_2) {
    test_obj.show();
    test_obj.step();
  }

}
