(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------- Theme toggle ---------- */
  document.getElementById('theme').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---------- Statement: words light up ---------- */
  var st = document.querySelector('[data-words]');
  var words = [];
  function splitWords(text) {
    words = [];
    st.textContent = '';
    text.trim().split(/\s+/).forEach(function (t) {
      var s = document.createElement('span');
      s.className = 'w';
      s.textContent = t;
      st.appendChild(s);
      st.appendChild(document.createTextNode(' '));
      words.push(s);
    });
    if (reduce) words.forEach(function (s) { s.style.opacity = 1; });
  }

  /* ---------- i18n (ES / EN) ---------- */
  var EN = {
    'avail': 'Available for new challenges',
    'eyebrow': 'Systems and backend engineer',
    'h1': 'Solid backend for financial and payment systems.',
    'lead': "I'm Edson Mamani. For 6+ years I've been building microservices with Java and Spring Boot, from idea to production.",
    'cta.wa': "Let's talk on WhatsApp",
    'cta.projects': 'View projects',
    'statement': 'I design and build systems where every transaction counts: QR payments, anti-money-laundering and digital banking, with clean architecture and idempotency.',
    'stat1': 'years building software',
    'stat2': 'in transactions during the first month of the QR payments middleware',
    'stat3': 'companies, from banking to fintech',
    'proj.title': 'Featured projects',
    'proj.sub': 'What I built and shipped to production at Zensy and Banco Ganadero.',
    'p1.t': 'QR bank-transfer payment gateway',
    'p1.d': "I led the development of a middleware that handles the company's transactional operations. It moved close to USD 2 million during its first month in production.",
    'p1.k': 'idempotency',
    'p2.t': 'KYC onboarding with WhatsApp',
    'p2.d': 'I implemented a new KYC process for customer registration: migrated the integration between providers and built a landing page connected to WhatsApp that automates the flow.',
    'p2.k': 'Integrations, WhatsApp, automation',
    'p3.t': 'Anti-Money Laundering',
    'p3.d': "A middleware that periodically validates customers against an external service and syncs the results with the bank's internal systems, strengthening compliance and risk management.",
    'p3.k': 'Java, Spring Batch, AML compliance',
    'p4.t': 'Banking app redesign',
    'p4.d': 'I led the redesign and helped define the architecture. Delivered scheduled transfers, cardless withdrawals, statement lookup and mobile top-ups.',
    'p4.k': 'Architecture, mobile, digital banking',
    'oss.title': 'Open source and in progress',
    'oss.sub': 'Personal projects where I practice architecture outside of work.',
    'oss.repo': 'View repository',
    'o1.d': 'Modular ERP with product, customer and order domains.',
    'o2.d': 'Point-of-sale system organized by layers and unit of work.',
    'o3.m': 'In progress',
    'o3.d': 'Modeling of organizations, roles, permissions and insurance operations.',
    'o3.g': 'Private case',
    'exp.title': 'Experience',
    'j1.w': 'Jun 2025 – Jun 2026', 'j1.r': 'Backend Engineer',
    'j1.d': 'QR payments middleware in Java and Spring Boot, a new KYC onboarding process, and upkeep of transfer, payment and movement workflows with idempotency to guarantee consistency.',
    'j2.w': 'May 2022 – Jun 2025', 'j2.r': 'Software Developer',
    'j2.d': "AML middleware with Java and Spring Batch, redesign of the banking app including its architecture, and CI/CD pipelines with Azure DevOps, Docker and Jenkins that cut deployment times.",
    'j3.w': 'Aug 2021 – Apr 2022', 'j3.r': 'Software Developer',
    'j3.d': 'Reusable component to store and manage data shared between platform modules, built with Angular and Spring Boot.',
    'j4.w': 'Apr 2020 – Jul 2021', 'j4.r': 'Full Stack Developer',
    'j4.d': 'Web and mobile frontends with React.js and React Native for health, mobility and e-commerce: ambulance tracking, parking management, motorcycle-taxi orders and online sales.',
    'j5.w': 'Mar 2019 – Mar 2020', 'j5.r': 'Software Developer',
    'j5.d': 'SQL Server reports and queries with BIRT templates for an ERP, REST service integration and customer support.',
    'stack.title': 'Tech stack',
    's1': 'Languages',
    's3': 'Architecture', 's3a': 'Microservices', 's3b': 'Hexagonal architecture', 's3c': 'REST APIs',
    's4': 'Databases',
    's5': 'DevOps and tools',
    's6': 'Mobile and frontend',
    'edu.title': 'Education',
    'edu.sub1': 'Studies',
    'e1.t': 'Postgraduate Diploma in Microservices Architecture',
    'e.unr': 'Universidad Nur, Santa Cruz, Bolivia',
    'e2.t': "Bachelor's degree in Systems Engineering",
    'e3.t': 'English Proficiency',
    'e3.w': 'Centro Boliviano Americano (CBA), Santa Cruz, Bolivia',
    'edu.sub2': 'Certifications and languages',
    'c1.w': 'Certificate of attendance, Santa Cruz, Bolivia',
    'c2.t': 'ACM ICPC South America', 'c2.w': 'La Paz, Bolivia',
    'c3.t': 'ACM ICPC First Round', 'c3.w': 'Santa Cruz, Bolivia',
    'lang.h': 'Languages',
    'lang.d': 'Spanish native, English B1',
    'ct.title': "Let's build something solid together.",
    'ct.lead': 'Tell me what you need: backend, microservices or integrations for banking and payments.',
    'ct.wa': 'Message me on WhatsApp',
    'ct.mail': 'Send an email',
    'ct.d1': 'Email', 'ct.d2': 'Phone', 'ct.d3': 'Location', 'ct.d4': 'Languages',
    'foot': 'Systems Engineer and backend developer',
    'nav.home': 'Home', 'nav.projects': 'Projects', 'nav.exp': 'Experience', 'nav.contact': 'Contact'
  };
  var i18nEls = [].slice.call(document.querySelectorAll('[data-i18n]'));
  var ES = {};
  i18nEls.forEach(function (el) { ES[el.getAttribute('data-i18n')] = el.textContent.trim(); });

  var lang = 'es';
  try { if (localStorage.getItem('lang') === 'en') lang = 'en'; } catch (e) {}
  var langBtn = document.getElementById('lang');

  function applyLang() {
    var dict = lang === 'en' ? EN : ES;
    i18nEls.forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (dict[k] === undefined) return;
      if (el === st) splitWords(dict[k]); else el.textContent = dict[k];
    });
    root.lang = lang;
    langBtn.textContent = lang === 'es' ? 'EN' : 'ES';
    langBtn.setAttribute('aria-label', lang === 'es' ? 'Switch to English' : 'Cambiar a español');
    document.title = lang === 'es' ? 'Edson Mamani — Ingeniero Backend' : 'Edson Mamani — Backend Engineer';
    updateClock();
    if (typeof update === 'function') update();
  }

  /* ---------- Local clock (Santa Cruz) ---------- */
  var clock = document.getElementById('clock');
  function updateClock() {
    try {
      clock.textContent = new Intl.DateTimeFormat(lang === 'es' ? 'es-BO' : 'en-US', {
        timeZone: 'America/La_Paz', hour: '2-digit', minute: '2-digit', hour12: false
      }).format(new Date()) + ' (UTC−4)';
    } catch (e) { clock.textContent = ''; }
  }
  setInterval(updateClock, 30000);

  langBtn.addEventListener('click', function () {
    lang = lang === 'es' ? 'en' : 'es';
    try { localStorage.setItem('lang', lang); } catch (e) {}
    applyLang();
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  if (reduce || !hasIO) {
    reveals.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Count-up numbers ---------- */
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  function countUp(el, to) {
    var t0 = null;
    function frame(t) {
      if (t0 === null) t0 = t;
      var k = clamp((t - t0) / 1300, 0, 1);
      k = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * k);
      if (k < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if (!reduce && hasIO) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          countUp(en.target, parseFloat(en.target.getAttribute('data-count')));
          cio.unobserve(en.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { c.textContent = '0'; cio.observe(c); });
  }

  /* ---------- Active dock link ---------- */
  var links = [].slice.call(document.querySelectorAll('.dock a'));
  function setActive(id) {
    links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-target') === id); });
  }
  if (hasIO) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) setActive(en.target.getAttribute('data-spy'));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    [].slice.call(document.querySelectorAll('[data-spy]')).forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Scroll-linked effects ---------- */
  var hero = document.getElementById('inicio');
  var timeline = document.getElementById('timeline');
  var cards = [].slice.call(document.querySelectorAll('.pcard'));
  var ticking = false;

  function update() {
    ticking = false;
    var vh = window.innerHeight;
    var y = window.pageYOffset || document.documentElement.scrollTop;

    hero.style.setProperty('--p', clamp(y / (vh * 0.9), 0, 1).toFixed(3));

    if (words.length) {
      var r = st.getBoundingClientRect();
      var q = clamp((vh * 0.9 - r.top) / (vh * 0.5 + r.height * 0.5), 0, 1);
      var n = words.length;
      for (var i = 0; i < n; i++) {
        var o = clamp(q * n * 1.15 - i, 0, 1);
        words[i].style.opacity = (0.16 + 0.84 * o).toFixed(2);
      }
    }

    var tr = timeline.getBoundingClientRect();
    timeline.style.setProperty('--tl', clamp((vh * 0.65 - tr.top) / tr.height, 0, 1).toFixed(3));

    var w = window.innerWidth;
    var base = w > 560 ? 88 : 72;
    var step = w > 560 ? 18 : 14;
    for (var c = 0; c < cards.length - 1; c++) {
      var nt = cards[c + 1].getBoundingClientRect().top;
      var stacked = base + (c + 1) * step;
      var k = clamp((vh - nt) / (vh - stacked), 0, 1);
      cards[c].style.transform = 'scale(' + (1 - 0.05 * k).toFixed(4) + ')';
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  applyLang();
  if (!reduce) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  } else {
    timeline.style.setProperty('--tl', 1);
  }
})();
