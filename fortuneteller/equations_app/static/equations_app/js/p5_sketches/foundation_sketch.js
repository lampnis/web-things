// === p5.js Sketch: Foundation Concepts DEBUG (foundation_sketch.js - v3) ===

// Displays Gauss E (Divergence) and Gauss B (No Divergence) side-by-side.
// Adding extensive logging and simplifying setup.

let foundationSketch = function (p) {
  console.log("Foundation Sketch: Defining function..."); // Initial log

  // Layout & Core
  let canvasWidth = 100, canvasHeight = 100; // Initial safe defaults
  let midX = 50;
  let particles = [];
  const numParticles = 80; // Reduce for debugging?

  // Electric Side
  let chargePos, chargeNeg;
  let chargeMagnitude = 1.0;
  let eFieldLines = [];

  // Magnetic Side
  let wireCenter;
  let currentStrength = 1.0;
  let bFieldLines = [];

  // Theme Colors (provide safe defaults)
  let bgColor = 240, lineColor = 100, particleColor = 0;
  let chargePosColor = 255, chargeNegColor = 50, wireColor = 100, textColor = 0;
  let eLineCol = 50, bLineCol = 150;

  // --- Particle Class (Add logging) ---
  class Particle {
    constructor(id) {
      this.id = id; // For tracking specific particles
      this.side = (p.random(1) < 0.5) ? 'E' : 'B';
      this.pos = p.createVector(p.random(canvasWidth), p.random(canvasHeight)); // Start random initially
      this.vel = p5.Vector.random2D().mult(p.random(0.1, 0.5));
      this.acc = p.createVector(0, 0);
      this.maxSpeed = p.random(1.5, 3.0);
      this.lifespan = p.random(150, 300);
      this.origLifespan = this.lifespan;
      this.baseSize = p.random(1.5, 3.5);
      this.color = particleColor; // Initialize with default
      // console.log(`Particle ${this.id} created on side ${this.side}`);
    }

    applyForce(force) {
      if (!force || typeof force.mult !== 'function') {
        // console.warn(`Particle ${this.id} received invalid force:`, force);
        return;
      }
      this.acc.add(force.mult(0.1));
    }

    update() {
      try { // Wrap in try-catch
        let force;
        if (this.side === 'E') {
          force = calculateEField(this.pos.x, this.pos.y);
        } else { // 'B' side
          force = calculateBField(this.pos.x, this.pos.y);
          // B field steering (optional, add complexity carefully)
          // let desiredVel = force.copy().normalize().mult(this.maxSpeed);
          // let steer = p5.Vector.sub(desiredVel, this.vel);
          // steer.limit(0.1);
          // this.applyForce(steer);
        }

        // Apply calculated force directly for both for simplicity now
        this.applyForce(force);

        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.lifespan -= 1;

        if (this.lifespan < 0 || this.isOutOfBounds()) {
          this.reset();
        }
      } catch (err) {
        console.error(`Error updating particle ${this.id}:`, err, this);
        this.reset(); // Attempt reset on error
      }
    }

    display() {
      try { // Wrap in try-catch
        let alpha = p.map(this.lifespan, 0, this.origLifespan * 0.6, 0, 180, true);
        let currentSize = this.baseSize * p.map(this.lifespan, 0, this.origLifespan, 0.2, 1, true);
        if (this.color === undefined || this.color === null) {
          // Fallback color if theme hasn't loaded
          p.fill(150, alpha); // Grey fallback
        } else {
          // Use p5 color object directly
          p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), alpha);
        }
        p.noStroke();
        p.ellipse(this.pos.x, this.pos.y, currentSize, currentSize);
      } catch (err) {
        console.error(`Error displaying particle ${this.id}:`, err, this);
      }
    }

    isOutOfBounds() {
      const buffer = 5; // Small buffer
      if (this.side === 'E') { return this.pos.x < buffer || this.pos.x > midX - buffer || this.pos.y < buffer || this.pos.y > canvasHeight - buffer; }
      else { return this.pos.x < midX + buffer || this.pos.x > canvasWidth - buffer || this.pos.y < buffer || this.pos.y > canvasHeight - buffer; }
    }

    reset() {
      try { // Wrap in try-catch
        this.side = (p.random(1) < 0.5) ? 'E' : 'B';
        this.lifespan = p.random(150, 300);
        this.origLifespan = this.lifespan;
        this.color = particleColor; // Re-apply current theme color

        // Ensure positions are valid before calculating fields
        chargePos = chargePos || p.createVector(midX * 0.5, canvasHeight / 2); // Fallback if setup hasn't run
        chargeNeg = chargeNeg || p.createVector(midX * 0.5, canvasHeight / 2);
        wireCenter = wireCenter || p.createVector(midX * 1.5, canvasHeight / 2);

        if (this.side === 'E') {
          let source = chargeMagnitude > 0 ? chargePos : chargeNeg;
          let angle = p.random(p.TWO_PI);
          let r = 12;
          this.pos = p5.Vector.add(source, p5.Vector.fromAngle(angle, r));
          let initForce = calculateEField(this.pos.x, this.pos.y);
          this.vel = initForce ? initForce.normalize().mult(p.random(1, this.maxSpeed)) : p.createVector(); // Initial vel
        } else { // Side 'B'
          let angle = p.random(p.TWO_PI);
          let r = p.random(canvasWidth * 0.05, midX * 0.35);
          this.pos = p5.Vector.add(wireCenter, p5.Vector.fromAngle(angle, r));
          let initForce = calculateBField(this.pos.x, this.pos.y);
          this.vel = initForce ? initForce.normalize().mult(p.random(0.5, this.maxSpeed)) : p.createVector(); // Initial vel
        }
        this.vel.limit(this.maxSpeed); // Limit initial velocity
        this.acc.mult(0); // Ensure acceleration is zeroed
        // console.log(`Particle ${this.id} reset to side ${this.side}`);
      } catch (err) {
        console.error(`Error resetting particle ${this.id}:`, err);
        // Fallback reset position
        this.pos = p.createVector(p.random(canvasWidth), p.random(canvasHeight));
        this.vel = p.createVector(); this.acc = p.createVector(); this.lifespan = 0;
      }
    }
  } // End Particle Class

  // --- Field Calculations (Add checks) ---
  function calculateEField(x, y) {
    try {
      if (!chargePos || !chargeNeg) return p.createVector(0, 0); // Need charges defined
      let field = p.createVector(0, 0);
      let dirPos = p5.Vector.sub(p.createVector(x, y), chargePos);
      let distSqPos = p.max(dirPos.magSq(), 100);
      let strengthPos = (1500 * chargeMagnitude) / distSqPos;
      field.add(dirPos.normalize().mult(strengthPos));
      let dirNeg = p5.Vector.sub(p.createVector(x, y), chargeNeg);
      let distSqNeg = p.max(dirNeg.magSq(), 100);
      let strengthNeg = (-1500 * chargeMagnitude) / distSqNeg; // Different charge sign
      field.add(dirNeg.normalize().mult(strengthNeg));
      return field;
    } catch (err) { console.error("Error in calculateEField:", err); return p.createVector(0, 0); }
  }

  function calculateBField(x, y) {
    try {
      if (!wireCenter) return p.createVector(0, 0); // Need wire center defined
      let fieldVec = p5.Vector.sub(p.createVector(x, y), wireCenter);
      let r = p.max(fieldVec.mag(), 5);
      let strength = (500 * currentStrength) / r;
      let forceDir = p.createVector(-fieldVec.y, fieldVec.x).normalize(); // CCW default
      return forceDir.mult(strength);
    } catch (err) { console.error("Error in calculateBField:", err); return p.createVector(0, 0); }
  }

  // --- Field Line Calculation (Simplify error handling) ---
  function calculateFieldLinesE() {
    console.log("Calculating E lines...");
    try {
      eFieldLines = []; const numSteps = 80; const stepLength = 2.5;
      if (!chargePos || !chargeNeg) { console.warn("Cannot calc E lines: charges undefined"); return; }
      let source = chargeMagnitude > 0 ? chargePos : chargeNeg;
      let sink = chargeMagnitude > 0 ? chargeNeg : chargePos;
      for (let i = 0; i < numELines; i++) {
        let angle = p.map(i, 0, numELines, 0, p.TWO_PI); let rStart = 15; let line = []; let currentPos = p5.Vector.add(source, p5.Vector.fromAngle(angle, rStart));
        for (let step = 0; step < numSteps; step++) {
          line.push(currentPos.copy()); let field = calculateEField(currentPos.x, currentPos.y); if (!field || field.magSq() < 1e-4) break; currentPos.add(field.normalize().mult(stepLength)); if (currentPos.dist(sink) < rStart * 0.8) break; if (currentPos.x < 0 || currentPos.x > midX || currentPos.y < 0 || currentPos.y > canvasHeight) break;
        }
        if (line.length > 2) eFieldLines.push(line);
      }
      console.log("E lines calculated:", eFieldLines.length);
    } catch (err) { console.error("Error calculating E lines:", err); eFieldLines = []; }
  }

  function calculateFieldLinesB() {
    console.log("Calculating B lines...");
    try {
      bFieldLines = []; const numSteps = 150; let maxRadius = midX * 0.40;
      if (!wireCenter) { console.warn("Cannot calc B lines: wireCenter undefined"); return; }
      for (let i = 0; i < numBLines; i++) {
        let r = p.map(i, 0, numBLines - 1, canvasWidth * 0.06, maxRadius); let line = []; let numSegments = p.max(30, Math.floor(r * 0.8));
        for (let angStep = 0; angStep <= numSegments; angStep++) { let angle = p.map(angStep, 0, numSegments, 0, p.TWO_PI) * Math.sign(currentStrength); let x = wireCenter.x + r * p.cos(angle); let y = wireCenter.y + r * p.sin(angle); line.push(p.createVector(x, y)); }
        if (line.length > 1) bFieldLines.push(line); // Push even if not fully closed? No, needs >1 vertex for beginShape
      }
      console.log("B lines calculated:", bFieldLines.length);
    } catch (err) { console.error("Error calculating B lines:", err); bFieldLines = []; }
  }

  // --- Drawing (Add checks) ---
  function drawFieldLines(lineSet, lineColor, drawArrows = true, arrowSpacing = 8) {
    if (!lineSet || lineSet.length === 0) return;
    p.noFill();
    p.stroke(lineColor, 130);
    p.strokeWeight(1.2);
    lineSet.forEach(line => {
      if (line.length < 2) return;
      p.beginShape();
      line.forEach(pt => p.vertex(pt.x, pt.y)); // Ensure points are valid vectors? Add checks maybe
      p.endShape();

      // Arrows (simplified checks)
      if (drawArrows && line.length >= arrowSpacing) {
        for (let i = Math.floor(arrowSpacing / 2); i < line.length - 1; i += arrowSpacing) {
          let pos = line[i]; let nextPos = line[i + 1]; if (!pos || !nextPos) continue;
          let dir = p5.Vector.sub(nextPos, pos); if (dir.magSq() < 1e-4) continue; // Skip if points identical
          p.push(); p.translate(pos.x, pos.y); p.rotate(dir.heading());
          p.fill(lineColor, 180); p.noStroke(); p.triangle(0, 0, -5, -2, -5, 2); p.pop();
        }
      }
    });
  }

  function drawSources() {
    try {
      if (!chargePos || !chargeNeg || !wireCenter) return;
      // E-Side Sources
      let posCol = chargeMagnitude > 0 ? chargePosColor : chargeNegColor;
      let negCol = chargeMagnitude > 0 ? chargeNegColor : chargePosColor;
      p.noStroke(); p.fill(posCol); p.ellipse(chargePos.x, chargePos.y, 20, 20);
      p.fill(negCol); p.ellipse(chargeNeg.x, chargeNeg.y, 20, 20);
      p.fill(bgColor); p.textSize(16); p.textAlign(p.CENTER, p.CENTER);
      p.text(chargeMagnitude > 0 ? '+' : '-', chargePos.x, chargePos.y - 1);
      p.text(chargeMagnitude > 0 ? '-' : '+', chargeNeg.x, chargeNeg.y - 1);

      // B-Side Source
      p.strokeWeight(2); p.stroke(wireColor); p.fill(bgColor);
      p.ellipse(wireCenter.x, wireCenter.y, 15, 15);
      if (currentStrength > 0) { p.fill(wireColor); p.noStroke(); p.ellipse(wireCenter.x, wireCenter.y, 6, 6); }
      else { p.stroke(wireColor); p.strokeWeight(1.5); p.line(wireCenter.x - 3, wireCenter.y - 3, wireCenter.x + 3, wireCenter.y + 3); p.line(wireCenter.x - 3, wireCenter.y + 3, wireCenter.x + 3, wireCenter.y - 3); }
    } catch (err) { console.error("Error drawing sources:", err); }
  }

  // --- p5 Setup ---
  p.setup = function () {
    console.log("Foundation Sketch: setup() called");
    try {
      let container = document.getElementById('p5-canvas-foundation');
      if (!container) { throw new Error("'p5-canvas-foundation' not found!"); }

      canvasWidth = container.offsetWidth;
      canvasHeight = p.max(350, canvasWidth * 0.5);
      if (canvasWidth <= 0 || canvasHeight <= 0) { // Ensure valid dimensions
        console.warn("Foundation container has zero dimensions. Using defaults.");
        canvasWidth = 300; canvasHeight = 350;
      }
      let canvas = p.createCanvas(canvasWidth, canvasHeight);
      canvas.parent('p5-canvas-foundation');
      console.log(`Foundation Canvas created: ${canvasWidth}x${canvasHeight}`);

      midX = canvasWidth / 2;

      // Initial positions - DEFINE THEM HERE
      chargePos = p.createVector(midX * 0.5 - canvasWidth * 0.15, canvasHeight * 0.5);
      chargeNeg = p.createVector(midX * 0.5 + canvasWidth * 0.15, canvasHeight * 0.5);
      wireCenter = p.createVector(midX + (canvasWidth - midX) * 0.5, canvasHeight * 0.5);

      setupThemeColors(); // Needs p5 color function, so call after createCanvas

      console.log("Calculating initial field lines...");
      calculateFieldLinesE();
      calculateFieldLinesB();

      console.log("Initializing particles...");
      particles = []; // Clear first
      for (let i = 0; i < numParticles; i++) { particles.push(new Particle(i)); }
      // Initialize positions based on initial mode (maybe start all on E?)
      particles.forEach(pt => { pt.side = 'E'; pt.reset(); }); // Start all on E side

      document.body.addEventListener('themeChanged', () => { setupThemeColors(); });
      console.log("Foundation setup complete.");

    } catch (err) {
      console.error("--- CRITICAL ERROR IN foundationSketch setup() ---", err);
      // Display error in the container?
      let container = document.getElementById('p5-canvas-foundation');
      if (container) container.innerHTML = `<p style="color:red; font-weight:bold; padding:1em;">Error during setup. Check console.</p>`;
      p.noLoop(); // Stop sketch if setup fails
    }
  };

  // --- p5 Draw ---
  p.draw = function () {
    try { // Wrap main draw loop
      if (!chargePos || !wireCenter) { // Guard against setup failure
        p.background(200); p.fill(0); p.textAlign(p.CENTER);
        p.text("Setup failed, check console.", p.width / 2, p.height / 2);
        p.noLoop(); return;
      }

      p.background(bgColor);

      // Divider Line
      p.stroke(textColor, 50); p.strokeWeight(1);
      p.line(midX, 0, midX, canvasHeight);

      // Left Side (Electric)
      p.push();
      drawFieldLines(eFieldLines, eLineCol, true);
      drawSources(); // Draws both E and B sources (defined globally)
      particles.filter(pt => pt.side === 'E').forEach(pt => { pt.update(); pt.display(); });
      // E-Side Labels
      p.fill(textColor); p.noStroke(); p.textAlign(p.CENTER); p.textSize(14);
      p.text("Gauss's Law for E", midX * 0.5, 25);
      p.textSize(11); p.fill(textColor, 200); p.text("∇⋅D = ρ", midX * 0.5, 45);
      p.textSize(9); p.fill(textColor, 150); p.text("(Field lines start/end on charge)", midX * 0.5, 60);
      p.text("Click E-side to flip charge", midX * 0.5, 75);
      p.pop();

      // Right Side (Magnetic)
      p.push();
      drawFieldLines(bFieldLines, bLineCol, true, 12); // Less frequent arrows for B?
      // drawSources(); // Already drawn
      particles.filter(pt => pt.side === 'B').forEach(pt => { pt.update(); pt.display(); });
      // B-Side Labels
      p.fill(textColor); p.noStroke(); p.textAlign(p.CENTER); p.textSize(14);
      p.text("Gauss's Law for B", midX + (canvasWidth - midX) * 0.5, 25);
      p.textSize(11); p.fill(textColor, 200); p.text("∇⋅B = 0", midX + (canvasWidth - midX) * 0.5, 45);
      p.textSize(9); p.fill(textColor, 150); p.text("(Field lines form closed loops)", midX + (canvasWidth - midX) * 0.5, 60);
      p.text("Click B-side to reverse current", midX + (canvasWidth - midX) * 0.5, 75);
      p.pop();

    } catch (err) {
      console.error("--- CRITICAL ERROR IN foundationSketch draw() ---", err);
      p.background(200); p.fill(255, 0, 0); p.textAlign(p.CENTER); p.text("RUNTIME ERROR. Check console.", p.width / 2, p.height / 2);
      p.noLoop(); // Stop on error
    }
  };

  // --- Interaction ---
  p.mousePressed = function () {
    if (!chargePos || !wireCenter) return; // Don't interact if setup failed
    // Check bounds to avoid triggering on clicks outside canvas
    if (p.mouseX < 0 || p.mouseX > canvasWidth || p.mouseY < 0 || p.mouseY > canvasHeight) {
      return;
    }

    if (p.mouseX < midX) { // Click on Left (E) Side
      chargeMagnitude *= -1;
      calculateFieldLinesE(); // Recalculate lines
      particles.filter(pt => pt.side === 'E').forEach(pt => pt.reset()); // Reset relevant particles
      console.log("Foundation Sketch: Flipped charge magnitude:", chargeMagnitude);
    } else { // Click on Right (B) Side
      currentStrength *= -1;
      calculateFieldLinesB(); // Recalculate lines
      particles.filter(pt => pt.side === 'B').forEach(pt => pt.reset()); // Reset relevant particles
      console.log("Foundation Sketch: Flipped current strength:", currentStrength);
    }
  };

  // --- Theme and Resize Helpers ---
  function setupThemeColors() { /* ... Same as before ... */
    const theme = document.body.getAttribute('data-theme') || 'light'; let prim = getThemeColor('--primary-color'), sec = getThemeColor('--secondary-color'); textColor = getThemeColor('--text-color'); particleColor = getThemeColor('--text-color-light'); if (theme === 'dark') { bgColor = p.color(32, 33, 36); chargePosColor = p.color(255, 138, 128); chargeNegColor = p.color(138, 180, 248); wireColor = p.color(200); particleColor = p.color(232, 234, 237); eLineCol = chargeNegColor; bLineCol = p.color(129, 201, 149); } else { bgColor = p.color(248, 249, 250); chargePosColor = p.color(211, 47, 47); chargeNegColor = p.color(66, 133, 244); wireColor = p.color(80); particleColor = p.color(95, 99, 104); eLineCol = chargeNegColor; bLineCol = p.color(52, 168, 83); }
    // Update particles immediately
    particles.forEach(pt => pt.color = particleColor);
  }
  function getThemeColor(varName) { try { return p.color(getComputedStyle(document.body).getPropertyValue(varName).trim()); } catch (e) { return p.color(128); } }
  p.windowResized = function () { /* ... Same resize logic ... */
    let container = document.getElementById('p5-canvas-foundation'); if (!container) return; canvasWidth = container.offsetWidth; canvasHeight = p.max(350, canvasWidth * 0.5); try { p.resizeCanvas(canvasWidth, canvasHeight); } catch (e) { console.error("Resize failed:", e); return; } midX = canvasWidth / 2; chargePos.set(midX * 0.5 - canvasWidth * 0.15, canvasHeight * 0.5); chargeNeg.set(midX * 0.5 + canvasWidth * 0.15, canvasHeight * 0.5); wireCenter.set(midX + (canvasWidth - midX) * 0.5, canvasHeight * 0.5); calculateFieldLinesE(); calculateFieldLinesB(); particles.forEach(pt => pt.reset()); console.log("Resized foundation canvas");
  };

  console.log("Foundation Sketch: Function defined."); // Final log
};
