/* Apis motion — reveal on scroll, staggered entrances, theme switch with a circular reveal.
   Load it in <head> (not deferred) so .ap-motion is set before the first paint:
   <script src="apis-motion.js"></script>
   Without this script, or with reduced motion, every element is simply visible. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) root.classList.add('ap-motion');

  /* Give each [data-ap-reveal] a stagger index among its siblings (max 5 steps), unless it sets --ap-i itself. */
  function index(scope) {
    var counts = new Map();
    scope.querySelectorAll('[data-ap-reveal]').forEach(function (el) {
      var n = counts.get(el.parentElement) || 0;
      if (!el.style.getPropertyValue('--ap-i')) el.style.setProperty('--ap-i', Math.min(n, 4));
      counts.set(el.parentElement, n + 1);
    });
  }

  function reveal(scope) {
    scope = scope || document;
    var els = scope.querySelectorAll('[data-ap-reveal]:not(.is-in)');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    index(scope);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        en.target.dispatchEvent(new CustomEvent('ap:reveal', { bubbles: true }));
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* Switch light/dark from a button; remembers the choice under options.storageKey (default "theme"). */
  function toggleTheme(button, options) {
    var key = (options && options.storageKey) || 'theme';
    var current = root.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = current === 'dark' ? 'light' : 'dark';
    var apply = function () { root.dataset.theme = next; try { localStorage.setItem(key, next); } catch (e) {} };
    if (button) {
      var b = button.getBoundingClientRect();
      root.style.setProperty('--ap-vx', (b.left + b.width / 2) + 'px');
      root.style.setProperty('--ap-vy', (b.top + b.height / 2) + 'px');
    }
    if (document.startViewTransition && !reduce) document.startViewTransition(apply); else apply();
    return next;
  }

  /* Restore a remembered theme as early as possible. */
  try { var saved = localStorage.getItem('theme'); if (saved && !root.dataset.theme) root.dataset.theme = saved; } catch (e) {}

  window.Apis = window.Apis || {};
  window.Apis.motion = { reveal: reveal, toggleTheme: toggleTheme, reduced: !!reduce };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { reveal(); });
  else reveal();
})();
