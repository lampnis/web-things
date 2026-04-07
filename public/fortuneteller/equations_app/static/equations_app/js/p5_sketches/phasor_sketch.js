// === p5.js Sketch: Phasor Visualization - Robust Edition (phasor_sketch.js - v5) ===

// ULTRA-SIMPLIFIED: Focus on reliable drawing of the rotating vector,
// its projection, and the generated wave. Minimal interaction.

let phasorSketch = function (p) {
  console.log("Phasor Sketch (Robust v5): Defining function...");

  // --- Core parameters (simplified controls) ---
  let amplitude = 100;    // Fixed amplitude for now (relative to plotRadius)
  let phase = p.PI / 4; // Fixed initial phase (45 degrees)
  let omega = 0.03;     // Rotation speed (rad/frame)
  let time = 0;         // Simulation time

  // --- State calculated each frame ---
  let currentAngle, tipX, tipY, realProjX;
  let waveHistory = []; // Stores only the real projection value
  let historyLength;

  // --- Layout ---
  let canvasWidth = 100, canvasHeight = 100; // Defaults
  let originX, originY;
  let plotRadius;       // Visual boundary/scale for complex plane
  let waveAreaX, waveAreaY, waveAreaW, waveAreaH;

  // --- Theme Colors (with safe defaults) ---
  let bgColor = p.color(245), axisColor = p.color(150), gridColor = p.color(220);
  let textColor = p.color(50), guideColor = p.color(200);
  let vectorColor = p.color(0, 0, 200), tipColor = p.color(0, 0, 255);
  let realProjColor = p.color(200, 0, 0), waveColor = p.color(0, 0, 180);

  // --- p5 Setup ---
  p.setup = function () {
    console.log("Phasor Sketch (Robust v5): setup() starting...");
    try {
      let container = document.getElementById('p5-canvas-phasor');
      if (!container) throw new Error("Container '#p5-canvas-phasor' not found!");

      canvasWidth = container.offsetWidth;
      canvasHeight = p.constrain(canvasWidth * 0.8, 300, 450); // Keep aspect ratio reasonable
      if (canvasWidth <= 0) { canvasWidth = 300; canvasHeight = 240; }

      let canvas = p.createCanvas(canvasWidth, canvasHeight);
      canvas.parent('p5-canvas-phasor');
      console.log(`Phasor Canvas: ${canvasWidth}x${canvasHeight}`);

      // Calculate layout AFTER canvas exists
      calculateLayout();
      amplitude = plotRadius * 0.75; // Set fixed amplitude based on radius

      setupThemeColors(); // Initialize colors AFTER p5 is ready
      document.body.addEventListener('themeChanged', setupThemeColors);

      p.ellipseMode(p.CENTER);
      p.textAlign(p.CENTER, p.CENTER);
      p.textFont('sans-serif');

      console.log("Phasor Sketch (Robust v5): setup complete.");

    } catch (err) {
      console.error("--- CRITICAL ERROR IN PHASOR SETUP ---", err);
      p.noLoop();
      let container = document.getElementById('p5-canvas-phasor');
      if (container) container.innerHTML = '<p class="text-muted error">Setup Error</p>';
    }
  };


  // --- Layout Calculation ---
  function calculateLayout() {
    originX = canvasWidth * 0.35; // Keep plane left
    originY = canvasHeight * 0.5; // Center vertically
    plotRadius = p.min(originX * 0.8, originY * 0.9); // Radius for complex plane display

    waveAreaX = originX + plotRadius + 30;
    waveAreaY = originY; // Align vertically with phasor origin
    waveAreaW = canvasWidth - waveAreaX - 20;
    waveAreaH = plotRadius * 1.6; // Height available for wave (can be > plotRadius)

    historyLength = p.max(50, Math.floor(waveAreaW)); // Ensure minimum history
    waveHistory = []; // Clear history
  }


  // --- p5 Draw ---
  p.draw = function () {
    try { // Wrap draw loop
      p.background(bgColor);

      // --- Calculate current state ---
      currentAngle = phase - omega * time; // Negative for standard physics convention
      let vectorX = amplitude * p.cos(currentAngle); // Component relative to origin
      let vectorY = amplitude * p.sin(currentAngle); // Math coords: +y is up

      tipX = originX + vectorX;         // Canvas X coordinate
      tipY = originY - vectorY;         // Canvas Y coordinate (inverted)
      realProjX = tipX;                 // Real projection x is same as tip x

      // --- Update Wave History ---
      // Store the REAL component's value directly
      waveHistory.unshift(vectorX); // Store relative value (e.g., -amp to +amp)
      if (waveHistory.length > historyLength) {
        waveHistory.pop();
      }

      // --- Draw Components ---
      drawGrid();
      drawAxes();
      drawWaveTrace(); // Draw trace behind vector
      drawGuides();
      drawPhasorVector();
      drawProjectionPoints();
      drawLabels();

      time += p.deltaTime * 0.06; // Use deltaTime for smoother animation

    } catch (err) {
      console.error("--- ERROR IN PHASOR Draw Loop ---", err);
      p.background(150, 0, 0); p.fill(255); p.textSize(14); p.textAlign(p.CENTER, p.CENTER);
      p.text("RUNTIME DRAW ERROR\nCheck Console", p.width / 2, p.height / 2);
      p.noLoop();
    }
  };


  // --- Drawing Functions (Simplified & Robust) ---
  function drawGrid() {
    p.stroke(gridColor); p.strokeWeight(0.5); p.noFill();
    // Concentric circles
    for (let r = plotRadius * 0.25; r <= plotRadius; r += plotRadius * 0.25) {
      // Check if radius is valid before drawing
      if (r > 0 && !isNaN(r)) p.ellipse(originX, originY, r * 2);
    }
    // Radial lines
    for (let a = 0; a < p.TWO_PI; a += p.PI / 6) {
      let endX = originX + plotRadius * p.cos(a);
      let endY = originY - plotRadius * p.sin(a); // Remember inverted Y
      if (!isNaN(endX) && !isNaN(endY)) p.line(originX, originY, endX, endY);
    }
  }

  function drawAxes() {
    p.stroke(axisColor); p.strokeWeight(1.5);
    let axisPad = 5; // Small padding from edge
    // Real Axis
    p.line(originX - plotRadius - axisPad, originY, originX + plotRadius + axisPad, originY);
    // Imaginary Axis
    p.line(originX, originY - plotRadius - axisPad, originX, originY + plotRadius + axisPad);
    // Labels
    p.fill(textColor); p.noStroke(); p.textSize(10);
    p.textAlign(p.LEFT, p.CENTER); p.text("Re", originX + plotRadius + axisPad + 3, originY);
    p.textAlign(p.CENTER, p.BOTTOM); p.text("Im", originX, originY - plotRadius - axisPad - 3);
  }

  function drawWaveTrace() {
    if (waveHistory.length < 2) return;
    // Wave Axis
    p.stroke(axisColor, 100); p.strokeWeight(1);
    let waveCenterY = waveAreaY; // Use layout variable
    p.line(waveAreaX, waveCenterY, waveAreaX + waveAreaW, waveCenterY);

    // Wave trace
    p.stroke(waveColor); p.strokeWeight(1.5); p.noFill();
    p.beginShape();
    for (let i = 0; i < waveHistory.length; i++) {
      let x = waveAreaX + i;
      // Map stored value (-amp to +amp) to vertical space, centered on waveCenterY
      let y = waveCenterY - p.map(waveHistory[i], -amplitude, amplitude, -waveAreaH / 2.2, waveAreaH / 2.2, true);
      if (x <= waveAreaX + waveAreaW && !isNaN(y)) { // Bounds check
        p.vertex(x, y);
      }
    }
    p.endShape();

    // Connection line
    p.stroke(guideColor); p.strokeWeight(1); p.drawingContext.setLineDash([3, 3]);
    let waveStartY = waveCenterY - p.map(waveHistory[0], -amplitude, amplitude, -waveAreaH / 2.2, waveAreaH / 2.2, true);
    p.line(realProjX, originY, waveAreaX, waveStartY); // Real projection to start of wave
    p.drawingContext.setLineDash([]);

    // Point on wave trace start
    p.fill(waveColor); p.noStroke();
    p.ellipse(waveAreaX, waveStartY, 6, 6);
  }


  function drawGuides() {
    p.strokeWeight(1); p.drawingContext.setLineDash([2, 3]);
    // Projection lines - Check if tipX/Y are valid numbers
    if (!isNaN(tipX) && !isNaN(tipY)) {
      p.stroke(realProjColor, 150); p.line(tipX, tipY, realProjX, originY);
      p.stroke(imagProjColor, 150); p.line(tipX, tipY, originX, tipY); // Use tipY here
    }
    p.drawingContext.setLineDash([]);
  }

  function drawPhasorVector() {
    p.stroke(vectorColor); p.strokeWeight(2.5); p.fill(vectorColor);
    if (!isNaN(tipX) && !isNaN(tipY)) { // Check coordinates are valid
      p.line(originX, originY, tipX, tipY);
      // Arrowhead
      p.push(); p.translate(tipX, tipY); p.rotate(p.atan2(tipY - originY, tipX - originX)); p.triangle(0, 0, -8, -4, -8, 4); p.pop();
      // Simple tip circle
      p.noStroke(); p.fill(tipColor);
      p.ellipse(tipX, tipY, 8, 8);
    } else {
      console.warn("Invalid tip coordinates for phasor:", tipX, tipY);
    }
  }

  function drawProjectionPoints() {
    p.strokeWeight(1); p.stroke(bgColor);
    if (!isNaN(realProjX)) { // Check coord is valid
      p.fill(realProjColor); p.ellipse(realProjX, originY, 8, 8);
    }
    if (!isNaN(tipY)) { // Check coord is valid
      p.fill(imagProjColor); p.ellipse(originX, tipY, 8, 8); // Use tipY (imaginary part's canvas coord)
    }
  }

  function drawLabels() {
    p.textFont('sans-serif'); p.noStroke(); p.fill(textColor); p.textSize(11);
    // Get safe values, default to 0 if amplitude/phase undefined somehow
    let currentMagNorm = amplitude && plotRadius ? (amplitude / plotRadius) : 0;
    let currentPhaseDeg = phase ? ((p.degrees(phase % p.TWO_PI) + 360) % 360) : 0;

    p.textAlign(p.LEFT, p.TOP);
    p.text(`A = |A|e^(iφ)`, 10, 10);
    p.fill(textColor, 200);
    p.text(`|A|/R ≈ ${currentMagNorm.toFixed(2)}`, 15, 28);
    p.text(` φ ≈ ${currentPhaseDeg.toFixed(1)}°`, 15, 43);

    p.textAlign(p.RIGHT, p.BOTTOM); p.textSize(10); p.fill(textColor, 180);
    p.text("A(t) = Re{ A * e^(-iωt) }", canvasWidth - 10, canvasHeight - 10);
  }


  // --- Interaction (REMOVED for stability) ---
  function handleInteraction(type) { /* Placeholder - No mouse interaction in this version */ }
  // function handleMousePressed() { /* Interaction code removed */ }
  // function handleMouseReleased() { /* Interaction code removed */ }


  // --- Theme and Resize ---
  function setupThemeColors() { try { /* ... unchanged theme color logic ... */ const theme = document.body.getAttribute('data-theme') || 'light'; textColor = getThemeColor('--text-color'); let pCol = getThemeColor('--primary-color'); let sCol = getThemeColor('--secondary-color'); let red = theme === 'dark' ? p.color(255, 138, 128) : p.color(211, 47, 47); let green = theme === 'dark' ? p.color(129, 201, 149) : p.color(52, 168, 83); if (theme === 'dark') { bgColor = p.color(32, 33, 36); axisColor = p.color(100, 110, 120); gridColor = p.color(50, 55, 60, 150); guideColor = p.color(100, 110, 120, 100); vectorColor = p.color(138, 180, 248); tipColor = p.color(200, 220, 255); realProjColor = red; imagProjColor = green; waveColor = p.color(173, 216, 230, 220); waveGuideColor = p.color(138, 180, 248, 100); wavePeakColor = p.color(200, 220, 255); } else { bgColor = p.color(248, 249, 250); axisColor = p.color(100, 100, 110); gridColor = p.color(225, 227, 229); guideColor = p.color(180, 185, 190, 150); vectorColor = p.color(66, 133, 244); tipColor = p.color(25, 75, 190); realProjColor = red; imagProjColor = green; waveColor = p.color(66, 133, 244, 220); waveGuideColor = p.color(211, 47, 47, 100); wavePeakColor = p.color(25, 75, 190); } } catch (e) { console.error("Theme Color Err:", e); } }
  function getThemeColor(varName) { try { const c = getComputedStyle(document.body).getPropertyValue(varName).trim(); return p.color(c); } catch (e) { return p.color(128); } }
  p.windowResized = function () { try { let c = document.getElementById('p5-canvas-phasor'); if (!c) return; canvasWidth = c.offsetWidth; canvasHeight = p.constrain(canvasWidth * 0.9, 300, 450); p.resizeCanvas(canvasWidth, canvasHeight); calculateLayout(); amplitude = plotRadius * 0.75; console.log("Resized phasor canvas v5"); } catch (e) { console.error("Resize error phasor:", e); } };

  console.log("Phasor Sketch (Robust v5): Function defined.");
}; // End of phasorSketch definition
