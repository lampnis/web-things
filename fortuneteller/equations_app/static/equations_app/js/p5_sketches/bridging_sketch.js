// === p5.js Sketch: Bridging Theorems Overhaul v6 (bridging_sketch.js - FIX 4 - Definition Order) ===

// Displays concepts of Divergence Theorem and Stokes' Theorem side-by-side.
// Fixes ReferenceErrors by defining functions BEFORE setup calls them.

let bridgingSketch = function (p) {
  console.log("Bridging Sketch v6: Defining function...");

  // --- Declare variables in sketch scope ---
  let canvasWidth = 100, canvasHeight = 100; let midX = 50;
  let particles = []; const numParticles = 150;
  let boundaryPoints = []; let boundaryCenterX, boundaryCenterY, boundaryRadius;
  let sourcePos, chargeNeg, chargeMagnitude = 1.0; // E-Side
  let vortexPos, currentStrength = 1.0; // B-Side
  let fluxArrows = [], circulationArrows = []; let eFieldLines = [], bFieldLines = [];
  let bgColor, textColor, boundaryColor, particleColor, chargePosColor, chargeNegColor, wireColor, divSourceColor, divArrowColor, curlVortexColor, curlArrowColor, eLineCol, bLineCol;


  // ========================================== //
  // ==  DEFINE ALL FUNCTIONS BEFORE setup() == //
  // ========================================== //

  // --- Field Calculations ---
  const calculateDivergenceField = function (x, y) {
    // Added chargeNeg definition for clearer sink behavior
    try {
      if (!sourcePos || !chargeNeg) return p.createVector(0, 0);
      let field = p.createVector(0, 0); let dP = p5.Vector.sub(p.createVector(x, y), sourcePos); let dSP = p.max(dP.magSq(), 100); let sP = (1500 * chargeMagnitude) / dSP; field.add(dP.normalize().mult(sP)); let dN = p5.Vector.sub(p.createVector(x, y), chargeNeg); let dSN = p.max(dN.magSq(), 100); let sN = (-1500 * chargeMagnitude) / dSN; field.add(dN.normalize().mult(sN)); return field;
    } catch (e) { console.error("Div Field Err:", e); return p.createVector(0, 0); }
  }
  const calculateCurlField = function (x, y) {
    try { if (!vortexPos) return p.createVector(0, 0); let fV = p5.Vector.sub(p.createVector(x, y), vortexPos); let r = p.max(fV.mag(), 5); let s = (600 * currentStrength) / r; let fD = p.createVector(-fV.y, fV.x).normalize(); return fD.mult(s); } catch (e) { console.error("Curl Field Err:", e); return p.createVector(0, 0); }
  }

  // --- Boundary & Arrow Calculations ---
  const defineBoundaryAndArrows = function (cx, cy, radius, numPoints = 32, numArrows = 16) {
    try {
      boundaryPoints = []; fluxArrows = []; circulationArrows = []; let arrowSpacing = Math.floor(numPoints / numArrows); for (let i = 0; i < numPoints; i++) {
        let a = p.map(i, 0, numPoints, 0, p.TWO_PI), pos = p.createVector(cx + radius * p.cos(a), cy + radius * p.sin(a)); boundaryPoints.push(pos);
        if (i % arrowSpacing === 0) { let n = p5.Vector.sub(pos, p.createVector(cx, cy)).normalize(); fluxArrows.push({ pos: pos, dir: n }); let t = p.createVector(-n.y, n.x).mult(Math.sign(currentStrength || 1)); circulationArrows.push({ pos: pos, dir: t.normalize() }); }
      } if (boundaryPoints.length > 0) boundaryPoints.push(boundaryPoints[0].copy());
    } catch (e) { console.error("Boundary/Arrow Error:", e) }
  }

  // --- Field Line Calculation ---
  const calculateFieldLinesE = function () {
    // console.log("Calculating E lines..."); // Reduce logging noise
    try { eFieldLines = []; const numSteps = 90; const stepLength = 2.5; if (!sourcePos || !chargeNeg) { console.warn("Cannot calc E lines"); return; } let source = chargeMagnitude > 0 ? sourcePos : chargeNeg; let sink = chargeMagnitude > 0 ? chargeNeg : sourcePos; for (let i = 0; i < numELines; i++) { let angle = p.map(i, 0, numELines, 0, p.TWO_PI); let rStart = 15; let line = []; let currentPos = p5.Vector.add(source, p5.Vector.fromAngle(angle, rStart)); for (let step = 0; step < numSteps; step++) { line.push(currentPos.copy()); let field = calculateDivergenceField(currentPos.x, currentPos.y); if (!field || field.magSq() < 1e-4) break; currentPos.add(field.normalize().mult(stepLength)); if (currentPos.dist(sink) < rStart * 0.8) break; if (currentPos.x < 0 || currentPos.x > midX || currentPos.y < 0 || currentPos.y > canvasHeight) break; } if (line.length > 2) eFieldLines.push(line); } } catch (err) { console.error("Error E lines:", err); eFieldLines = []; }
  }

  const calculateFieldLinesB = function () {
    // console.log("Calculating B lines...");
    try { bFieldLines = []; const numSteps = 150; let maxRadius = midX * 0.40; if (!vortexPos) { console.warn("Cannot calc B lines"); return; } for (let i = 0; i < numBLines; i++) { let r = p.map(i, 0, numBLines - 1, canvasWidth * 0.06, maxRadius); let line = []; let numSegments = p.max(30, Math.floor(r * 0.8)); for (let angStep = 0; angStep <= numSegments; angStep++) { let angle = p.map(angStep, 0, numSegments, 0, p.TWO_PI) * Math.sign(currentStrength || 1); let x = vortexPos.x + r * p.cos(angle); let y = vortexPos.y + r * p.sin(angle); line.push(p.createVector(x, y)); } if (line.length > 1) bFieldLines.push(line); } } catch (err) { console.error("Error B lines:", err); bFieldLines = []; }
  }


  // --- Drawing Helpers ---
  const drawBoundary = function () { if (boundaryPoints.length < 2) return; p.stroke(boundaryColor); p.strokeWeight(1.5); p.noFill(); p.beginShape(); boundaryPoints.forEach(pt => p.vertex(pt.x, pt.y)); p.endShape(); }
  const drawArrows = function (arrowList, arrowColor) { let arrSize = 6; p.fill(arrowColor); p.stroke(arrowColor); p.strokeWeight(1); arrowList.forEach(arrow => { if (!arrow || !arrow.pos || !arrow.dir) return; p.push(); p.translate(arrow.pos.x, arrow.pos.y); p.rotate(arrow.dir.heading()); p.line(0, 0, arrSize * 1.2, 0); p.triangle(arrSize * 1.2, 0, arrSize * 0.6, -arrSize / 3, arrSize * 0.6, arrSize / 3); p.pop(); }); }
  const drawSources = function () { try { if (!sourcePos || !chargeNeg || !vortexPos) return; let posCol = chargeMagnitude > 0 ? chargePosColor : chargeNegColor, negCol = chargeMagnitude > 0 ? chargeNegColor : chargePosColor; p.noStroke(); p.fill(posCol); p.ellipse(sourcePos.x, sourcePos.y, 18, 18); p.fill(negCol); p.ellipse(chargeNeg.x, chargeNeg.y, 18, 18); p.fill(bgColor); p.textSize(14); p.textAlign(p.CENTER, p.CENTER); p.text(chargeMagnitude > 0 ? '+' : '-', sourcePos.x, sourcePos.y - 1); p.text(chargeMagnitude > 0 ? '-' : '+', chargeNeg.x, chargeNeg.y - 1); p.strokeWeight(2); p.stroke(wireColor); p.fill(bgColor); p.ellipse(vortexPos.x, vortexPos.y, 15, 15); if (currentStrength > 0) { p.fill(wireColor); p.noStroke(); p.ellipse(vortexPos.x, vortexPos.y, 6, 6); } else { p.stroke(wireColor); p.strokeWeight(1.5); p.line(vortexPos.x - 3, vortexPos.y - 3, vortexPos.x + 3, vortexPos.y + 3); p.line(vortexPos.x - 3, vortexPos.y + 3, vortexPos.x + 3, vortexPos.y - 3); } } catch (err) { console.error("Error drawing sources:", err); } }
  const drawFieldLines = function (lineSet, lineColor, drawArrows = true, arrowSpacing = 8) { if (!lineSet || lineSet.length === 0) return; p.noFill(); p.stroke(lineColor, 130); p.strokeWeight(1.2); lineSet.forEach(line => { if (line.length < 2) return; p.beginShape(); line.forEach(pt => { if (pt?.x != null && pt?.y != null) p.vertex(pt.x, pt.y) }); p.endShape(); if (drawArrows && line.length >= arrowSpacing) { for (let i = Math.floor(arrowSpacing / 2); i < line.length - 1; i += arrowSpacing) { let pos = line[i], nextPos = line[i + 1]; if (!pos || !nextPos) continue; let dir = p5.Vector.sub(nextPos, pos); if (dir.magSq() < 1e-4) continue; p.push(); p.translate(pos.x, pos.y); p.rotate(dir.heading()); p.fill(lineColor, 180); p.noStroke(); p.triangle(0, 0, -5, -2, -5, 2); p.pop(); } } }); }

  // --- Theme Helper ---
  getThemeColor = function (varName) { try { const c = getComputedStyle(document.body).getPropertyValue(varName).trim(); return p.color(c); } catch (e) { console.warn(`Color parse err: ${varName}`); return p.color(128); } }
  setupThemeColors = function () {
    const theme = document.body.getAttribute('data-theme') || 'light'; textColor = getThemeColor('--text-color'); particleColor = getThemeColor('--text-color-light'); boundaryColor = getThemeColor('--border-color'); wireColor = getThemeColor('--text-color-heading');
    if (theme === 'dark') { bgColor = p.color(32, 33, 36); chargePosColor = p.color(255, 138, 128); chargeNegColor = p.color(138, 180, 248); eLineCol = p.color(138, 180, 248, 100); bLineCol = p.color(129, 201, 149, 100); divSourceColor = p.color(138, 180, 248, 80); divArrowColor = p.color(138, 180, 248, 200); curlVortexColor = p.color(129, 201, 149, 80); curlArrowColor = p.color(129, 201, 149, 200); }
    else { bgColor = p.color(248, 249, 250); chargePosColor = p.color(211, 47, 47); chargeNegColor = p.color(66, 133, 244); eLineCol = p.color(66, 133, 244, 100); bLineCol = p.color(52, 168, 83, 100); divSourceColor = p.color(66, 133, 244, 60); divArrowColor = p.color(66, 133, 244, 200); curlVortexColor = p.color(52, 168, 83, 60); curlArrowColor = p.color(52, 168, 83, 200); }
    particles.forEach(pt => pt.color = particleColor);
  }


  // --- Particle Class Definition MUST come before use in Setup ---
  Particle = class { // Assign to pre-declared name
    constructor(id, initialSide) { this.id = id; this.side = initialSide || ((p.random(1) < 0.5) ? 'Div' : 'Curl'); this.pos = p.createVector(p.random(10, 90), p.random(10, 90)); this.vel = p.createVector(); this.acc = p.createVector(0, 0); this.maxSpeed = p.random(1.0, 2.5); this.lifespan = p.random(150, 300); this.origLifespan = this.lifespan; this.baseSize = p.random(1.5, 3.5); this.color = particleColor; }
    applyForce(force) { if (!force || typeof force.mult !== 'function') return; this.acc.add(force.mult(0.05)); }
    update() { try { let force; if (this.side === 'Div') { force = calculateDivergenceField(this.pos.x, this.pos.y); let sink = chargeMagnitude > 0 ? chargeNeg : sourcePos; if (sink && this.pos.dist(sink) < 10) this.lifespan -= 5; } else if (this.side === 'Curl') { force = calculateCurlField(this.pos.x, this.pos.y); } else { force = p5.Vector.random2D().mult(0.01); } this.applyForce(force); this.vel.add(p5.Vector.random2D().mult(0.1)); this.vel.add(this.acc); this.vel.limit(this.maxSpeed); this.pos.add(this.vel); this.acc.mult(0); this.lifespan -= 1.0; if (this.lifespan < 0 || this.isOutOfBounds()) { this.reset(); } } catch (err) { console.error(`Particle update error[${this.id}]:`, err); this.reset(); } }
    display() { try { let alpha = p.map(this.lifespan, 0, this.origLifespan * 0.6, 0, 150, true); let cSize = this.baseSize * p.map(this.lifespan, 0, this.origLifespan, 0.3, 1, true); p.noStroke(); let baseCol = this.color || p.color(150); let sideCol = this.side === 'Div' ? divSourceColor : (this.side === 'Curl' ? curlVortexColor : baseCol); if (!sideCol) sideCol = baseCol; let dColor = p.lerpColor(baseCol, sideCol, 0.3); try { p.fill(p.red(dColor), p.green(dColor), p.blue(dColor), alpha); } catch (e) { p.fill(150, alpha); } p.ellipse(this.pos.x, this.pos.y, cSize, cSize); } catch (err) { console.error(`Particle display error[${this.id}]:`, err); } }
    isOutOfBounds() { const b = 5; if (this.side === 'Div') { return this.pos.x < b || this.pos.x > midX - b || this.pos.y < b || this.pos.y > canvasHeight - b; } else { return this.pos.x < midX + b || this.pos.x > canvasWidth - b || this.pos.y < b || this.pos.y > canvasHeight - b; } }
    reset() { try { this.side = (p.random(1) < 0.5) ? 'Div' : 'Curl'; this.lifespan = p.random(150, 300); this.origLifespan = this.lifespan; this.color = particleColor; let sourceCharge = chargeMagnitude > 0 ? sourcePos : chargeNeg; if (this.side === 'Div' && sourceCharge) { let a = p.random(p.TWO_PI), r = 12; this.pos = p5.Vector.add(sourceCharge, p5.Vector.fromAngle(a, r)); } else if (this.side === 'Curl' && vortexPos) { let a = p.random(p.TWO_PI), r = p.random(10, boundaryRadius * 0.8); this.pos = p5.Vector.add(vortexPos, p5.Vector.fromAngle(a, r)); } else { this.pos = p.createVector(p.random(canvasWidth), p.random(canvasHeight)); } let initForce; if (this.side === 'Div') { initForce = calculateDivergenceField(this.pos.x, this.pos.y); } else if (this.side === 'Curl') { initForce = calculateCurlField(this.pos.x, this.pos.y); } if (initForce?.normalize) { this.vel = initForce.normalize().mult(p.random(0.5, 1.5)); } else { this.vel = p5.Vector.random2D().mult(p.random(0.2, 0.8)); } this.vel.limit(this.maxSpeed); this.acc.mult(0); } catch (err) { console.error(`Error resetting particle ${this.id}:`, err); this.pos = p.createVector(p.random(canvasWidth), p.random(canvasHeight)); this.vel = p.createVector(); this.acc = p.createVector(); this.lifespan = 0; } }
  }; // End Particle class


  // --- p5 Setup ---
  p.setup = function () {
    console.log("Bridging Sketch v6: setup() starting...");
    try {
      let container = document.getElementById('p5-canvas-bridging');
      if (!container) throw new Error("'p5-canvas-bridging' not found!");
      canvasWidth = container.offsetWidth; canvasHeight = 350;
      if (canvasWidth <= 0) { canvasWidth = 300; console.warn("Container width 0."); }
      let canvas = p.createCanvas(canvasWidth, canvasHeight);
      canvas.parent('p5-canvas-bridging');
      console.log(`Bridging Canvas: ${canvasWidth}x${canvasHeight}`);

      midX = canvasWidth / 2;
      boundaryCenterX = midX / 2; boundaryCenterY = canvasHeight / 2;
      boundaryRadius = p.min(midX * 0.65, canvasHeight * 0.35);

      // Define positions FIRST
      sourcePos = p.createVector(boundaryCenterX, boundaryCenterY); // Source/Positive centered on left
      chargeNeg = p.createVector(boundaryCenterX + boundaryRadius * 1.1, boundaryCenterY); // Dummy sink outside boundary for E field lines
      vortexPos = p.createVector(midX + (canvasWidth - midX) / 2, boundaryCenterY);

      setupThemeColors(); // Depends on p.color

      console.log("Calculating boundary, arrows, lines...");
      defineBoundaryAndArrows(boundaryCenterX, boundaryCenterY, boundaryRadius);
      // These MUST be called after positions are set
      calculateFieldLinesE();
      calculateFieldLinesB();

      console.log("Initializing particles...");
      particles = [];
      for (let i = 0; i < numParticles; i++) { particles.push(new Particle(i, (i < numParticles / 2) ? 'Div' : 'Curl')); }
      particles.forEach(pt => pt.reset());
      console.log("Particles initialized.");

      document.body.addEventListener('themeChanged', setupThemeColors);
      console.log("Bridging v6 setup complete.");

    } catch (err) { console.error("--- CRITICAL ERROR IN setup() ---", err); let c = document.getElementById('p5-canvas-bridging'); if (c) c.innerHTML = `<p class="text-muted error">Setup Error.</p>`; p.noLoop(); }
  };

  // --- p5 Draw ---
  p.draw = function () { /* ... Same draw logic as v5 ... */
    try {
      if (!sourcePos || !vortexPos || !eFieldLines || !bFieldLines || !boundaryPoints) { return; } p.background(bgColor); p.stroke(textColor, 30); p.strokeWeight(1); p.line(midX, 0, midX, canvasHeight); particles.forEach(pt => { pt.update(); pt.display(); });
             /* Left Side */ p.push(); drawBoundary(); drawSources(); drawFieldLines(eFieldLines, eLineCol, true); drawArrows(fluxArrows, divArrowColor); p.fill(textColor); p.noStroke(); p.textAlign(p.CENTER); p.textSize(14); p.text("Divergence Theorem", boundaryCenterX, 25); p.textSize(11); p.fill(textColor, 200); p.text("∇⋅F ≠ 0 Source", boundaryCenterX, 45); p.fill(textColor, 150); p.textSize(10); p.pop();
             /* Right Side */ p.push(); p.translate(midX, 0); let rightCenterX = vortexPos.x - midX, rightCenterY = vortexPos.y; defineBoundaryAndArrows(rightCenterX, rightCenterY, boundaryRadius); drawBoundary(); p.translate(-midX, 0); /* Translate back before drawing elements with absolute coords */ drawFieldLines(bFieldLines, bLineCol, true, 12); drawSources(); /* Re-translate temporarily? No, sources already absolute */ p.translate(midX, 0); drawArrows(circulationArrows, curlArrowColor); p.translate(-midX, 0); /* Translate back */
      p.fill(textColor); p.noStroke(); p.textAlign(p.CENTER); p.textSize(14); p.text("Stokes' Theorem", vortexPos.x, 25); p.textSize(11); p.fill(textColor, 200); p.text("∇×F ≠ 0 Circulation", vortexPos.x, 45); p.fill(textColor, 150); p.textSize(10); p.pop();
    } catch (err) { console.error("Draw loop error:", err); p.background(150); p.fill(255, 0, 0); p.text("DRAW ERROR", p.width / 2, p.height / 2); p.noLoop(); }
  };


  // --- Interaction ---
  p.mousePressed = function () { /* ... Unchanged click logic ... */ if (!sourcePos || !vortexPos || p.mouseX < 0 || p.mouseX > canvasWidth || p.mouseY < 0 || p.mouseY > canvasHeight) return; if (p.mouseX < midX) { chargeMagnitude *= -1; calculateFieldLinesE(); particles.filter(pt => pt.side === 'Div').forEach(pt => pt.reset()); console.log("Flip Div Source:", chargeMagnitude); } else { currentStrength *= -1; calculateFieldLinesB(); particles.filter(pt => pt.side === 'Curl').forEach(pt => pt.reset()); console.log("Flip Curl Source:", currentStrength); } };


  // --- Window Resize ---
  p.windowResized = function () { /* ... Unchanged resize logic, check calls calc functions ... */ try { let c = document.getElementById('p5-canvas-bridging'); if (!c) return; canvasWidth = c.offsetWidth; canvasHeight = 350; p.resizeCanvas(canvasWidth, canvasHeight); midX = canvasWidth / 2; boundaryCenterX = midX / 2; boundaryCenterY = canvasHeight / 2; boundaryRadius = p.min(midX * 0.65, canvasHeight * 0.35); sourcePos.set(boundaryCenterX, boundaryCenterY); chargeNeg.set(boundaryCenterX + boundaryRadius * 1.1, boundaryCenterY); vortexPos.set(midX + (canvasWidth - midX) / 2, boundaryCenterY); chargePos = sourcePos; defineBoundaryAndArrows(boundaryCenterX, boundaryCenterY, boundaryRadius); calculateFieldLinesE(); calculateFieldLinesB(); particles.forEach(pt => pt.reset()); console.log("Resized bridging canvas"); } catch (e) { console.error("Resize err:", e) } };

  console.log("Bridging Sketch v6: Function defined."); // End log
};
