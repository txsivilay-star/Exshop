/* Scroll-reveal for the product page: IntersectionObserver + CSS transform/opacity (no scroll handlers, no layout shift). */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;   /* fallback: original load animation */
  var root = document.documentElement; root.classList.add('js-rv');

  function countUp(el) {
    var txt = el.textContent, n = parseInt(txt.replace(/\D/g, ''), 10);
    if (!n || n < 20) return;
    var t0 = performance.now(), dur = 1100, fmt = new Intl.NumberFormat('en-US');
    (function tick(t) {
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = p < 1 ? fmt.format(Math.round(n * e)) : txt;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.filter(function (e) { return e.isIntersecting; })
      .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; })
      .forEach(function (e, i) {
        var el = e.target;
        el.style.setProperty('--d', i * 80 + 'ms');
        el.classList.add('is-in'); io.unobserve(el);
        if (el.classList.contains('pd-card--det')) el.querySelectorAll('.pd-ul li').forEach(function (li) { li.classList.add('is-in'); li.style.setProperty('--d', i * 80 + 150 + 'ms'); });
        if (el.classList.contains('pd-sold')) { var s = el.querySelector('#sold'); if (s) countUp(s); }
      });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  document.querySelectorAll('.pd-in').forEach(function (el) { io.observe(el); });
})();
