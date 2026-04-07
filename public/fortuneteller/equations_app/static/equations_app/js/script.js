// --- ✨ Maxwell App + p5.js - script.js (v4 - Focus Derivations & Visibility) ✨ --- //

document.addEventListener('DOMContentLoaded', () => {
  console.log("Maxwell App Script Initializing - v4");

  // --- Theme Management ---
  const themeToggleButton = document.getElementById('theme-toggle');
  if (themeToggleButton) {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = (theme) => {
      document.body.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
      try { localStorage.setItem('theme', theme); } catch (e) { }
      document.body.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    };
    const getInitialTheme = () => (localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light'));
    applyTheme(getInitialTheme());
    themeToggleButton.addEventListener('click', () => applyTheme(document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  } else { console.warn("#theme-toggle not found."); }


  // --- Interactive Derivations (RE-RE-VERIFIED & SIMPLIFIED) ---
  const derivationContainers = document.querySelectorAll('.interactive-derivation');
  console.log(`Derivations - Found ${derivationContainers.length} containers.`);

  derivationContainers.forEach((container) => {
    const derivationId = container.dataset.derivationId || 'unknown-derivation';
    const stepsContainer = container.querySelector('.derivation-steps');
    const steps = stepsContainer ? Array.from(stepsContainer.querySelectorAll(':scope > .step')) : null; // Use querySelectorAll for robustness
    const button = container.querySelector('.derivation-button');
    let currentStepIndex = 0; // Start at step 0

    // **Critical Check for Elements**
    if (!stepsContainer || !steps || steps.length === 0 || !button) {
      console.error(`Derivation Error [${derivationId}]: Missing critical elements. StepsContainer: ${!!stepsContainer}, Steps Found: ${steps ? steps.length : 0}, Button: ${!!button}`);
      container.style.border = '3px solid red'; // Make errors very visible
      if (button) button.disabled = true;
      return; // Do not proceed with this broken derivation
    }

    console.log(`Derivations - Setting up: ${derivationId} with ${steps.length} steps.`);

    // **Function to Display Correct Step**
    const showStep = (indexToShow) => {
      // console.log(`[${derivationId}] Attempting to show step: ${indexToShow}`);
      if (indexToShow < 0 || indexToShow >= steps.length) {
        console.error(`[${derivationId}] Invalid step index: ${indexToShow}`);
        return;
      }

      // Hide ALL steps within this container first
      steps.forEach((stepEl) => {
        stepEl.classList.remove('active');
        // stepEl.style.display = 'none'; // Ensure they are hidden if CSS fails
      });

      // Show ONLY the target step
      const targetStep = steps[indexToShow];
      targetStep.classList.add('active');
      // targetStep.style.display = 'block'; // Ensure it shows if CSS fails

      console.log(`[${derivationId}] Activated step ${indexToShow}. Class list: ${targetStep.className}`);


      // Update button text
      button.textContent = (indexToShow === steps.length - 1) ? 'Reset Derivation' : 'Next Step';

      // Retypeset MathJax - check visibility *after* adding class
      setTimeout(() => { // Delay allows layout reflow
        if (window.MathJax && typeof MathJax.typesetPromise === 'function' && targetStep) {
          const style = window.getComputedStyle(targetStep);
          // Check computed style to be sure it's visible
          if (style.display === 'block' || targetStep.classList.contains('active')) {
            MathJax.typesetPromise([targetStep]).catch(err => console.error(`MathJax error [${derivationId}]:`, err));
          } else {
            // console.warn(`[${derivationId}] MathJax skip: Step ${indexToShow} not visible.`);
          }
        }
      }, 50);
    };

    // **Attach Click Listener**
    button.addEventListener('click', () => {
      currentStepIndex = (currentStepIndex + 1) % steps.length; // Cycle index
      console.log(`[${derivationId}] Button clicked! New index: ${currentStepIndex}`);
      showStep(currentStepIndex);
    });

    // **Initial Setup - CRITICAL**
    console.log(`[${derivationId}] Initializing display, showing step 0.`);
    // Make sure only the FIRST step has 'active' class initially FROM HTML OR clear all first
    steps.forEach((s, i) => s.classList.toggle('active', i === 0));
    // Then run showStep(0) to ensure consistency and trigger initial MathJax
    showStep(0);

  }); // End forEach derivationContainer


  // --- Code Copy Button (Keep As Is) ---
  document.querySelectorAll('.code-container').forEach((container) => { /* ... copy logic ... */
    const copyButton = container.querySelector('.copy-btn');
    const codeBlock = container.querySelector('pre code[class*="language-"]');
    if (copyButton && codeBlock) { copyButton.addEventListener('click', () => { const codeToCopy = codeBlock.innerText || codeBlock.textContent || ""; navigator.clipboard.writeText(codeToCopy).then(() => { const o = copyButton.innerHTML; copyButton.innerHTML = 'Copied!'; copyButton.classList.add('copied'); setTimeout(() => { copyButton.innerHTML = o; copyButton.classList.remove('copied'); }, 2500); }).catch(err => { console.error('Copy fail:', err); const o = copyButton.innerHTML; copyButton.innerHTML = 'Error'; copyButton.disabled = true; setTimeout(() => { copyButton.innerHTML = o; copyButton.disabled = false; }, 3000); }); }); }
  });

  // --- Complex Permittivity Explorer (Keep As Is) ---
  const explorerSection = document.getElementById('complex-epsilon-explorer');
  if (explorerSection) { /* ... epsilon explorer setup & logic ... */
    // Basic Check and Setup from previous versions
    const el = (id) => explorerSection.querySelector(`#${id}`); const inputs = { epsRInput: el('eps-r'), sigmaInput: el('sigma'), freqInput: el('frequency') }; const outputs = { epsRValueSpan: el('eps-r-value'), sigmaValueSpan: el('sigma-value'), freqValueSpan: el('frequency-value'), omegaValueSpan: el('omega-value'), epsPrimeRelSpan: el('epsilon-prime-rel-value'), epsDoublePrimeRelSpan: el('epsilon-double-prime-rel-value'), epsCRelSpan: el('epsilon-c-rel-value'), interpSpan: el('epsilon-interp'), freqGhzDisplaySpan: el('frequency-ghz-display') }; const plotEls = { plotArea: el('complex-plane-plot'), plotPoint: el('epsilon-point-marker') }; const outputDiv = el('complex-epsilon-output'); const allEls = { ...inputs, ...outputs, ...plotEls, outputDiv }; let ok = true; for (const k in allEls) if (!allEls[k]) { console.error(`Explorer Missing: ${k}`); ok = false; } if (ok) { const e0 = 8.854e-12; const plot = (r, i) => {/* Plot Update */ const w = plotEls.plotArea.clientWidth, h = plotEls.plotArea.clientHeight; if (w <= 0 || h <= 0) return; const maxR = 100, maxI = 20; let cR = Math.max(0, Math.min(maxR, r)), cI = Math.max(0, Math.min(maxI, i)); let xP = (cR / maxR) * 100, yP = (cI / maxI) * 100; xP = Math.max(0, Math.min(100, xP)); yP = Math.max(0, Math.min(100, yP)); plotEls.plotPoint.style.left = `${xP}%`; plotEls.plotPoint.style.bottom = `${yP}%`; plotEls.plotPoint.title = `εc/ε₀ ≈ ${cR.toFixed(2)} + ${cI.toFixed(4)}j`; const thr = 0.98; plotEls.plotPoint.classList.toggle('at-max-real', cR >= maxR * thr); plotEls.plotPoint.classList.toggle('at-max-imag', cI >= maxI * thr); plotEls.plotPoint.classList.toggle('at-origin', cR < 0.01 * maxR && cI < 0.01 * maxI); }; const update = () => {/* Calculation */ const er = parseFloat(inputs.epsRInput.value), s = parseFloat(inputs.sigmaInput.value), fGHz = parseFloat(inputs.freqInput.value), fHz = fGHz * 1e9; outputs.epsRValueSpan.textContent = er.toFixed(1); outputs.sigmaValueSpan.textContent = s.toFixed(2); outputs.freqValueSpan.textContent = fGHz.toFixed(1); outputs.freqGhzDisplaySpan.textContent = fGHz.toFixed(1); let w, epr, edpr, ecrr, ecri, wT, epT, edpT, ecrT, intT, sp = true; if (fHz <= 0) { w = 0; epr = er; edpr = Infinity; ecrr = er; ecri = Infinity; wT = "N/A"; epT = epr.toFixed(3); edpT = "Infinity"; ecrT = `${ecrr.toFixed(3)} + ∞ j`; intT = "Freq > 0 needed."; sp = false; } else { w = 2 * Math.PI * fHz; epr = er; edpr = s / (w * e0); ecrr = epr; ecri = edpr; wT = w.toExponential(3); epT = epr.toFixed(3); edpT = edpr.toFixed(4); ecrT = `${ecrr.toFixed(3)} + ${ecri.toFixed(4)}j`; const lt = (epr > 1e-9) ? (edpr / epr) : Infinity; if (lt > 10) intT = "Strongly Lossy: \\( \\tan \\delta \\gg 1 \\)"; else if (lt < 0.01) intT = "Very Low Loss: \\( \\tan \\delta \\ll 1 \\)"; else if (lt < 0.1) intT = "Low Loss: \\( \\tan \\delta < 0.1 \\)"; else if (lt > 1) intT = "Lossy Dielectric: \\( \\tan \\delta > 1 \\)"; else intT = "Moderate Loss: \\( \\tan \\delta \\approx 1 \\)"; } outputs.omegaValueSpan.textContent = wT; outputs.epsPrimeRelSpan.textContent = epT; outputs.epsDoublePrimeRelSpan.textContent = edpT; outputs.epsCRelSpan.textContent = ecrT; outputs.interpSpan.innerHTML = intT; plotEls.plotPoint.style.display = sp ? 'block' : 'none'; if (sp) plot(ecrr, ecri); if (window.MathJax?.typesetPromise) MathJax.typesetPromise([outputDiv]).catch(err => console.error('MathJax error:', err)); }; Object.values(inputs).forEach(i => i.addEventListener('input', update)); update(); } else { explorerSection.style.opacity = '0.5'; }
  } else { console.warn("#complex-epsilon-explorer not found."); }


  // --- Quiz Logic (Keep As Is) ---
  const quizForm = document.getElementById('quiz-form');
  if (quizForm) { /* ... Full Quiz setup and logic as previously provided ... */
    const resultsDiv = document.getElementById('quiz-overall-results'), scoreSpan = document.getElementById('quiz-score'), totalSpan = document.getElementById('quiz-total'), retryBtn = document.getElementById('quiz-retry-btn'); if (resultsDiv && scoreSpan && totalSpan && retryBtn) { console.log("Setting up Quiz."); const qs = quizForm.querySelectorAll('.quiz-question'), submitBtn = quizForm.querySelector('.quiz-submit-btn'); const ans = { q1: 'divergence', q2: '-iomega', q3: 'add' }; const calcQ4 = () => { const s = 0.02, f = 4e9, o = 2 * Math.PI * f, e0 = 8.854e-12; return s / (o * e0); }; const q4Ans = calcQ4(), q4Tol = 0.15; const fb = (div, ok, msg) => { if (!div) return; div.innerHTML = msg; div.className = 'feedback'; div.classList.add(ok ? 'correct' : 'incorrect'); div.style.display = 'block'; if (window.MathJax?.typesetPromise && msg.includes('\\(')) { MathJax.typesetPromise([div]).catch(err => console.error('MathJax err:', err)); } }; const chk = () => { let score = 0; const total = qs.length; if (total === 0) return; qs.forEach((q, i) => { const qN = i + 1, qK = `q${qN}`, fbD = q.querySelector('.feedback'); if (fbD) { fbD.innerHTML = ''; fbD.style.display = 'none'; } let ok = false, msg = '', answd = false; try { if (qN <= 3) { const sel = quizForm.querySelector(`input[name="${qK}"]:checked`); if (sel) { answd = true; ok = (sel.value === ans[qK]); if (ok) { score++; msg = `Correct!`; } else { msg = `Not quite. Review the definitions.`; } } else { msg = "⚠️ Please select an answer."; } } else if (qN === 4) { const inp = quizForm.querySelector(`input[name="${qK}"]`); if (inp && inp.value.trim() !== "") { answd = true; const uA = parseFloat(inp.value); const lb = q4Ans * (1 - q4Tol), ub = q4Ans * (1 + q4Tol); if (!isNaN(uA)) { ok = (uA >= lb && uA <= ub); if (ok) { score++; msg = `Correct! \\( ≈${q4Ans.toFixed(4)} \\).`; } else { msg = `Incorrect. Calculated \( ≈ ${q4Ans.toFixed(4)} \\).`; } } else { msg = `⚠️ Please enter a valid number.`; answd = false; } } else { msg = `⚠️ Please enter a value.`; } } if (answd || msg.startsWith('⚠️')) fb(fbD, ok, msg); q.classList.remove('correct-answer', 'incorrect-answer', 'unanswered'); if (answd) q.classList.add(ok ? 'correct-answer' : 'incorrect-answer'); else q.classList.add('unanswered'); q.querySelectorAll('input').forEach(inp => inp.disabled = true); } catch (err) { console.error(`Q${qN} err:`, err); if (fbD) fb(fbD, false, "Error checking."); q.classList.add('incorrect-answer'); q.querySelectorAll('input').forEach(inp => inp.disabled = true); } }); scoreSpan.textContent = score; totalSpan.textContent = total; resultsDiv.className = 'output-box quiz-results'; resultsDiv.classList.add(score === total ? 'all-correct' : 'some-incorrect'); resultsDiv.style.display = 'block'; if (submitBtn) submitBtn.disabled = true; retryBtn.disabled = false; retryBtn.style.display = 'inline-block'; resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }; const rst = () => { console.log("Reset quiz."); quizForm.reset(); qs.forEach(q => { const fbD = q.querySelector('.feedback'); if (fbD) { fbD.innerHTML = ''; fbD.style.display = 'none'; } q.classList.remove('correct-answer', 'incorrect-answer', 'unanswered'); q.querySelectorAll('input').forEach(inp => inp.disabled = false); }); resultsDiv.style.display = 'none'; resultsDiv.className = 'output-box quiz-results'; if (submitBtn) submitBtn.disabled = false; retryBtn.disabled = true; retryBtn.style.display = 'none'; }; quizForm.addEventListener('submit', (e) => { e.preventDefault(); chk(); }); retryBtn.addEventListener('click', rst); retryBtn.disabled = true; retryBtn.style.display = 'none'; } else { console.warn("Quiz results/button elements missing."); }
  } else { console.warn("Quiz form (#quiz-form) not found."); }


  // === Replace existing p5 Management & Scrollspy in script.js ===

  // ==================================================================== //
  // == TASK 8/9: p5 Sketch Management & Integrated Scroll Activation == //
  // ==================================================================== //
  const contentSections = document.querySelectorAll('section[data-section-id][data-animation-container-id]');
  const animationWrapper = document.querySelector('.animation-container-wrapper');
  const p5Containers = animationWrapper ? animationWrapper.querySelectorAll('.animation-container[id^="p5-canvas-"]') : [];
  const activeSketches = {}; // Store { containerId: p5Instance }
  let currentActiveSketchId = null; // Track which sketch *should* be visible

  // --- Mapping from Container ID to Sketch Function ---
  const sketchMap = {
    "p5-canvas-intro": typeof introSketch !== 'undefined' ? introSketch : null,
    "p5-canvas-foundation": typeof foundationSketch !== 'undefined' ? foundationSketch : null,
    "p5-canvas-bridging": typeof bridgingSketch !== 'undefined' ? bridgingSketch : null,
    "p5-canvas-phasor": typeof phasorSketch !== 'undefined' ? phasorSketch : null,
    "p5-canvas-materials": typeof materialsSketch !== 'undefined' ? materialsSketch : null,
    "p5-canvas-complex-epsilon": typeof complexEpsilonSketch !== 'undefined' ? complexEpsilonSketch : null,
  };

  // Function to Activate/Deactivate Sketch Containers visually
  const activateSketchContainer = (containerId) => {
    if (currentActiveSketchId === containerId) return; // Already active

    console.log(`Activating sketch container: ${containerId}`);
    p5Containers.forEach(container => {
      const isActive = container.id === containerId;
      container.classList.toggle('active-sketch', isActive);

      // Also Pause/Resume p5 instance
      const p5Instance = activeSketches[container.id];
      if (p5Instance) {
        if (isActive && typeof p5Instance.loop === 'function') {
          console.log(`-> Resuming P5 loop for ${container.id}`);
          p5Instance.loop();
        } else if (!isActive && typeof p5Instance.noLoop === 'function') {
          console.log(`-> Pausing P5 loop for ${container.id}`);
          p5Instance.noLoop();
        }
      }
    });
    currentActiveSketchId = containerId;
  };

  // --- Intersection Observer for Content Sections ---
  if (contentSections.length > 0 && animationWrapper && "IntersectionObserver" in window) {
    console.log(`Setting up Section Observer for ${contentSections.length} sections.`);

    const sectionObserver = new IntersectionObserver((entries) => {
      let bestVisibleSectionId = null;
      let maxRatio = -1; // Track maximum visibility ratio

      entries.forEach(entry => {
        // Update: Choose based on highest intersection ratio among *currently intersecting* elements
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          bestVisibleSectionId = entry.target.dataset.sectionId;
        }
      });

      // If a "best" visible section is found, activate its corresponding sketch
      if (bestVisibleSectionId) {
        const sectionElement = document.getElementById(bestVisibleSectionId) || document.querySelector(`[data-section-id='${bestVisibleSectionId}']`);
        const targetContainerId = sectionElement?.dataset.animationContainerId;

        if (targetContainerId && currentActiveSketchId !== targetContainerId) {
          const sketchFunction = sketchMap[targetContainerId];
          if (sketchFunction && !activeSketches[targetContainerId]) {
            // Instantiate sketch if it doesn't exist yet
            console.log(`Instantiating p5 sketch for newly visible section: ${targetContainerId}`);
            try { activeSketches[targetContainerId] = new p5(sketchFunction, targetContainerId); }
            catch (error) { console.error(`Error creating p5 instance for ${targetContainerId}:`, error); let targetEl = document.getElementById(targetContainerId); if (targetEl) targetEl.innerHTML = `<p class="text-muted error">Error loading.</p>`; }
          }
          // Activate the container (makes it visible, resumes loop)
          activateSketchContainer(targetContainerId);
        } else if (!targetContainerId) {
          // If section has no animation, maybe hide all? Or keep last active? Deactivate all.
          // console.log(`Section ${bestVisibleSectionId} has no animation, hiding all.`);
          // activateSketchContainer(null); // Hide all animations
        }
      } else {
        // No specific section is deemed "most visible", maybe scrolled past all?
        // Optional: Deactivate all sketches if user scrolls far away?
        // activateSketchContainer(null);
      }

    }, {
      root: null,
      // rootMargin: "-40% 0px -50% 0px", // Trigger when section top enters middle-ish zone? Adjust!
      threshold: [0.1, 0.5, 0.9] // Trigger at multiple visibility levels
    });

    contentSections.forEach(section => {
      sectionObserver.observe(section);
    });

  } else {
    console.warn("Section observer/p5 activation setup skipped (missing elements or IntersectionObserver).");
    // Fallback: Maybe just load and show the first sketch?
    if (p5Containers.length > 0) {
      const firstContainerId = p5Containers[0].id;
      const firstSketchFunc = sketchMap[firstContainerId];
      if (firstSketchFunc && !activeSketches[firstContainerId]) {
        try { activeSketches[firstContainerId] = new p5(firstSketchFunc, firstContainerId); } catch (e) { }
      }
      p5Containers[0].classList.add('active-sketch'); // Manually activate first one
    }
  }

  // --- Scroll Spy for Nav (Keep existing or refine) ---
  // Keep the refined scroll spy logic from previous step
  const navLinks = document.querySelectorAll('.scroll-spy-nav a');
  const sectionsForNav = document.querySelectorAll('section[data-section-id]'); // Use same sections
  if (navLinks.length > 0 && sectionsForNav.length > 0 && "IntersectionObserver" in window) {
    const navLinkMap = {}; navLinks.forEach(l => { if (l.getAttribute('href')?.startsWith('#')) navLinkMap[l.getAttribute('href').substring(1)] = l; }); const spyObs = new IntersectionObserver((e) => { let visId = null; let maxR = 0; e.forEach(entry => { if (entry.intersectionRatio > maxR) { maxR = entry.intersectionRatio; visId = entry.target.dataset.sectionId; } }); navLinks.forEach(l => l.classList.remove('active')); if (visId) { const aL = navLinkMap[visId]; if (aL) aL.classList.add('active');/*aL.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'});*/ } }, { root: null, threshold: Array.from(Array(11).keys(), x => x * 0.1) }); sectionsForNav.forEach(s => spyObs.observe(s));
  } else { console.warn("Scroll Spy setup skipped."); }


  // --- Card Animations (Keep previous simple version) ---
  document.querySelectorAll('.content-card.animated').forEach(el => {
    el.style.opacity = 1; // Ensure visibility
    el.style.transform = 'none'; // Reset transform if any
    // You can re-enable observer later if needed
    // el.style.animationPlayState = 'running';
  });


  console.log("Maxwell App Script Initialization Complete.");
  // --- End of DOMContentLoaded listener ---
});
