(() => {
  const BASE_PATH = (() => {
    const { hostname, pathname, protocol } = window.location;
    if (protocol === 'file:') return '';
    if (hostname.endsWith('github.io')) {
      const first = pathname.split('/').filter(Boolean)[0];
      return first ? `/${first}` : '';
    }
    return '';
  })();

  const href = (path) => {
    if (!path || /^(https?:|mailto:|tel:|#)/.test(path)) return path;
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_PATH}${clean}`;
  };

  window.siteUtils = { BASE_PATH, href };

  document.querySelectorAll('[data-href]').forEach((el) => {
    el.setAttribute('href', href(el.getAttribute('data-href')));
  });
  document.querySelectorAll('[data-src]').forEach((el) => {
    el.setAttribute('src', href(el.getAttribute('data-src')));
  });

  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  const backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 300);
    });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const open = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    });
  });

  const sections = [...document.querySelectorAll('main section[id]')];
  const links = [...document.querySelectorAll('.nav-menu a[href^="#"], .nav-menu a[data-href]')];
  if (sections.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === id));
      });
    }, { threshold: 0.35 });
    sections.forEach((s) => obs.observe(s));
  }

  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = form.querySelector('[name="nome"]').value.trim();
      const company = form.querySelector('[name="empresa"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const message = form.querySelector('[name="mensagem"]').value.trim();
      const notice = document.querySelector('.notice');
      if (!name || !company || !email || !message) {
        alert('Preencha todos os campos obrigatórios.');
        return;
      }
      const body = encodeURIComponent(`Nome: ${name}\nEmpresa: ${company}\nE-mail: ${email}\n\nMensagem:\n${message}`);
      const mailBtn = document.querySelector('#mailto-fallback');
      mailBtn.href = `mailto:comercial@argusbc.com.br?subject=Contato comercial ARGUS Watch&body=${body}`;
      if (notice) notice.style.display = 'block';
    });
  }

  const fill = (selector, value) => {
    document.querySelectorAll(selector).forEach((el) => { el.textContent = value; });
  };

  fetch(href('/data/site.config.json'))
    .then((r) => r.json())
    .then((config) => {
      fill('[data-company-name]', config.company.name);
      fill('[data-tagline]', config.company.tagline);
      fill('[data-product-name]', config.product.name);
      fill('[data-exec-summary]', config.product.executiveSummary);
      fill('[data-phone]', config.contact.phone);
      fill('[data-email]', config.contact.email);

      const iconContainer = document.querySelector('[data-icons]');
      if (iconContainer) {
        iconContainer.innerHTML = config.company.icons.map((icon) => `<span class="pill">${icon}</span>`).join('');
      }

      const listMap = [
        ['[data-features-clinical]', config.features.clinical],
        ['[data-features-ccih]', config.features.ccihNspHygiene],
        ['[data-features-tech]', config.features.techInfra],
        ['[data-principles]', config.methodology.principles],
        ['[data-terms]', config.pricing.generalTerms],
      ];
      listMap.forEach(([selector, items]) => {
        const el = document.querySelector(selector);
        if (el && Array.isArray(items)) el.innerHTML = items.map((it) => `<li>${it}</li>`).join('');
      });

      const priceFields = {
        '[data-ccih-monthly]': config.pricing.ccih.monthly,
        '[data-ccih-cnpj]': config.pricing.ccih.perCnpj,
        '[data-ccih-setup]': config.pricing.ccih.setup,
        '[data-ccih-tokens]': config.pricing.ccih.tokensRule,
        '[data-nsp-monthly]': config.pricing.nsp.monthly,
        '[data-nsp-cnpj]': config.pricing.nsp.perCnpj,
        '[data-nsp-setup]': config.pricing.nsp.setup,
        '[data-nsp-tokens]': config.pricing.nsp.tokensRule,
        '[data-token-reference]': config.pricing.tokensReference,
      };
      Object.entries(priceFields).forEach(([selector, value]) => fill(selector, value));
    })
    .catch(() => console.warn('Não foi possível carregar site.config.json'));
})();
