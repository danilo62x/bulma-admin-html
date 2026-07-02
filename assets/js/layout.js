/**
 * Layout renderer — injects sidebar, header, footer, notifications, cookie banner
 * into placeholder elements on the page.
 */
(function () {
  'use strict';

  var store = window.txStore;
  var menu = window.txMenu;
  var auth = window.txAuth;

  /* ─── i18n + PWA bootstrap (loaded once for every admin page) ───── */
  var LANGS = [
    { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];
  function currentLang() {
    if (window.I18n) return window.I18n.getLang();
    try { return localStorage.getItem('lang') || 'pt-BR'; } catch (_) { return 'pt-BR'; }
  }
  (function loadScriptsOnce() {
    ['assets/js/i18n.js', 'assets/js/pwa.js'].forEach(function (src) {
      if (!document.querySelector('script[src="' + src + '"]')) {
        var sc = document.createElement('script');
        sc.src = src;
        document.head.appendChild(sc);
      }
    });
  })();

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function isActive(href, current) {
    if (!href || !current) return false;
    return current === href;
  }

  function isGroupActive(item, current) {
    if (!item.children) return false;
    return item.children.some(function (c) {
      if (c.children) return isGroupActive(c, current);
      return isActive(c.href, current);
    });
  }

  /* ─── Sidebar ─────────────────────────────────────────── */
  function renderSidebar(current) {
    var openGroups = new Set();
    var walk = function (items) {
      items.forEach(function (item) {
        if (item.children) {
          if (isGroupActive(item, current)) openGroups.add(item.label);
          walk(item.children);
        }
      });
    };
    walk(menu.items);

    var html = [
      '<div class="tx-sidebar-brand">',
      '  <div class="tx-sidebar-icon-box">A</div>',
      '  <span class="tx-sidebar-brand-text">Admin Template</span>',
      '</div>',
      '<nav class="tx-sidebar-nav">',
    ];

    menu.items.forEach(function (item) {
      if (item.children) {
        var groupActive = isGroupActive(item, current);
        var groupOpen = openGroups.has(item.label);
        html.push(
          '<div class="tx-nav-item ' + (groupActive ? 'is-active' : '') + '" data-toggle-group="' + escapeHtml(item.label) + '">',
          '  <span class="tx-nav-icon mdi ' + item.icon + '"></span>',
          '  <span class="tx-nav-label">' + escapeHtml(item.label) + '</span>',
          '  <span class="tx-nav-chevron mdi mdi-chevron-down ' + (groupOpen ? 'is-open' : '') + '"></span>',
          '</div>',
          '<div class="tx-nav-submenu ' + (groupOpen ? 'is-open' : '') + '" data-group="' + escapeHtml(item.label) + '">'
        );
        item.children.forEach(function (child) {
          if (child.children) {
            var sgActive = isGroupActive(child, current);
            var sgOpen = openGroups.has(child.label);
            html.push(
              '<div class="tx-nav-subgroup ' + (sgActive ? 'is-active' : '') + '" data-toggle-group="' + escapeHtml(child.label) + '">',
              '  <span class="mdi ' + child.icon + '" style="font-size:1rem;"></span>',
              '  ' + escapeHtml(child.label),
              '  <span class="tx-nav-subgroup-chevron mdi mdi-chevron-down ' + (sgOpen ? 'is-open' : '') + '"></span>',
              '</div>',
              '<div class="tx-nav-subsubmenu ' + (sgOpen ? 'is-open' : '') + '" data-group="' + escapeHtml(child.label) + '">'
            );
            child.children.forEach(function (grand) {
              html.push(
                '<a href="' + escapeHtml(grand.href) + '" class="tx-nav-subsubitem ' + (isActive(grand.href, current) ? 'is-active' : '') + '">',
                '  <span class="mdi ' + grand.icon + '" style="margin-right:0.4rem; font-size:0.9rem;"></span>',
                '  ' + escapeHtml(grand.label),
                '</a>'
              );
            });
            html.push('</div>');
          } else {
            html.push(
              '<a href="' + escapeHtml(child.href) + '" class="tx-nav-subitem ' + (isActive(child.href, current) ? 'is-active' : '') + '">',
              '  <span class="mdi ' + child.icon + '" style="margin-right:0.5rem; font-size:1rem;"></span>',
              '  ' + escapeHtml(child.label),
              '</a>'
            );
          }
        });
        html.push('</div>');
      } else {
        html.push(
          '<a href="' + escapeHtml(item.href) + '" class="tx-nav-item ' + (isActive(item.href, current) ? 'is-active' : '') + '">',
          '  <span class="tx-nav-icon mdi ' + item.icon + '"></span>',
          '  <span class="tx-nav-label">' + escapeHtml(item.label) + '</span>',
          '</a>'
        );
      }
    });

    html.push('</nav>', '<div class="tx-sidebar-footer">');
    menu.footerItems.forEach(function (item) {
      html.push(
        '<div class="tx-nav-item" data-action="' + (item.action || '') + '">',
        '  <span class="tx-nav-icon mdi ' + item.icon + '"></span>',
        '  <span class="tx-nav-label">' + escapeHtml(item.label) + '</span>',
        '</div>'
      );
    });
    html.push(
      '</div>',
      '<div class="tx-resize-handle" id="tx-resize-handle"></div>'
    );

    return html.join('');
  }

  /* ─── Header ──────────────────────────────────────────── */
  function renderHeader(pageTitle) {
    var user = auth.currentUser();
    var initials = '?';
    if (user && user.name) {
      var parts = user.name.split(' ');
      initials = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
    }

    var lang = currentLang();
    var curLang = LANGS.filter(function (l) { return l.code === lang; })[0] || LANGS[0];
    var langItems = LANGS.map(function (l) {
      return '<a class="dropdown-item ' + (l.code === lang ? 'is-active' : '') + '" data-set-lang="' + l.code + '">' +
             '<span style="margin-right:0.5rem;">' + l.flag + '</span>' + escapeHtml(l.label) +
             (l.code === lang ? '<span class="mdi mdi-check" style="margin-left:auto; color:var(--tx-primary);"></span>' : '') +
             '</a>';
    }).join('');

    return [
      '<div class="tx-header-left">',
      '  <button class="button is-ghost tx-icon-btn is-hidden-desktop" id="tx-mobile-toggle"><span class="mdi mdi-menu"></span></button>',
      '  <button class="button is-ghost tx-icon-btn is-hidden-touch" id="tx-sidebar-toggle"><span class="mdi" id="tx-sidebar-toggle-icon"></span></button>',
      '  <span class="tx-page-title">' + escapeHtml(pageTitle) + '</span>',
      '</div>',
      '<div class="tx-header-right">',
      '  <button class="button is-ghost tx-icon-btn" id="tx-darkmode-toggle"><span class="mdi" id="tx-darkmode-icon"></span></button>',
      '  <div class="tx-dropdown is-left" id="tx-lang-dropdown">',
      '    <button class="button is-ghost tx-icon-btn" data-dropdown-trigger aria-label="' + escapeHtml(curLang.label) + '">',
      '      <span style="font-size:1.15rem; line-height:1;">' + curLang.flag + '</span>',
      '    </button>',
      '    <div class="tx-dropdown-menu" style="min-width:180px;">',
      '      <div class="tx-dropdown-header">Idioma</div>',
      langItems,
      '    </div>',
      '  </div>',
      '  <div class="tx-dropdown is-left" id="tx-notif-dropdown">',
      '    <button class="button is-ghost tx-icon-btn tx-icon-btn-notif" data-dropdown-trigger>',
      '      <span class="mdi mdi-bell"></span>',
      '      <span class="tag is-danger is-rounded tx-notif-badge">3</span>',
      '    </button>',
      '    <div class="tx-dropdown-menu" style="min-width:300px;">',
      '      <div class="tx-dropdown-header">Notificações</div>',
      '      <div class="dropdown-item"><div class="tx-notif-item"><span class="mdi mdi-account-plus tx-notif-icon" style="color:#48c774;"></span><div><div class="tx-notif-title">Novo usuário cadastrado</div><div class="tx-notif-time">2 min atrás</div></div></div></div>',
      '      <div class="dropdown-item"><div class="tx-notif-item"><span class="mdi mdi-file-chart tx-notif-icon" style="color:#3273dc;"></span><div><div class="tx-notif-title">Relatório mensal disponível</div><div class="tx-notif-time">1 hora atrás</div></div></div></div>',
      '      <div class="dropdown-item"><div class="tx-notif-item"><span class="mdi mdi-update tx-notif-icon" style="color:#f59e0b;"></span><div><div class="tx-notif-title">Atualização do sistema</div><div class="tx-notif-time">3 horas atrás</div></div></div></div>',
      '      <div class="tx-dropdown-footer"><a>Ver todas as notificações</a></div>',
      '    </div>',
      '  </div>',
      '  <div class="tx-dropdown is-left" id="tx-user-dropdown">',
      '    <button class="button is-ghost tx-user-trigger" data-dropdown-trigger>',
      '      <div class="tx-user-avatar">' + escapeHtml(initials) + '</div>',
      '      <span class="tx-user-name-text is-hidden-touch">' + escapeHtml((user && user.name) || 'Usuário') + '</span>',
      '      <span class="mdi mdi-chevron-down is-hidden-touch" style="font-size:1rem; color:var(--tx-text-muted);"></span>',
      '    </button>',
      '    <div class="tx-dropdown-menu" style="min-width:220px;">',
      '      <div class="tx-user-info">',
      '        <div class="tx-user-name">' + escapeHtml((user && user.name) || '') + '</div>',
      '        <div class="tx-user-email">' + escapeHtml((user && user.email) || '') + '</div>',
      '        <span class="tag is-light is-small tx-user-role">' + escapeHtml((user && user.role) || '') + '</span>',
      '      </div>',
      '      <a class="dropdown-item" href="settings.html"><span class="mdi mdi-cog" style="margin-right:0.5rem;"></span>Configurações</a>',
      '      <a class="dropdown-item" id="tx-open-cookies"><span class="mdi mdi-cookie" style="margin-right:0.5rem;"></span>Política de Cookies</a>',
      '      <a class="dropdown-item" id="tx-clear-data"><span class="mdi mdi-broom" style="margin-right:0.5rem;"></span>Limpar dados</a>',
      '      <hr class="dropdown-divider" />',
      '      <a class="dropdown-item has-text-danger" id="tx-logout"><span class="mdi mdi-logout" style="margin-right:0.5rem;"></span>Sair</a>',
      '    </div>',
      '  </div>',
      '</div>',
    ].join('');
  }

  /* ─── Footer ──────────────────────────────────────────── */
  function renderFooter() {
    var year = new Date().getFullYear();
    return '&copy; ' + year + ' Admin Template — HTML + Bulma';
  }

  /* ─── Notifications ───────────────────────────────────── */
  function renderNotifications() {
    var container = document.getElementById('tx-notifications');
    if (!container) return;
    container.innerHTML = store.state.notifications
      .map(function (n) {
        return '<div class="tx-notification notification ' + n.type + '" data-id="' + n.id + '">' +
               '<button class="delete" data-dismiss="' + n.id + '"></button>' +
               escapeHtml(n.message) + '</div>';
      })
      .join('');
    container.querySelectorAll('[data-dismiss]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        store.dismissNotification(Number(btn.getAttribute('data-dismiss')));
      });
    });
  }

  /* ─── Cookie banner ───────────────────────────────────── */
  function renderCookieBanner() {
    var container = document.getElementById('tx-cookie-banner');
    if (!container) return;
    if (!store.state.showCookieBanner) {
      container.style.display = 'none';
      return;
    }
    container.style.display = 'flex';
    container.innerHTML = [
      '<div class="tx-cookie-icon"><span class="mdi mdi-cookie"></span></div>',
      '<div class="tx-cookie-content">',
      '  <div class="tx-cookie-title">Aviso de Cookies</div>',
      '  <p class="tx-cookie-text">Este site utiliza cookies para melhorar sua experiência. Ao continuar navegando, você concorda com a nossa <a href="#" id="tx-cookie-policy">Política de Privacidade</a>.</p>',
      '</div>',
      '<div class="tx-cookie-actions">',
      '  <button class="button is-light is-small" id="tx-cookie-decline">Recusar</button>',
      '  <button class="button is-primary is-small" id="tx-cookie-accept"><span class="mdi mdi-check" style="margin-right:0.25rem;"></span>Aceitar</button>',
      '  <button class="tx-cookie-close" id="tx-cookie-close" aria-label="Fechar"><span class="mdi mdi-close"></span></button>',
      '</div>',
    ].join('');

    document.getElementById('tx-cookie-policy').addEventListener('click', function (e) {
      e.preventDefault();
      store.notify('Abrindo política de privacidade...', 'is-info');
    });
    document.getElementById('tx-cookie-decline').addEventListener('click', function () { store.declineCookies(); });
    document.getElementById('tx-cookie-accept').addEventListener('click', function () { store.acceptCookies(); });
    document.getElementById('tx-cookie-close').addEventListener('click', function () { store.closeCookieBanner(); });
  }

  /* ─── Apply sidebar/main width state ─────────────────── */
  function applyLayoutState() {
    var sidebar = document.getElementById('tx-sidebar');
    var main = document.getElementById('tx-main');
    var backdrop = document.getElementById('tx-backdrop');

    if (sidebar) {
      sidebar.classList.toggle('is-collapsed', store.state.sidebarCollapsed);
      sidebar.classList.toggle('is-mobile-open', store.state.sidebarMobileOpen);
      if (!store.state.sidebarCollapsed) {
        sidebar.style.width = store.state.sidebarWidth + 'px';
        sidebar.style.minWidth = store.state.sidebarWidth + 'px';
      } else {
        sidebar.style.width = '';
        sidebar.style.minWidth = '';
      }
    }
    if (main) {
      main.classList.toggle('sidebar-collapsed', store.state.sidebarCollapsed);
      if (!store.state.sidebarCollapsed && window.innerWidth > 768) {
        main.style.marginLeft = store.state.sidebarWidth + 'px';
      } else {
        main.style.marginLeft = '';
      }
    }
    if (backdrop) {
      backdrop.classList.toggle('is-active', store.state.sidebarMobileOpen);
    }

    var toggleIcon = document.getElementById('tx-sidebar-toggle-icon');
    if (toggleIcon) {
      toggleIcon.className = 'mdi ' + (store.state.sidebarCollapsed ? 'mdi-menu-open' : 'mdi-menu');
    }
    var darkIcon = document.getElementById('tx-darkmode-icon');
    if (darkIcon) {
      darkIcon.className = 'mdi ' + (store.state.darkMode ? 'mdi-weather-sunny' : 'mdi-weather-night');
    }
  }

  /* ─── Wire header-scoped element handlers (re-bindable) ─ */
  function rewireHeader() {
    /* Header buttons */
    var darkBtn = document.getElementById('tx-darkmode-toggle');
    if (darkBtn) darkBtn.addEventListener('click', function () { store.toggleDarkMode(); applyLayoutState(); });

    var sbToggle = document.getElementById('tx-sidebar-toggle');
    if (sbToggle) sbToggle.addEventListener('click', function () { store.toggleSidebar(); applyLayoutState(); });

    var mobToggle = document.getElementById('tx-mobile-toggle');
    if (mobToggle) mobToggle.addEventListener('click', function () { store.toggleSidebarMobile(); applyLayoutState(); });

    /* Header dropdown menus */
    document.querySelectorAll('#tx-header [data-dropdown-trigger]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var dropdown = btn.closest('.tx-dropdown');
        document.querySelectorAll('.tx-dropdown.is-active').forEach(function (d) {
          if (d !== dropdown) d.classList.remove('is-active');
        });
        dropdown.classList.toggle('is-active');
      });
    });

    /* Language switcher */
    document.querySelectorAll('[data-set-lang]').forEach(function (el) {
      el.addEventListener('click', function () {
        var code = el.getAttribute('data-set-lang');
        if (window.I18n) window.I18n.setLang(code);
        else { try { localStorage.setItem('lang', code); } catch (_) {} }
        var header = document.getElementById('tx-header');
        if (header) { header.innerHTML = renderHeader(store.state.pageTitle); rewireHeader(); applyLayoutState(); }
      });
    });

    /* Logout */
    var logoutBtn = document.getElementById('tx-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', function () { auth.logout(); });

    /* Open cookie banner */
    var openCk = document.getElementById('tx-open-cookies');
    if (openCk) openCk.addEventListener('click', function () { store.openCookieBanner(); renderCookieBanner(); });

    /* Clear browser data */
    var clearData = document.getElementById('tx-clear-data');
    if (clearData) clearData.addEventListener('click', function () {
      if (confirm('Limpar todos os dados do navegador? Você será deslogado e a página será recarregada.')) {
        try { localStorage.clear(); sessionStorage.clear(); } catch (_) {}
        window.location.href = 'login.html';
      }
    });
  }

  /* ─── Wire up interactivity ──────────────────────────── */
  function wireUp() {
    /* Sidebar group toggles */
    document.querySelectorAll('[data-toggle-group]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        var label = el.getAttribute('data-toggle-group');
        var submenu = document.querySelector('[data-group="' + label + '"]');
        var chev = el.querySelector('.tx-nav-chevron, .tx-nav-subgroup-chevron');
        if (submenu) submenu.classList.toggle('is-open');
        if (chev) chev.classList.toggle('is-open');
      });
    });

    /* Sidebar close on mobile link click */
    document.querySelectorAll('.tx-sidebar a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.innerWidth <= 768) store.toggleSidebarMobile(false);
      });
    });

    /* Footer logout */
    var logoutFooter = document.querySelector('.tx-sidebar-footer [data-action="logout"]');
    if (logoutFooter) logoutFooter.addEventListener('click', function () { auth.logout(); });

    var backdrop = document.getElementById('tx-backdrop');
    if (backdrop) backdrop.addEventListener('click', function () { store.toggleSidebarMobile(false); applyLayoutState(); });

    rewireHeader();

    /* Close dropdowns on outside click (bound once) */
    document.addEventListener('click', function () {
      document.querySelectorAll('.tx-dropdown.is-active').forEach(function (d) { d.classList.remove('is-active'); });
    });

    /* Sidebar resize handle */
    var handle = document.getElementById('tx-resize-handle');
    if (handle) {
      handle.addEventListener('mousedown', function (e) {
        e.preventDefault();
        handle.classList.add('is-resizing');
        var startX = e.clientX;
        var startW = store.state.sidebarWidth;
        function onMove(ev) {
          store.setSidebarWidth(startW + (ev.clientX - startX));
          applyLayoutState();
        }
        function onUp() {
          handle.classList.remove('is-resizing');
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
        }
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      });
    }
  }

  /* ─── Public init ─────────────────────────────────────── */
  window.txLayout = {
    init: function (opts) {
      opts = opts || {};
      var current = opts.current || (window.location.pathname.split('/').pop() || 'dashboard.html');
      var pageTitle = opts.pageTitle || 'Dashboard';

      store.setPageTitle(pageTitle);

      var sidebar = document.getElementById('tx-sidebar');
      var header = document.getElementById('tx-header');
      var footer = document.getElementById('tx-footer');

      if (sidebar) sidebar.innerHTML = renderSidebar(current);
      if (header) header.innerHTML = renderHeader(pageTitle);
      if (footer) footer.innerHTML = renderFooter();

      applyLayoutState();
      renderNotifications();
      renderCookieBanner();
      wireUp();

      /* Re-render notifications when state changes */
      store.on('notifications', renderNotifications);
      store.on('cookieBanner', renderCookieBanner);
      store.on('darkMode', applyLayoutState);
      store.on('sidebar', applyLayoutState);
      store.on('sidebarMobile', applyLayoutState);

      /* Initial cookie banner check */
      if (!store.state.cookiesAccepted) {
        store.openCookieBanner();
      }
    },
  };
})();
