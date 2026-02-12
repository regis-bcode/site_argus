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
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_PATH}${normalized}`;
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

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const sections = [...document.querySelectorAll('main section[id]')];
  const links = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
  if (sections.length && links.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === id));
      });
    }, { threshold: 0.45 });
    sections.forEach((section) => observer.observe(section));
  }

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      if (!item) return;
      const open = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    });
  });

  const backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 320);
    });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const payload = {
        nome: form.querySelector('[name="nome"]')?.value.trim() || '',
        empresa: form.querySelector('[name="empresa"]')?.value.trim() || '',
        email: form.querySelector('[name="email"]')?.value.trim() || '',
        mensagem: form.querySelector('[name="mensagem"]')?.value.trim() || '',
      };
      if (Object.values(payload).some((value) => !value)) {
        alert('Preencha todos os campos obrigatórios.');
        return;
      }
      const body = encodeURIComponent(
        `Nome: ${payload.nome}\nEmpresa: ${payload.empresa}\nE-mail: ${payload.email}\n\nMensagem:\n${payload.mensagem}`,
      );
      const mailto = document.querySelector('#mailto-fallback');
      if (mailto) {
        mailto.href = `mailto:comercial@argusbc.com.br?subject=Contato comercial ARGUS Watch&body=${body}`;
      }
      const notice = document.querySelector('.notice');
      if (notice) notice.style.display = 'block';
    });
  }

  const fill = (selector, value) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.textContent = value;
    });
  };

  fetch(href('/data/site.config.json'))
    .then((response) => response.json())
    .then((config) => {
      fill('[data-company-name]', config.company.name);
      fill('[data-tagline]', config.company.tagline);
      fill('[data-product-name]', config.product.name);
      fill('[data-exec-summary]', config.product.executiveSummary);
      fill('[data-phone]', config.contact.phone);
      fill('[data-email]', config.contact.email);

      const iconContainer = document.querySelector('[data-icons]');
      if (iconContainer && Array.isArray(config.company.icons)) {
        iconContainer.innerHTML = config.company.icons.map((icon) => `<span class="pill">${icon}</span>`).join('');
      }

      const listBindings = [
        ['[data-features-clinical]', config.features.clinical],
        ['[data-features-ccih]', config.features.ccihNspHygiene],
        ['[data-features-tech]', config.features.techInfra],
        ['[data-terms]', config.pricing.generalTerms],
      ];
      listBindings.forEach(([selector, items]) => {
        const container = document.querySelector(selector);
        if (container && Array.isArray(items)) {
          container.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
        }
      });

      const prices = {
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
      Object.entries(prices).forEach(([selector, value]) => fill(selector, value));
    })
    .catch(() => {
      console.warn('Não foi possível carregar data/site.config.json');
    });
})();
