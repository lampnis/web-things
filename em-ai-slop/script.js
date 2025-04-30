document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded and parsed");

  // --- Constants ---
  const epsilon0 = 8.854187817e-12; // F/m

  // --- Interactive Derivations ---
  window.nextStep = function (derivationId) {
    const derivationDiv = document.getElementById(derivationId);
    if (!derivationDiv) return;

    const steps = derivationDiv.querySelectorAll('.step');
    let activeIndex = -1;
    steps.forEach((step, index) => {
      if (step.classList.contains('active')) {
        activeIndex = index;
      }
    });

    const button = derivationDiv.querySelector('button'); // Assuming button exists

    if (activeIndex < steps.length - 1) {
      steps[activeIndex].classList.remove('active');
      steps[activeIndex + 1].classList.add('active');
      // Optionally change button text on last step if button exists
      // if (button && activeIndex + 1 === steps.length - 1) {
      //     button.textContent = 'Reset';
      // } else if (button) {
      //      button.textContent = 'Next Step';
      // }
      // Re-render MathJax for the new step if needed
      if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([steps[activeIndex + 1]]);
      }
    } else {
      // Loop back to the first step
      steps[activeIndex].classList.remove('active');
      steps[0].classList.add('active');
      // Reset button text if button exists
      // if (button) {
      //    button.textContent = 'Next Step';
      // }
      if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([steps[0]]);
      }
    }
  }; // Added semicolon

  // --- Phasor Visualizer ---
  window.updatePhasor = function () {
    const ampInput = document.getElementById('phasor-amp');
    const phaseInput = document.getElementById('phasor-phase');
    const phasorValueSpan = document.getElementById('phasor-value');

    if (!ampInput || !phaseInput || !phasorValueSpan) return; // Defensive check

    const amp = parseFloat(ampInput.value) || 0;
    const phaseDeg = parseFloat(phaseInput.value) || 0;
    const phaseRad = phaseDeg * (Math.PI / 180);

    const realPart = amp * Math.cos(phaseRad);
    const imagPart = amp * Math.sin(phaseRad);

    phasorValueSpan.textContent = `${realPart.toFixed(2)} ${imagPart >= 0 ? '+' : '-'} ${Math.abs(imagPart).toFixed(2)}i`;

    // MathJax re-rendering not strictly needed here as output is text
    // if (window.MathJax && MathJax.typesetPromise) {
    //     MathJax.typesetPromise([phasorValueSpan.parentNode]);
    // }
  }; // Added semicolon
  // Initial call
  updatePhasor();


  // --- Complex Permittivity Explorer ---

  function updateComplexPlanePlot(realPartRel, imagPartRel) {
    const plotArea = document.getElementById('complex-plane-plot');
    const point = document.getElementById('epsilon-point');
    if (!plotArea || !point) return; // Exit if elements not found

    const plotWidth = plotArea.clientWidth;
    const plotHeight = plotArea.clientHeight;

    // Define the visible range *from the origin* for scaling
    // Matches the axis labels in the HTML
    const rangeReal = 100; // Max value for x-axis (represents slider max)
    const rangeImag = 20;  // Max value for y-axis (chosen range)

    // Calculate scaling factors (pixels per unit)
    // Use full width/height as range starts from 0 (bottom-left)
    const scaleX = plotWidth / rangeReal;
    const scaleY = plotHeight / rangeImag;

    // Clamp the *input values* to the defined range before scaling
    let clampedReal = Math.max(0, Math.min(rangeReal, realPartRel));
    let clampedImag = Math.max(0, Math.min(rangeImag, imagPartRel));

    // Calculate position in pixels from the bottom-left origin of the plot area
    let xPos = clampedReal * scaleX;
    // CSS 'bottom' increases upwards, so calculate from bottom edge
    let yPos = clampedImag * scaleY;

    // Apply transform using top/left or bottom/left for positioning
    // Position relative to plotArea container. (0,0) is top-left.
    // Center the dot *itself* over the calculated point (xPos, plotHeight - yPos)
    point.style.left = `${xPos}px`;
    point.style.top = `${plotHeight - yPos}px`; // y=0 is top, so subtract from height
    // transform: translate(-50%, -50%) is already in CSS to center the dot

  } // Semicolon optional for function declaration, but added for consistency below

  window.updateComplexEpsilon = function () {
    // Get input elements
    const epsRInput = document.getElementById('eps-r');
    const sigmaInput = document.getElementById('sigma');
    const freqInput = document.getElementById('frequency');

    // Get output elements
    const epsRValueSpan = document.getElementById('eps-r-value');
    const sigmaValueSpan = document.getElementById('sigma-value');
    const freqValueSpan = document.getElementById('frequency-value');
    const omegaValueSpan = document.getElementById('omega-value');
    const epsPrimeRelSpan = document.getElementById('epsilon-prime-rel-value');
    const epsDoublePrimeRelSpan = document.getElementById('epsilon-double-prime-rel-value');
    const epsCRelSpan = document.getElementById('epsilon-c-rel-value');
    const interpSpan = document.getElementById('epsilon-interp');
    const outputDiv = document.getElementById('complex-epsilon-output'); // Parent for MathJax typesetting

    // Check if all elements exist
    if (!epsRInput || !sigmaInput || !freqInput || !epsRValueSpan || !sigmaValueSpan || !freqValueSpan ||
      !omegaValueSpan || !epsPrimeRelSpan || !epsDoublePrimeRelSpan || !epsCRelSpan || !interpSpan || !outputDiv) {
      console.error("One or more elements for Complex Epsilon Explorer not found.");
      return;
    }

    // Get values
    const epsR = parseFloat(epsRInput.value);
    const sigma = parseFloat(sigmaInput.value);
    const freqGHz = parseFloat(freqInput.value);
    const freq = freqGHz * 1e9; // Convert GHz to Hz

    // Update displayed input values
    epsRValueSpan.textContent = epsR.toFixed(1);
    sigmaValueSpan.textContent = sigma.toFixed(2);
    freqValueSpan.textContent = freqGHz.toFixed(1);

    if (freq <= 0) {
      omegaValueSpan.textContent = "N/A (freq=0)";
      epsPrimeRelSpan.textContent = epsR.toFixed(3);
      epsDoublePrimeRelSpan.textContent = "Infinity";
      epsCRelSpan.textContent = `${epsR.toFixed(3)} + Infinity i`;
      interpSpan.textContent = "Frequency must be positive.";
      // Potentially hide or reset plot point
      const point = document.getElementById('epsilon-point');
      if (point) point.style.display = 'none'; // Hide point if freq is zero
      return; // Exit early
    } else {
      const point = document.getElementById('epsilon-point');
      if (point) point.style.display = 'block'; // Ensure point is visible
    }


    // Calculate derived values
    const omega = 2 * Math.PI * freq;
    const epsilonPrimeRel = epsR; // eps' / eps0 = eps_r
    const epsilonDoublePrimeRel = sigma / (omega * epsilon0); // eps'' / eps0 = sigma / (omega * eps0)

    const epsilonCRelReal = epsilonPrimeRel;
    const epsilonCRelImag = epsilonDoublePrimeRel;

    // Update displayed output values
    omegaValueSpan.textContent = omega.toExponential(3);
    epsPrimeRelSpan.textContent = epsilonPrimeRel.toFixed(3);
    epsDoublePrimeRelSpan.textContent = epsilonDoublePrimeRel.toFixed(3);
    epsCRelSpan.textContent = `${epsilonCRelReal.toFixed(3)} ${epsilonCRelImag >= 0 ? '+' : '-'} ${Math.abs(epsilonCRelImag).toFixed(3)}i`;

    // Interpretation
    let interp = '';
    // Use relative values for interpretation logic
    if (epsilonCRelImag > epsilonCRelReal && epsilonCRelImag > 1) {
      interp = "Lossy/Conductive behavior dominates (\\( \\varepsilon''/\\varepsilon_0 > \\varepsilon'/\\varepsilon_0 \\)).";
    } else if (epsilonCRelImag < 0.1 * epsilonCRelReal || epsilonCRelImag < 0.1) {
      interp = "Low-loss dielectric behavior dominates (\\( \\varepsilon''/\\varepsilon_0 \\ll \\varepsilon'/\\varepsilon_0 \\)).";
    } else {
      interp = "Moderate loss (\\( \\varepsilon''/\\varepsilon_0 \\sim \\varepsilon'/\\varepsilon_0 \\)).";
    }
    // interpSpan is inside outputDiv, which gets typeset below
    interpSpan.innerHTML = interp; // Use innerHTML in case of MathJax in string

    // Update simple plot using relative values
    updateComplexPlanePlot(epsilonCRelReal, epsilonCRelImag);

    // Re-render MathJax for the output area
    if (window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise([outputDiv]);
    }
  }; // Added semicolon

  // Initial call for epsilon explorer
  updateComplexEpsilon();


  // --- Quiz Logic ---
  const quizForm = document.getElementById('quiz-form');
  const resultsDiv = document.getElementById('quiz-results');

  if (quizForm && resultsDiv) {
    quizForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent page reload
      let score = 0;
      const totalQuestions = 4;
      let feedback = '<h4>Quiz Results:</h4><ul>';

      // Question 1
      const q1Answer = quizForm.elements['q1'] ? quizForm.elements['q1'].value : null;
      if (q1Answer === 'divergence') {
        score++;
        feedback += '<li>Question 1: Correct! (Divergence Theorem)</li>';
      } else {
        feedback += `<li class="incorrect">Question 1: Incorrect. The answer is the Divergence Theorem. You selected: ${q1Answer || 'Nothing'}.</li>`;
      }

      // Question 2
      const q2Answer = quizForm.elements['q2'] ? quizForm.elements['q2'].value : null;
      if (q2Answer === '-iomega') {
        score++;
        feedback += '<li>Question 2: Correct! (\\( \\partial/\\partial t \\rightarrow -i\\omega \\))</li>';
      } else {
        feedback += `<li class="incorrect">Question 2: Incorrect. The answer is multiplication by \\(-i\\omega\\). You selected: ${q2Answer || 'Nothing'}.</li>`;
      }

      // Question 3
      const q3Answer = quizForm.elements['q3'] ? quizForm.elements['q3'].value : null;
      if (q3Answer === 'loss') {
        score++;
        feedback += '<li>Question 3: Correct! (\\( \\varepsilon'' \\) represents loss/conduction)</li>';
      } else {
        feedback += `<li class="incorrect">Question 3: Incorrect. The imaginary part represents loss/conduction. You selected: ${q3Answer || 'Nothing'}.</li>`;
      }

      // Question 4 (Approximate check for relative epsilon'')
      const q4Input = quizForm.elements['q4'];
      const q4Answer = q4Input ? parseFloat(q4Input.value) : NaN;
      // Recompute correct answer locally for robustness
      const sigma_q4 = 0.1;
      const freq_q4 = 1e9;
      const omega_q4 = 2 * Math.PI * freq_q4;
      const correct_eps_double_prime_rel = sigma_q4 / (omega_q4 * epsilon0); // Approx 0.00179
      const lowerBoundRel = correct_eps_double_prime_rel * 0.8; // Allow 20% error tolerance
      const upperBoundRel = correct_eps_double_prime_rel * 1.2;

      if (!isNaN(q4Answer) && q4Answer >= lowerBoundRel && q4Answer <= upperBoundRel) {
        score++;
        feedback += `<li>Question 4: Correct! (\\( \\varepsilon'' / \\varepsilon_0 = \\sigma / (\\omega \\varepsilon_0) \\approx ${correct_eps_double_prime_rel.toFixed(4)} \\))</li>`;
      } else {
        const userAnswerText = isNaN(q4Answer) ? 'Not answered or invalid number' : q4Answer.toFixed(4);
        feedback += `<li class="incorrect">Question 4: Incorrect. Calculated \\( \\varepsilon'' / \\varepsilon_0 \\approx ${correct_eps_double_prime_rel.toFixed(4)} \\). Your answer: ${userAnswerText}.</li>`;
      }


      feedback += `</ul><p><strong>Your Score: ${score} out of ${totalQuestions}</strong></p>`;
      resultsDiv.innerHTML = feedback; // Use innerHTML as feedback contains HTML tags
      resultsDiv.className = (score === totalQuestions) ? 'correct' : 'incorrect'; // Use classes for styling feedback

      // Re-render MathJax for the results div to typeset any LaTeX in feedback
      if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([resultsDiv]);
      }
    }); // Semicolon for addEventListener call
  } else {
    console.error("Quiz form or results div not found.");
  }

  // Add event listeners to sliders to update plot immediately
  const sliders = document.querySelectorAll('#complex-epsilon-explorer input[type="range"]');
  sliders.forEach(slider => {
    // Linter might warn here about updateComplexEpsilon not being found,
    // but it's defined on window object earlier and should work fine at runtime.
    slider.addEventListener('input', updateComplexEpsilon); // Use input for continuous update
  }); // Semicolon for forEach call


}); // End DOMContentLoaded (semicolon added)
