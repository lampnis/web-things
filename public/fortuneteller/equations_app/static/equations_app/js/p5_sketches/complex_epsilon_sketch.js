// === p5.js Sketch: Complex Epsilon - Wave Attenuation (complex_epsilon_sketch.js) ===

// Visualizes a propagating wave whose amplitude decays over distance,
// conceptually representing the effect of the imaginary part of epsilon (loss).

let complexEpsilonSketch = function (p) {
  let wavePhase = 0; // Controls the base oscillation (like time)
  let omega = 0.05;  // Angular frequency for oscillation speed
  let waveLength = 200; // Spatial period of the wave

  // Attenuation factor (alpha) - conceptual, controlled by interaction
  // Higher alpha means faster decay
  let alpha = 0.003; // Default low attenuation
  let alphaMax = 0.015;

  // Initial Wave Amplitude
  let initialAmplitude;

  let canvasWidth, canvasHeight;
  let yCenter;

  // Colors
  let bgColor, waveColor, envelopeColor, gridColor;

  // --- p5 Functions ---
  p.setup = function () {
    let container = document.getElementById('p5-canvas-complex-epsilon');
    if (!container) { console.error("'p5-canvas-complex-epsilon' not found!"); p.noLoop(); return; }

    canvasWidth = container.offsetWidth;
    canvasHeight = 300; // Fixed height seems reasonable
    let canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent('p5-canvas-complex-epsilon');
    p.frameRate(30);

    yCenter = canvasHeight / 2;
    initialAmplitude = canvasHeight * 0.35; // Initial amplitude relative to height

    setupThemeColors();
    document.body.addEventListener('themeChanged', setupThemeColors);
  };

  p.draw = function () {
    p.background(bgColor);

    // --- Interaction: Control attenuation (alpha) with mouse X position ---
    // Map mouseX (0 to width) to alpha range (0 to alphaMax)
    alpha = p.map(p.mouseX, 0, canvasWidth, 0, alphaMax, true); // true restricts to range

    // --- Draw Grid/Background elements ---
    drawGrid();

    // --- Draw the Attenuated Wave ---
    p.stroke(waveColor);
    p.strokeWeight(2.5);
    p.noFill();
    p.beginShape();
    for (let x = 0; x <= canvasWidth; x += 5) { // Iterate across width
      // Calculate decaying amplitude A(x) = A0 * exp(-alpha * x)
      let currentAmplitude = initialAmplitude * p.exp(-alpha * x);

      // Calculate wave oscillation y(x,t) = A(x) * cos(kx - wt + phi)
      // k = 2*pi / lambda
      let k = p.TWO_PI / waveLength;
      // Use wavePhase for wt
      let y = currentAmplitude * p.cos(k * x - wavePhase);

      p.vertex(x, yCenter + y);
    }
    p.endShape();

    // --- Draw the Decay Envelope ---
    p.stroke(envelopeColor, 100); // Fainter color, dashed?
    p.strokeWeight(1);
    p.noFill();
    // Top envelope: y = A0 * exp(-alpha * x)
    p.beginShape();
    for (let x = 0; x <= canvasWidth; x += 10) {
      let envY = initialAmplitude * p.exp(-alpha * x);
      p.vertex(x, yCenter - envY);
    }
    p.endShape();
    // Bottom envelope: y = - A0 * exp(-alpha * x)
    p.beginShape();
    for (let x = 0; x <= canvasWidth; x += 10) {
      let envY = initialAmplitude * p.exp(-alpha * x);
      p.vertex(x, yCenter + envY);
    }
    p.endShape();


    // --- Update Phase for animation ---
    wavePhase += omega;

    // --- Display Attenuation Value ---
    p.fill(envelopeColor); p.noStroke(); p.textAlign(p.LEFT, p.TOP); p.textSize(12);
    let alphaPercent = (alpha / alphaMax) * 100;
    p.text(`Conceptual Attenuation α ~ ${alphaPercent.toFixed(0)}% (linked to ε'')`, 10, 10);
    p.textSize(10);
    p.text("(Move mouse horizontally to change attenuation)", 10, 30);
  };

  // --- Helper Functions ---
  function drawGrid() {
    p.stroke(gridColor, 100); // Faint grid
    p.strokeWeight(0.5);
    // Horizontal center line
    p.line(0, yCenter, canvasWidth, yCenter);
    // Vertical lines (example)
    for (let x = 0; x < canvasWidth; x += 50) {
      p.line(x, 0, x, canvasHeight);
    }
    // Horizontal lines (example)
    for (let y = 0; y < canvasHeight; y += 50) {
      if (Math.abs(y - yCenter) > 10) { // Don't draw over center line
        p.line(0, y, canvasWidth, y);
      }
    }
  }


  function setupThemeColors() {
    const theme = document.body.getAttribute('data-theme') || 'light';
    let primary = getThemeColor('--primary-color');
    let textLight = getThemeColor('--text-color-light');
    let textHeading = getThemeColor('--text-color-heading');

    if (theme === 'dark') {
      bgColor = p.color(40, 40, 45);
      // Use primary color for the wave itself
      waveColor = primary;
      // Use a lighter, desaturated version for envelope/grid/text
      envelopeColor = p.color(primary.levels[0], primary.levels[1], primary.levels[2] - 20, 180); // Use p5 color manipulation
      gridColor = p.color(80, 80, 90); // Darker grey grid
    } else {
      bgColor = p.color(248, 249, 250);
      waveColor = primary;
      envelopeColor = p.color(primary.levels[0], primary.levels[1], primary.levels[2], 150); // Same primary, maybe fainter
      gridColor = p.color(220, 220, 225); // Light grey grid
    }
  }

  function getThemeColor(varName) {
    try {
      const cssVal = getComputedStyle(document.body).getPropertyValue(varName).trim();
      return p.color(cssVal);
    } catch (e) { return p.color(128); }
  }

  // --- Window Resize Handling ---
  p.windowResized = function () {
    let container = document.getElementById('p5-canvas-complex-epsilon');
    if (container) {
      canvasWidth = container.offsetWidth;
      canvasHeight = 300; // Keep fixed height
      p.resizeCanvas(canvasWidth, canvasHeight);
      yCenter = canvasHeight / 2;
      initialAmplitude = canvasHeight * 0.35;
      console.log("Resized complex epsilon sketch canvas");
    }
  };

};
