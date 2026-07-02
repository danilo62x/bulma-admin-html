/**
 * Mock authentication via localStorage.
 * No backend — credentials are checked against a hardcoded list.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'app.auth';

  var MOCK_USERS = [
    { id: 1, email: 'admin@template.com', password: 'admin123', name: 'Admin Usuário', role: 'Administrador' },
    { id: 2, email: 'user@template.com',  password: 'user123',  name: 'Usuário Comum', role: 'Operador' },
  ];

  function readUser() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  window.txAuth = {
    currentUser: function () { return readUser(); },

    isAuthenticated: function () { return readUser() !== null; },

    login: function (email, password) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          var found = MOCK_USERS.find(function (u) {
            return u.email === email && u.password === password;
          });
          if (!found) return resolve(null);
          var user = { id: found.id, name: found.name, email: found.email, role: found.role };
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch (_) {}
          resolve(user);
        }, 600);
      });
    },

    logout: function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
      window.location.href = 'login.html';
    },

    /* Guard helper — call at the top of every protected page */
    requireAuth: function () {
      if (!this.isAuthenticated()) {
        var redirect = encodeURIComponent(window.location.pathname.split('/').pop() || '');
        window.location.replace('login.html?redirect=' + redirect);
        return false;
      }
      return true;
    },

    /* Inverse guard — redirect to dashboard if already logged in */
    requireGuest: function () {
      if (this.isAuthenticated()) {
        window.location.replace('dashboard.html');
        return false;
      }
      return true;
    },
  };
})();
