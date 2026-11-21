// The RingsPy card: the animation plays only while it is on screen (and not at
// all for visitors who ask for reduced motion), the install commands copy, and
// the figures open full size in a dialog.
export function initSoftware({ reduced }) {
  const video = document.querySelector('[data-soft-video]');
  const toggle = document.querySelector('[data-soft-play]');
  if (video) {
    let paused = reduced;
    const sync = (visible) => {
      if (visible && !paused) video.play().catch(() => {});
      else video.pause();
    };
    const setLabel = () => {
      toggle.textContent = paused ? 'Play' : 'Pause';
      toggle.setAttribute('aria-label', paused ? 'Play the animation' : 'Pause the animation');
    };
    let visible = false;
    if (toggle) {
      toggle.hidden = false;
      setLabel();
      toggle.addEventListener('click', () => {
        paused = !paused;
        if (!paused) video.preload = 'auto';
        setLabel();
        sync(visible || !paused);
      });
    }
    new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !paused) video.preload = 'auto';
        sync(visible);
      },
      { rootMargin: '200px 0px', threshold: 0.01 },
    ).observe(video);
  }

  for (const btn of document.querySelectorAll('[data-copy-cmd]')) {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copyCmd);
        btn.textContent = 'Copied';
      } catch {
        btn.textContent = 'Select and copy';
      }
      setTimeout(() => (btn.textContent = 'Copy'), 2200);
    });
  }

  const dialog = document.querySelector('[data-zoom-dialog]');
  if (dialog && typeof dialog.showModal === 'function') {
    const img = dialog.querySelector('img');
    for (const a of document.querySelectorAll('[data-zoom]')) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const thumb = a.querySelector('img');
        img.src = a.getAttribute('href');
        img.alt = thumb?.alt || '';
        dialog.classList.toggle('zoom--light', !!a.closest('.soft__fig--light'));
        dialog.showModal();
      });
    }
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  }
}
