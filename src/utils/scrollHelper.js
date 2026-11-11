/**
 * Universal smooth scroll handler that works seamlessly with GSAP ScrollTrigger pinning.
 * Uses requestAnimationFrame interpolation to avoid CSS smooth scroll conflicts
 * and lands accurately at section boundaries.
 */
let activeScrollAnim = null;

export function smoothScrollTo(targetId, userDuration) {
  if (activeScrollAnim) {
    cancelAnimationFrame(activeScrollAnim);
    activeScrollAnim = null;
  }

  let targetY = 0;

  if (targetId && targetId !== 'hero' && targetId !== '#hero') {
    const cleanId = targetId.replace(/^#/, '');
    const el = document.getElementById(cleanId);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    targetY = Math.max(0, Math.round(rect.top + window.scrollY - 68));
  }

  const startY = window.scrollY;
  const diff = targetY - startY;
  if (Math.abs(diff) < 2) return;

  const duration = userDuration || Math.min(650, Math.max(300, Math.abs(diff) * 0.18));
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    // Smooth easeInOutCubic
    const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    window.scrollTo(0, startY + diff * ease);

    if (progress < 1) {
      activeScrollAnim = requestAnimationFrame(step);
    } else {
      window.scrollTo(0, targetY);
      activeScrollAnim = null;
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }
  }

  activeScrollAnim = requestAnimationFrame(step);
}

if (typeof window !== 'undefined') {
  window.smoothScrollTo = smoothScrollTo;
}
