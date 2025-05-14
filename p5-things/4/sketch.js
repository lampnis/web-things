const G = 2;

class Body {
  constructor(x, y, z, vx, vy, vz, mass, radius) {
    this.position = createVector(x, y, z);
    this.velocity = createVector(vx, vy, vz);
    this.acceleration = createVector(0, 0, 0);
    this.mass = mass;
    this.radius = radius;
    this.path = [];
    this.pathLength = 2000;
  }

  calculateAttraction(otherBody) {
    // unit direction this->other
    let force = p5.Vector.sub(otherBody.position, this.position);
    let distanceSq = force.magSq();

    // F = G * m1 * m2 / r^2
    let strength = (G * this.mass * otherBody.mass) / distanceSq;

    force.setMag(strength);

    return force;
  }

  applyForce(force) {
    // Newton's 2nd Law: a = F / m
    // check for zero division
    if (this.mass === 0) return;
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }


  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);

    // update path
    this.path.push(this.position.copy());
    if (this.path.length > this.pathLength) {
      this.path.splice(0, 1); // Remove oldest point
    }

    // reset acceleration for next frame
    this.acceleration.mult(0);
  }

  show() {
    push(); // isolate transformations and styles..?

    // Translate to the body's position to draw the sphere
    translate(this.position.x, this.position.y, this.position.z);

    // Set material properties for the sphere
    noStroke();
    // Make color slightly dependent on mass (example)
    let rCol = map(this.mass, 1, 1000, 150, 255);
    let gCol = map(this.mass, 1, 1000, 200, 150);
    let bCol = map(this.mass, 1, 1000, 255, 100);
    ambientMaterial(rCol, gCol, bCol); // Color for the sphere
    
    // Draw the sphere
    sphere(this.radius);

    pop(); // Restore previous drawing style and transformation matrix

    // Draw the trail
    beginShape();
    noFill();
    stroke(rCol, gCol, bCol, 150); // Trail color with some transparency
    strokeWeight(1);
    for (let p of this.path) {
      vertex(p.x, p.y, p.z);
    }
    endShape();
  }
}

// --- Sketch Variables ---
// let body1;
// let body2;
// You can add more bodies to an array for N-body simulation
let bodies = [];

function setup() {
  createCanvas(windowWidth, windowHeight * 0.85, WEBGL); // Use WEBGL mode for 3D
  pixelDensity(1); // Optional: ensure consistent rendering on high-DPI displays

  // Create bodies with initial positions (x,y,z), velocities (vx,vy,vz), mass, and radius

  bodies.push(new Body(0, 0, 0, 0, 0, 0, 100, 20));
  bodies.push(new Body(70, 0, 70, 1, 0, -1, 1, 5));
  bodies.push(new Body(-90, 10, 100, 1, 0, 1, 3, 5));
  
}

function draw() {
  background(10, 10, 25); // Dark background

  // Camera control: allows mouse drag to rotate, scroll to zoom
  orbitControl(4, 4);

  // Lighting
  ambientLight(80); // Soft ambient light
  pointLight(255, 255, 255, 0, 0, 200); // A light source
  directionalLight(200,200,200, -1, -1, -1); // Light from a direction

  // --- N-Body Simulation Logic (if using an array `bodies`) ---
  
  if (bodies.length > 1) {
    // Reset forces for all bodies
    for (let i = 0; i < bodies.length; i++) {
      bodies[i].acceleration.mult(0); // Important to reset acceleration if not done in update
                               // My current Body.update() does this.
    }

    // Calculate and apply forces between all unique pairs
    for (let i = 0; i < bodies.length; i++) {
      for (let j = 0; j < bodies.length; j++) {
        if (i !== j) { // Don't calculate force of a body on itself
          let force = bodies[i].calculateAttraction(bodies[j]);
          bodies[i].applyForce(force);
        }
      }
    }

    // Update and show all bodies
    for (let i = 0; i < bodies.length; i++) {
      bodies[i].update();
      bodies[i].show();
    }
  }
 
}

// Optional: Adjust canvas size when window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight * 0.85);
}