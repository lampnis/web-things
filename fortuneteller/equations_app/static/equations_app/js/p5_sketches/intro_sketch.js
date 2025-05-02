// === p5.js Sketch: Introduction - Abstract Wave Propagation (intro_sketch.js - Overhauled) ===

let introSketch = function (p) {
  let lines = [];
  let numLines = 25;
  let time = 0;
  let baseSpeed = 0.01; // Base speed for wave phase change
  let noiseSpeed = 0.005; // Speed for noise evolution
  let lineLength = 200; // Max length of flowing lines

  let canvasWidth, canvasHeight;
  let bgColor;
  let palette; // Array of theme-based colors

  class FlowLine {
    constructor(y) {
      this.baseY = y;
      this.segments = []; // Store points [x, y, life] for the line
      this.maxLength = p.random(lineLength * 0.5, lineLength * 1.5);
      this.noiseOffset = p.random(1000); // Unique noise seed per line
      this.hueShift = p.random(30); // Slight color variation
      this.initialDelay = p.random(100); // Staggered start
      this.currentLength = 0;
    }

    update(deltaTime) {
      if (this.initialDelay > 0) {
        this.initialDelay -= 1;
        return;
      }

      // 1. Add new segment at the start (left edge)
      let phaseAngle = time * baseSpeed * 150 + this.baseY * 0.02; // Base oscillation
      let noiseVal = p.noise(this.noiseOffset + time * noiseSpeed); // Slow evolution
      let yOffset = p.map(noiseVal, 0, 1, -canvasHeight * 0.2, canvasHeight * 0.2);
      let newY = this.baseY + yOffset + p.sin(phaseAngle) * canvasHeight * 0.1;
      this.segments.unshift({ x: -10, y: newY, life: 1.0 }); // Add to beginning with full life

      // 2. Move existing segments to the right & fade life
      let speedFactor = p.map(this.baseY, 0, canvasHeight, 0.8, 1.5); // Lines move slightly diff speeds
      for (let i = this.segments.length - 1; i >= 0; i--) {
        let seg = this.segments[i];
        seg.x += deltaTime * speedFactor * 1.5; // Move right
        seg.life -= 0.004 / speedFactor; // Fade faster if moving faster

        if (seg.life <= 0 || seg.x > canvasWidth + 10) {
          this.segments.splice(i, 1); // Remove dead or off-screen segments
        }
      }

      // 3. Control max length (optional - let fade handle removal mostly)
      // while(this.segments.length > this.maxLength) {
      //     this.segments.pop(); // Remove oldest segment if too long
      // }
      this.currentLength = this.segments.length;
    }

    display() {
      if (this.segments.length < 2) return;

      p.noFill();
      p.beginShape();
      for (let i = 0; i < this.segments.length; i++) {
        let seg = this.segments[i];
        let nextSeg = this.segments[i + 1]; // For calculating stroke weight/color smoothly

        // Choose color from palette based on noise/position/life
        let paletteIndex = p.floor(p.map(p.noise(this.noiseOffset + seg.y * 0.01), 0, 1, 0, palette.length)) % palette.length;
        let baseColor = palette[paletteIndex];

        let alpha = p.map(seg.life, 0, 1, 0, 200); // Fade out based on life
        let weight = p.map(seg.life, 0, 1, 0.5, 2.5); // Thinner as it fades

        // Smooth color/weight transition (optional)
        if (nextSeg) {
          let nextAlpha = p.map(nextSeg.life, 0, 1, 0, 200);
          let nextWeight = p.map(nextSeg.life, 0, 1, 0.5, 2.5);
          alpha = (alpha + nextAlpha) / 2; // Average alpha
          weight = (weight + nextWeight) / 2; // Average weight
        }

        p.stroke(baseColor, alpha); // Set color and alpha
        p.strokeWeight(weight);

        // Use curveVertex for smoother lines
        p.curveVertex(seg.x, seg.y);
        // Add extra points for first and last vertex for curveVertex behavior
        if (i === 0) p.curveVertex(seg.x, seg.y);
        if (i === this.segments.length - 1) p.curveVertex(seg.x, seg.y);
      }
      p.endShape();
    }
  }


  p.setup = function () {
    let container = document.getElementById('p5-canvas-intro');
    if (!container) { console.error("'p5-canvas-intro' not found!"); p.noLoop(); return; }

    canvasWidth = container.offsetWidth;
    canvasHeight = 300; // Fixed height for consistency
    let canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent('p5-canvas-intro');
    p.noiseSeed(p.random(1000)); // Randomize noise pattern on load

    // Initialize lines spread vertically
    for (let i = 0; i < numLines; i++) {
      let y = p.map(i, 0, numLines - 1, canvasHeight * 0.2, canvasHeight * 0.8);
      lines.push(new FlowLine(y));
    }

    setupThemeColors();
    document.body.addEventListener('themeChanged', setupThemeColors);
  };

  p.draw = function () {
    p.background(bgColor);

    // Use deltaTime for smoother animation independent of frameRate
    let deltaTime = p.deltaTime / 16.666; // Normalize assuming target is ~60fps (16.6ms)
    time += deltaTime;

    // Update and display lines
    for (let line of lines) {
      line.update(deltaTime);
      line.display();
    }

    // Optional: Add subtle overlay text (can be distracting)
    // p.fill(palette ? palette[0] : 200, 50); // Use first palette color faintly
    // p.noStroke();
    // p.textAlign(p.CENTER, p.CENTER);
    // p.textSize(18);
    // p.text("Electromagnetic Waves Flow...", canvasWidth/2, canvasHeight/2);
  };


  function setupThemeColors() {
    const theme = document.body.getAttribute('data-theme') || 'light';
    if (theme === 'dark') {
      bgColor = p.color(32, 33, 36); // Dark background from theme
      // Palette for dark mode: blues, purples, cyans
      palette = [p.color(138, 180, 248, 200), // Primary light blue
      p.color(128, 134, 235, 200), // Indigo-ish
      p.color(107, 200, 219, 200), // Cyan-ish
      p.color(150, 125, 224, 200), // Purple-ish
      p.color(195, 160, 255, 180)];// Lighter Purple
    } else {
      bgColor = p.color(248, 249, 250); // Light background
      // Palette for light mode: blues, greens, maybe a touch of teal
      palette = [p.color(66, 133, 244, 200),  // Primary blue
      p.color(52, 168, 83, 200),  // Secondary green
      p.color(0, 150, 136, 180),  // Teal-ish
      p.color(25, 118, 210, 190), // Deeper blue
      p.color(50, 190, 160, 170)];// Green-cyan
    }
  }

  p.windowResized = function () {
    let container = document.getElementById('p5-canvas-intro');
    if (container) {
      canvasWidth = container.offsetWidth;
      canvasHeight = 300; // Keep height fixed
      p.resizeCanvas(canvasWidth, canvasHeight);
      console.log("Resized Intro sketch canvas");
      // Reset or reposition lines if needed (optional)
      // lines = []; // Or just let them flow off
      // setup(); // Might be too jarring
    }
  };
};
