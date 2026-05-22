export function initRevealOnScroll() {
  const revealItems = document.querySelectorAll('.reveal');

  if (!revealItems.length) {
    return () => {};
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: '0px 0px -4% 0px',
      threshold: 0.12,
    },
  );

  revealItems.forEach((item) => observer.observe(item));

  return () => observer.disconnect();
}
