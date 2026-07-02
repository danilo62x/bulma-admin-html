/* ===== Lightweight i18n — loads JSON locale, translates [data-i18n] nodes ===== */
(function (global) {
  const LANGUAGES = [
    { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  let dict = {};
  let current = (() => {
    try {
      return localStorage.getItem('lang') || 'pt-BR';
    } catch (_) {
      return 'pt-BR';
    }
  })();

  function lookup(key) {
    return key.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), dict);
  }

  function t(key, fallback) {
    const v = lookup(key);
    return typeof v === 'string' ? v : fallback != null ? fallback : key;
  }

  function apply(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach((el) => {
      const v = lookup(el.getAttribute('data-i18n'));
      if (typeof v === 'string') el.textContent = v;
    });
    (root || document).querySelectorAll('[data-i18n-ph]').forEach((el) => {
      const v = lookup(el.getAttribute('data-i18n-ph'));
      if (typeof v === 'string') el.setAttribute('placeholder', v);
    });
  }

  async function load(lang) {
    try {
      const res = await fetch(`assets/i18n/${lang}.json`);
      dict = await res.json();
    } catch (_) {
      dict = {};
    }
    document.documentElement.lang = lang;
    apply(document);
    document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang } }));
  }

  async function setLang(lang) {
    current = lang;
    try {
      localStorage.setItem('lang', lang);
    } catch (_) {}
    await load(lang);
  }

  global.I18n = {
    LANGUAGES,
    t,
    apply,
    setLang,
    getLang: () => current,
    init: () => load(current),
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => global.I18n.init());
  } else {
    global.I18n.init();
  }
})(window);
