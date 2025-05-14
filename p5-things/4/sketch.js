// Global simulation constant (tune for desired effect)
const G = 1; // Gravitational constant - adjust this! Higher means stronger gravity.
const MIN_DISTANCE = 5; // Minimum distance to prevent extreme forces at close range
const MAX_DISTANCE = 50; // Optional: Maximum distance for force calculation (can soften distant interactions)


class Body {
  constructor(x, y, vx, vy, mass) {
    this.pos = createVector(x, y);       // Position (p5.Vector)
    this.vel = createVector(vx, vy);     // Velocity (p5.Vector)
    this.acc = createVector(0, 0);     // Acceleration (p5.Vector)
    this.mass = mass;                  // Mass (Number)
    this.radius = sqrt(this.mass);     // Radius for drawing (proportional to sqrt(mass) or mass^(1/3) is common)
  }

  // Calculate gravitational attraction force FROM another body ON this body
  calculateAttraction(otherBody) {
    // Calculate direction vector (from this body towards the other body)
    let force = p5.Vector.sub(otherBody.pos, this.pos);

    // Calculate distance between bodies
    let distanceSq = force.magSq(); // Use magnitude squared to avoid sqrt until necessary

    // Constrain distance to avoid extreme forces / division by zero
    distanceSq = constrain(distanceSq, MIN_DISTANCE * MIN_DISTANCE, MAX_DISTANCE * MAX_DISTANCE);

    // Calculate force magnitude: F = G * m1 * m2 / r^2
    let strength = (G * this.mass * otherBody.mass) / distanceSq;

    // Set the magnitude of the force vector
    force.setMag(strength);

    return force;
  }

  // Apply a force vector to this body's acceleration
  applyForce(force) {
    // Newton's 2nd Law: a = F / m
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  // Update position and velocity using Euler integration
  update() {
    // Velocity changes according to acceleration
    this.vel.add(this.acc);
    // Position changes according to velocity
    this.pos.add(this.vel);
    // IMPORTANT: Reset acceleration for the next frame
    this.acc.mult(0);
  }

  // Draw the body
  show() {
    stroke(255);
    strokeWeight(1);
    fill(255, 150); // Semi-transparent white
    ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
  }

  // Optional: Keep bodies within the canvas bounds (simple wrapping)
  edges() {
    if (this.pos.x > width + this.radius) {
      this.pos.x = -this.radius;
    } else if (this.pos.x < -this.radius) {
      this.pos.x = width + this.radius;
    }
    if (this.pos.y > height + this.radius) {
      this.pos.y = -this.radius;
    } else if (this.pos.y < -this.radius) {
      this.pos.y = height + this.radius;
    }
  }
}

// --- Sketch Variables ---
let body1;
let body2;

function setup() {
  createCanvas(600, 400);

  // Create two bodies with initial positions, velocities, and masses
  // Center one, offset the other, give it some initial velocity
  body1 = new Body(width / 2, height / 2, 0, 0, 50); // Larger mass, stationary at center
  body2 = new Body(width / 2 + 100, height / 2, 0, 2, 5); // Smaller mass, offset, moving initially upwards
  // Adjust initial velocity (0, 2) for different orbits!
}

function draw() {
  background(0); // Black background

  // 1. Calculate Forces
  let force1on2 = body1.calculateAttraction(body2); // Force body1 exerts on body2
  let force2on1 = body2.calculateAttraction(body1); // Force body2 exerts on body1
  // Note: By Newton's 3rd law, these should be equal and opposite.
  // Our implementation calculates them independently based on position,
  // which is fine. Or you could calculate one and invert it for the other.

  // 2. Apply Forces
  body1.applyForce(force2on1); // Apply the force FROM body2 ON body1
  body2.applyForce(force1on2); // Apply the force FROM body1 ON body2

  // 3. Update Motion
  body1.update();
  body2.update();

  // 4. Handle Edges (optional)
  // body1.edges();
  // body2.edges();

  // 5. Show Bodies
  body1.show();
  body2.show();
}
