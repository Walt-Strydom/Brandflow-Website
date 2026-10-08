/* Motion is optional, stops offscreen, and never overrides the OS preference. */
(() => {
  const scenes = [...document.querySelectorAll('[data-art]')];
  if (!scenes.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const precisePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const preferenceKey = 'brandflow-illustration-motion-paused';
  let paused = false;
  try { paused = localStorage.getItem(preferenceKey) === 'true'; } catch { /* Storage is optional. */ }
  const visible = new WeakMap(scenes.map(scene => [scene, true]));
  const resetTilt = scene => { scene.style.removeProperty('--art-rx'); scene.style.removeProperty('--art-ry'); };
  function sync() {
    scenes.forEach(scene => {
      const stopped = paused || reduced.matches;
      scene.dataset.motion = !stopped && !document.hidden && visible.get(scene) ? 'running' : 'paused';
      const button = scene.querySelector('.bf-motion-toggle');
      if (button) {
        button.hidden = false;
        button.disabled = reduced.matches;
        button.textContent = reduced.matches ? 'Reduced motion' : paused ? 'Play motion' : 'Pause motion';
        button.setAttribute('aria-label', reduced.matches ? 'Illustration motion disabled by system preference' : paused ? 'Play illustration animation' : 'Pause illustration animation');
        button.setAttribute('aria-pressed', String(stopped));
      }
      if (scene.dataset.motion === 'paused') resetTilt(scene);
    });
  }
  scenes.forEach(scene => {
    scene.querySelector('.bf-motion-toggle')?.addEventListener('click', () => {
      paused = !paused;
      try { localStorage.setItem(preferenceKey, String(paused)); } catch { /* In-memory choice still works. */ }
      sync();
    });
    let frame = 0;
    scene.addEventListener('pointermove', event => {
      if (frame || scene.dataset.motion !== 'running' || !precisePointer.matches || event.pointerType !== 'mouse') return;
      const x = event.clientX, y = event.clientY;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (scene.dataset.motion !== 'running') return;
        const box = scene.getBoundingClientRect();
        scene.style.setProperty('--art-rx', `${Math.max(-3, Math.min(3, (0.5 - (y - box.top) / box.height) * 6))}deg`);
        scene.style.setProperty('--art-ry', `${Math.max(-4, Math.min(4, ((x - box.left) / box.width - 0.5) * 8))}deg`);
      });
    });
    scene.addEventListener('pointerleave', () => { cancelAnimationFrame(frame); frame = 0; resetTilt(scene); });
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => visible.set(entry.target, entry.isIntersecting));
      sync();
    }, { threshold: 0.05 });
    scenes.forEach(scene => observer.observe(scene));
  }
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
})();
