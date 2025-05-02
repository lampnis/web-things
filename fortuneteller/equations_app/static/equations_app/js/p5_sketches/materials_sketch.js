// === p5.js Sketch: Materials & Susceptibility (materials_sketch.js) ===

// Visualizes dielectric polarization. Shows 'atoms' with internal charge
// separation (dipole formation) responding to an external E-field.
// Compares low vs high susceptibility.

let materialsSketch = function (p) {
  let atoms = [];
  let numAtoms = 80; // Number of 'atoms' to draw
  let atomGridSize = 5; // How many atoms per row/col roughly

  let eField = p.createVector(0, 0); // External E-field vector
  let susceptibility = 0.5; // Simulated susceptibility (range 0 to ~5 typical)
  let maxDisplacement = 10; // Max separation within an 'atom'

  let canvasWidth, canvasHeight;
  let spacing; // Spacing between atoms

  // Colors (themed)
  let bgColor, atomColor, posChargeColor, negChargeColor, fieldColor, labelColor;

  // Interaction: Mouse position determines E-field strength/direction
  let controlMode = 'mouse'; // Could add 'slider' later

  // --- Atom Class ---
  class Atom {
    constructor(x, y, size) {
      this.pos = p.createVector(x, y); // Center position
      this.size = size * p.random(0.8, 1.2); // Slight size variation
      this.maxInternalDisplacement = maxDisplacement * (size / 15.0); // Scale displacement with size
    }

    display(externalE) {
      p.stroke(atomColor);
      p.strokeWeight(1);
      p.fill(atomColor, 50); // Semi-transparent fill for atom body
      p.ellipse(this.pos.x, this.pos.y, this.size, this.size);

      // Calculate internal charge displacement based on E-field and susceptibility
      // Displacement vector 'd' should align with E and scale with |E| and susceptibility
      // d = factor * susceptibility * E
      let displacementMag = p.min(externalE.mag() * susceptibility * 0.1, this.maxInternalDisplacement);
      let displacementVec = externalE.copy().setMag(displacementMag); // Align with E

      // Calculate positions of internal '+' and '-' charges
      let posChargePos = p5.Vector.add(this.pos, p5.Vector.div(displacementVec, 2));
      let negChargePos = p5.Vector.sub(this.pos, p5.Vector.div(displacementVec, 2));

      // Draw internal charges
      let chargeSize = this.size * 0.25;
      p.noStroke();
      // Positive (red-ish)
      p.fill(posChargeColor);
      p.ellipse(posChargePos.x, posChargePos.y, chargeSize, chargeSize);
      // Negative (blue-ish)
      p.fill(negChargeColor);
      p.ellipse(negChargePos.x, negChargePos.y, chargeSize, chargeSize);

      // Optional: Draw tiny dipole vector P = q*d (proportional to displacementVec)
      // if (displacementMag > 1) {
      //    p.stroke(projectionColor); p.strokeWeight(1);
      //    p.line(negChargePos.x, negChargePos.y, posChargePos.x, posChargePos.y);
      // }
    }
  } // End Atom Class


  // --- p5 Functions ---
  p.setup = function () {
    let container = document.getElementById('p5-canvas-materials');
    if (!container) { console.error("'p5-canvas-materials' not found!"); p.noLoop(); return; }

    canvasWidth = container.offsetWidth;
    // Fixed height relative to width maybe?
    canvasHeight = p.min(400, canvasWidth * 0.8); // Keep it reasonably shaped
    let canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent('p5-canvas-materials');

    // Create atom grid
    createAtoms();

    // Theme setup
    setupThemeColors();
    document.body.addEventListener('themeChanged', setupThemeColors);
  };

  p.draw = function () {
    p.background(bgColor);

    // --- Update E-field based on mouse ---
    // Map mouse position relative to center to an E-field vector
    let mouseXRelative = p.mouseX - canvasWidth / 2;
    let mouseYRelative = p.mouseY - canvasHeight / 2;
    eField.set(mouseXRelative * 0.2, mouseYRelative * 0.2); // Scale mouse input

    // Limit max E field magnitude (optional)
    eField.limit(50);

    // --- Draw Atoms ---
    atoms.forEach(atom => {
      atom.display(eField);
    });

    // --- Draw External E-field Indicator Arrow ---
    if (eField.magSq() > 1) { // Only draw if significant field
      p.push();
      p.translate(canvasWidth / 2, canvasHeight / 2); // Center arrow
      let arrowMag = p.map(eField.mag(), 0, 50, 20, 80, true); // Map magnitude to arrow length
      let arrowVec = eField.copy().setMag(arrowMag);
      p.stroke(fieldColor);
      p.strokeWeight(2.5);
      p.fill(fieldColor);
      p.line(0, 0, arrowVec.x, arrowVec.y);
      // Arrowhead
      p.translate(arrowVec.x, arrowVec.y);
      p.rotate(arrowVec.heading());
      p.triangle(0, 0, -10, -4, -10, 4);
      p.pop();

      // Display E field magnitude text
      p.fill(labelColor); p.noStroke(); p.textAlign(p.LEFT, p.BOTTOM); p.textSize(12);
      p.text(`External E ≈ ${eField.mag().toFixed(1)} (arb. units)`, 10, canvasHeight - 10);
    }

    // --- Display Susceptibility Value ---
    // In a real implementation, add a slider for this!
    p.fill(labelColor); p.noStroke(); p.textAlign(p.RIGHT, p.TOP); p.textSize(12);
    p.text(`Simulated Susceptibility χe ≈ ${susceptibility.toFixed(1)}`, canvasWidth - 10, 10);
    p.textAlign(p.RIGHT, p.TOP); p.textSize(10);
    p.text("(Move mouse to change E-field)", canvasWidth - 10, 30);


  };


  // --- Helper Functions ---

  function createAtoms() {
    atoms = []; // Clear existing atoms
    let padding = 30;
    let availableWidth = canvasWidth - 2 * padding;
    let availableHeight = canvasHeight - 2 * padding;
    let cols = Math.ceil(Math.sqrt(numAtoms * (availableWidth / availableHeight)));
    let rows = Math.ceil(numAtoms / cols);

    let spacingX = availableWidth / (cols);
    let spacingY = availableHeight / (rows);
    spacing = p.min(spacingX, spacingY); // Use smaller spacing
    let atomSize = spacing * 0.6; // Size relative to spacing
    maxDisplacement = atomSize * 0.3; // Max internal displacement relative to size

    let startX = padding + spacingX / 2;
    let startY = padding + spacingY / 2;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (atoms.length < numAtoms) {
          let x = startX + j * spacingX + p.random(-spacingX * 0.1, spacingX * 0.1); // Add jitter
          let y = startY + i * spacingY + p.random(-spacingY * 0.1, spacingY * 0.1);
          atoms.push(new Atom(x, y, atomSize));
        }
      }
    }
  }

  function setupThemeColors() {
    const theme = document.body.getAttribute('data-theme') || 'light';
    let primary = getThemeColor('--primary-color');
    let secondary = getThemeColor('--secondary-color');

    if (theme === 'dark') {
      bgColor = p.color(40, 40, 45);
      atomColor = p.color(100, 100, 110, 200); // Grey atom bodies
      posChargeColor = p.color(255, 120, 120, 230); // Lighter red
      negChargeColor = p.color(120, 120, 255, 230); // Lighter blue
      fieldColor = p.color(255, 235, 59, 200); // Yellow for E-field arrow
      labelColor = getThemeColor('--text-color-light');
    } else {
      bgColor = p.color(248, 249, 250);
      atomColor = p.color(200, 200, 210, 180); // Light grey atom bodies
      posChargeColor = p.color(230, 50, 50, 200); // Red
      negChargeColor = p.color(50, 50, 230, 200); // Blue
      fieldColor = p.color(255, 160, 0, 200); // Orange for E-field arrow
      labelColor = getThemeColor('--text-color');
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
    let container = document.getElementById('p5-canvas-materials');
    if (container) {
      canvasWidth = container.offsetWidth;
      canvasHeight = p.min(400, canvasWidth * 0.8);
      p.resizeCanvas(canvasWidth, canvasHeight);
      createAtoms(); // Recreate atoms based on new size
      console.log("Resized materials sketch canvas");
    }
  };

  // --- Add a way to change susceptibility ---
  // Could potentially hook this up to a slider element outside the canvas later
  // Or simple key press for demo:
  p.keyPressed = function () {
    if (p.key === 'c' || p.key === 'C') {
      // Cycle through a few susceptibility values
      if (susceptibility < 1.0) {
        susceptibility = 2.0;
      } else if (susceptibility < 3.0) {
        susceptibility = 4.5;
      } else {
        susceptibility = 0.5;
      }
      console.log("Susceptibility set to:", susceptibility);
    }
  };

};
