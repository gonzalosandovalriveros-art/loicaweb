// Animaciones de la web de Loica Comunicaciones.
// Si el visitante pidió reducir el movimiento (o el navegador no soporta lo necesario),
// este archivo no hace nada y la página se ve completa y estática.
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('js') || !('IntersectionObserver' in window)) { root.classList.remove('js'); return; }

  function $(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

  // 1. Divide los títulos en palabras para animarlas una a una
  function split(el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (w, i) {
      var o = document.createElement('span'); o.className = 'w';
      var n = document.createElement('span'); n.textContent = w; n.style.setProperty('--i', i);
      o.appendChild(n); el.appendChild(o);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }
  var h1 = document.querySelector('.hero h1'); if (h1) split(h1);
  var h2s = $('main section:not(.hero) h2');
  h2s.forEach(function (h) { split(h); h.classList.add('split'); });

  // 2. Entrada del hero (espera a que carguen las fuentes)
  var started = false;
  function go() { if (started) return; started = true; root.classList.add('go'); }
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function () { setTimeout(go, 60); }); }
  setTimeout(go, 900);

  // 3. Elementos que aparecen al hacer scroll
  var targets = [];
  function mark(el) { el.classList.add('reveal'); targets.push(el); }
  ['.lista li', '.serv article', '.pasos li', '.exp > div', '.porque li',
   '.sect .sectores', '.sect p:not(.sectores)', '.cierre', '.sobre .foto',
   '.sobre .wrap > div:last-child > p', '.final p', '.final .btn'].forEach(function (s) { $(s).forEach(mark); });

  var obs = new IntersectionObserver(function (entries) {
    var vis = entries.filter(function (e) { return e.isIntersecting; });
    vis.forEach(function (e, i) {
      var el = e.target, delay = i * 0.09;
      el.style.setProperty('--d', delay + 's');
      el.classList.add('visible');
      obs.unobserve(el);
      if (el.matches && el.matches('.final .btn')) setTimeout(function () { el.classList.add('pulse'); }, 1600);
      setTimeout(function () { el.classList.add('done'); }, delay * 1000 + 1500);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  targets.concat(h2s).forEach(function (el) { obs.observe(el); });

  // 4. Barra de progreso, encabezado y movimiento suave con el scroll
  var header = document.querySelector('header'), bar = document.querySelector('.progress');
  var foto = document.querySelector('.hero .foto'), orb = document.querySelector('.hero-orb'), ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var y = window.pageYOffset || 0, max = root.scrollHeight - window.innerHeight;
      if (header) header.classList.toggle('scrolled', y > 40);
      if (bar && max > 0) bar.style.transform = 'scaleX(' + Math.min(y / max, 1) + ')';
      if (y < window.innerHeight * 1.3) {
        if (foto) foto.style.setProperty('--py', (-y * 0.07) + 'px');
        if (orb) orb.style.setProperty('--oy', (y * 0.18) + 'px');
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
