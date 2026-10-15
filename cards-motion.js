/* เผยการ์ดสินค้าตอนเลื่อนถึง (IntersectionObserver, ไม่ดัก scroll) — รองรับตอนสลับหมวดที่ render การ์ดใหม่ */
(function () {
  'use strict';
  var grid = document.getElementById('grid');
  if (!grid || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('js-cards');

  var io = new IntersectionObserver(function (entries) {
    entries.filter(function (e) { return e.isIntersecting; })
      .sort(function (a, b) {
        var A = a.boundingClientRect, B = b.boundingClientRect;
        return (A.top - B.top) || (A.left - B.left);
      })
      .forEach(function (e, i) {
        e.target.style.setProperty('--d', Math.min(i, 7) * 80 + 'ms');
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  function watch() { grid.querySelectorAll('.pc:not(.is-in)').forEach(function (c) { io.observe(c); }); }
  new MutationObserver(watch).observe(grid, { childList: true });
  watch();
})();
