// Contents menu shared by every deck page.
// Each page sets <body data-deck="dfy|dwy">; slides are the .slide sections, labelled by data-title.
(function () {
  var DECKS = [
    { id: 'dfy', label: 'DFY', href: 'index.html' },
    { id: 'dwy', label: 'DWY', href: 'dwy.html' }
  ];
  var deck = document.body.dataset.deck || 'dfy';
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'toc-btn';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'toc');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>Contents';

  var panel = document.createElement('nav');
  panel.id = 'toc';
  panel.className = 'toc';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Contents');

  var sw = '<div class="toc-switch">' + DECKS.map(function (d) {
    return '<a href="' + d.href + '"' + (d.id === deck ? ' aria-current="page"' : '') + '>' + d.label + '</a>';
  }).join('') + '</div>';
  var list = slides.map(function (sl, i) {
    return '<li><button type="button" data-i="' + i + '"><span class="n">' + String(i + 1).padStart(2, '0') + '</span>' + (sl.dataset.title || 'Slide ' + (i + 1)) + '</button></li>';
  }).join('');
  panel.innerHTML = sw + '<div class="toc-head">' + slides.length + ' slides</div><ul class="toc-list">' + list + '</ul>';

  document.body.appendChild(panel);
  document.body.appendChild(btn);

  function open(v) {
    panel.hidden = !v;
    btn.setAttribute('aria-expanded', String(v));
    if (v) mark();
  }
  btn.addEventListener('click', function (e) { e.stopPropagation(); open(panel.hidden); });
  panel.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-i]');
    if (!b) return;
    var sl = slides[+b.dataset.i];
    var header = document.querySelector('.topbar');
    var top = sl.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0);
    window.scrollTo({ top: top, behavior: 'smooth' });
    open(false);
  });
  document.addEventListener('click', function (e) {
    if (!panel.hidden && !panel.contains(e.target)) open(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });

  // Highlight the slide currently on screen
  function mark() {
    var mid = window.innerHeight / 2, cur = 0;
    slides.forEach(function (sl, i) { if (sl.getBoundingClientRect().top <= mid) cur = i; });
    panel.querySelectorAll('.toc-list button').forEach(function (b, i) { b.classList.toggle('on', i === cur); });
  }
  window.addEventListener('scroll', function () { if (!panel.hidden) mark(); }, { passive: true });
})();
