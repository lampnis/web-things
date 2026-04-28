new p5((p) => {
  p.setup = () => {
    let canvas = p.createCanvas(88, 31, p.WEBGL);
      canvas.parent('p5-illustration-2'); 
  };

  p.draw = () => {
    p.background(0);
    p.camera(0, 0, 1600);
    p.orbitControl();
    let angle = p.frameCount * 0.01;
    p.rotateX(angle);
    p.rotateY(angle);
    p.cone(40);
  };
});
