document.addEventListener('DOMContentLoaded', () => {

  /* ── AI Process Modal ─────────────────────────────────── */
  const trigger  = document.getElementById('open-ai-modal-btn');
  const modal    = document.getElementById('ai-process-modal');
  const closeBtn = document.querySelector('.modal-close-btn');

  if (trigger && modal && closeBtn) {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = 'auto';
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  /* ── My Works: Tab switching + Carousel ───────────────── */
  const tabs   = document.querySelectorAll('.works-tab');
  const panels = document.querySelectorAll('.works-panel');

  // Current slide index per category
  const state = { uiux: 0, others: 0 };

  // Auto-advance interval handles per category
  const timers = { uiux: null, others: null };

  const AUTOPLAY_DELAY = 1500; // ms

  /** Force restart the CSS progress animation on the active dot */
  function restartDotAnimation(category) {
    const activeDot = document.querySelector(`#dots-${category} .works-dot.active`);
    if (!activeDot) return;
    // Reflow trick: remove & re-add to restart @keyframes
    activeDot.style.animation = 'none';
    // eslint-disable-next-line no-unused-expressions
    activeDot.offsetWidth; // trigger reflow
    activeDot.style.animation = '';
  }

  /** Build dot buttons for a carousel */
  function buildDots(category) {
    const dotsContainer = document.getElementById(`dots-${category}`);
    const slides = document.querySelectorAll(`#carousel-${category} .works-slide`);
    if (!dotsContainer || slides.length === 0) return;

    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'works-dot' + (idx === state[category] ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(category, idx);
        resetTimer(category); // restart timer on manual nav
      });
      dotsContainer.appendChild(dot);
    });
  }

  /** Navigate to a specific slide */
  function goToSlide(category, targetIdx) {
    const slides = document.querySelectorAll(`#carousel-${category} .works-slide`);
    const dots   = document.querySelectorAll(`#dots-${category} .works-dot`);

    slides.forEach((s, i) => s.classList.toggle('active', i === targetIdx));
    dots.forEach((d, i)   => d.classList.toggle('active', i === targetIdx));
    state[category] = targetIdx;

    // Restart progress bar animation on new active dot
    restartDotAnimation(category);
  }

  /** Advance to next slide, wrapping around */
  function advance(category) {
    const total = document.querySelectorAll(`#carousel-${category} .works-slide`).length;
    goToSlide(category, (state[category] + 1) % total);
  }

  /** Start (or restart) the auto-advance timer */
  function resetTimer(category) {
    if (timers[category]) clearInterval(timers[category]);
    timers[category] = setInterval(() => advance(category), AUTOPLAY_DELAY);
  }

  /** Pause auto-advance (on hover or hidden panel) */
  function pauseTimer(category) {
    if (timers[category]) {
      clearInterval(timers[category]);
      timers[category] = null;
    }
  }

  // Wire up the next buttons
  ['uiux', 'others'].forEach(cat => {
    const nextBtn = document.getElementById(`next-${cat}`);
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        advance(cat);
        resetTimer(cat);
      });
    }

    // Pause on hover over the whole panel
    const panel = document.getElementById(`panel-${cat}`);
    if (panel) {
      panel.addEventListener('mouseenter', () => pauseTimer(cat));
      panel.addEventListener('mouseleave', () => resetTimer(cat));
    }
  });

  // Tab click handler
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(p => p.classList.remove('active'));
      document.getElementById(`panel-${category}`).classList.add('active');

      // Restart timer for newly shown category
      resetTimer(category);
      // Pause the other
      const other = category === 'uiux' ? 'others' : 'uiux';
      pauseTimer(other);
    });
  });

  // Keyboard arrow navigation
  document.addEventListener('keydown', (e) => {
    const activePanel = document.querySelector('.works-panel.active');
    if (!activePanel) return;
    const category = activePanel.id.replace('panel-', '');
    const total    = document.querySelectorAll(`#carousel-${category} .works-slide`).length;

    if (e.key === 'ArrowRight') {
      goToSlide(category, (state[category] + 1) % total);
      resetTimer(category);
    } else if (e.key === 'ArrowLeft') {
      goToSlide(category, (state[category] - 1 + total) % total);
      resetTimer(category);
    }
  });

  // Init: build dots, activate first slides, start timers
  ['uiux', 'others'].forEach(cat => {
    buildDots(cat);
    goToSlide(cat, 0);
  });

  // Only auto-advance the active panel initially (uiux)
  resetTimer('uiux');

});
