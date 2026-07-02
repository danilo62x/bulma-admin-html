/**
 * Global UI state with localStorage persistence.
 * Mirrors the Pinia store from the Vue template.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'app.ui';
  var notifId = 0;

  function readPersisted() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  var persisted = readPersisted();

  var state = {
    darkMode: persisted.darkMode || false,
    sidebarCollapsed: persisted.sidebarCollapsed || false,
    sidebarWidth: persisted.sidebarWidth || 260,
    sidebarMobileOpen: false,
    customTheme: persisted.customTheme || {},
    cookiesAccepted: persisted.cookiesAccepted || false,
    showCookieBanner: false,
    notifications: [],
    pageTitle: 'Dashboard',
    _listeners: [],
  };

  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          darkMode: state.darkMode,
          sidebarCollapsed: state.sidebarCollapsed,
          sidebarWidth: state.sidebarWidth,
          customTheme: state.customTheme,
          cookiesAccepted: state.cookiesAccepted,
        })
      );
    } catch (_) {
      /* ignore */
    }
  }

  function emit(event, data) {
    state._listeners
      .filter(function (l) { return l.event === event; })
      .forEach(function (l) {
        try { l.fn(data); } catch (_) {}
      });
  }

  var Store = {
    state: state,

    on: function (event, fn) {
      state._listeners.push({ event: event, fn: fn });
    },

    /* ─── Theme ─────────────────────────────────────────── */
    applyTheme: function () {
      document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
      Object.keys(state.customTheme).forEach(function (k) {
        document.documentElement.style.setProperty(k, state.customTheme[k]);
      });
    },
    toggleDarkMode: function () {
      state.darkMode = !state.darkMode;
      this.applyTheme();
      persist();
      emit('darkMode', state.darkMode);
    },
    setDarkMode: function (v) {
      state.darkMode = !!v;
      this.applyTheme();
      persist();
      emit('darkMode', state.darkMode);
    },
    setThemeVar: function (k, v) {
      state.customTheme[k] = v;
      document.documentElement.style.setProperty(k, v);
      persist();
      emit('customTheme', state.customTheme);
    },
    resetThemeVars: function () {
      Object.keys(state.customTheme).forEach(function (k) {
        document.documentElement.style.removeProperty(k);
      });
      state.customTheme = {};
      persist();
      emit('customTheme', state.customTheme);
    },

    /* ─── Sidebar ───────────────────────────────────────── */
    toggleSidebar: function () {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      persist();
      emit('sidebar', state.sidebarCollapsed);
    },
    setSidebarWidth: function (w) {
      state.sidebarWidth = Math.min(400, Math.max(160, w));
      persist();
      emit('sidebarWidth', state.sidebarWidth);
    },
    toggleSidebarMobile: function (val) {
      state.sidebarMobileOpen = (val === undefined) ? !state.sidebarMobileOpen : !!val;
      emit('sidebarMobile', state.sidebarMobileOpen);
    },

    /* ─── Notifications ────────────────────────────────── */
    notify: function (message, type, duration) {
      type = type || 'is-info';
      duration = duration || 4000;
      var id = ++notifId;
      state.notifications.push({ id: id, message: message, type: type, duration: duration });
      emit('notifications', state.notifications);
      var self = this;
      setTimeout(function () { self.dismissNotification(id); }, duration);
    },
    notifySuccess: function (m) { this.notify(m, 'is-success'); },
    notifyError: function (m) { this.notify(m, 'is-danger'); },
    notifyWarning: function (m) { this.notify(m, 'is-warning'); },
    dismissNotification: function (id) {
      var idx = state.notifications.findIndex(function (n) { return n.id === id; });
      if (idx !== -1) state.notifications.splice(idx, 1);
      emit('notifications', state.notifications);
    },

    /* ─── Cookie banner ────────────────────────────────── */
    acceptCookies: function () {
      state.cookiesAccepted = true;
      state.showCookieBanner = false;
      persist();
      emit('cookieBanner', state.showCookieBanner);
    },
    declineCookies: function () {
      state.cookiesAccepted = false;
      state.showCookieBanner = false;
      persist();
      emit('cookieBanner', state.showCookieBanner);
    },
    openCookieBanner: function () {
      state.showCookieBanner = true;
      emit('cookieBanner', true);
    },
    closeCookieBanner: function () {
      state.showCookieBanner = false;
      emit('cookieBanner', false);
    },

    /* ─── Page title ───────────────────────────────────── */
    setPageTitle: function (title) {
      state.pageTitle = title;
      document.title = title ? title + ' — Admin Template' : 'Admin Template';
      emit('pageTitle', title);
    },
  };

  // Apply theme on script load (before paint)
  Store.applyTheme();

  window.txStore = Store;
})();
