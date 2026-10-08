(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Menu móvel
  const btn = $('#menuBtn'), menu = $('#menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', e => e.target.closest('a') && setMenu(false));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  // Secção ativa na navegação
  const links = $$('#menu a:not(.cta)');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => io.observe(s));

  // Fluxo ponta a ponta: acende cada camada em sequência
  const steps = $$('#flow li');
  let timers = [];
  const play = () => {
    timers.forEach(clearTimeout); timers = [];
    steps.forEach(s => s.classList.remove('hit'));
    steps.forEach((s, i) => timers.push(setTimeout(() => s.classList.add('hit'), reduce ? 0 : 450 * (i + 1))));
  };
  play();
  $('#replay').addEventListener('click', play);

  $('#year').textContent = new Date().getFullYear();
})();
