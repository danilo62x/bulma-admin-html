(function () {
    'use strict';
    if (!txAuth.requireAuth()) return;
    txLayout.init({ current: 'settings.html', pageTitle: 'Configurações' });

    var palettes = [
        { name: 'Azul Clássico',     vars: { '--tx-primary': '#485fc7', '--tx-sidebar-bg': '#2c3e50' } },
        { name: 'Verde Esmeralda',   vars: { '--tx-primary': '#00a878', '--tx-sidebar-bg': '#1a3a2a' } },
        { name: 'Roxo Profissional', vars: { '--tx-primary': '#7c3aed', '--tx-sidebar-bg': '#1e1b4b' } },
        { name: 'Laranja Vibrante',  vars: { '--tx-primary': '#ea580c', '--tx-sidebar-bg': '#1c1917' } },
        { name: 'Rosa Elegante',     vars: { '--tx-primary': '#db2777', '--tx-sidebar-bg': '#2d1b35' } },
        { name: 'Teal Moderno',      vars: { '--tx-primary': '#0d9488', '--tx-sidebar-bg': '#134e4a' } },
    ];

    var themeGroups = {
        'Cores Principais': [
            { key: '--tx-primary', label: 'Cor Principal' },
            { key: '--tx-success', label: 'Sucesso' },
            { key: '--tx-warning', label: 'Aviso' },
            { key: '--tx-danger', label: 'Perigo' },
            { key: '--tx-info', label: 'Informação' },
        ],
        'Sidebar': [
            { key: '--tx-sidebar-bg', label: 'Fundo' },
            { key: '--tx-sidebar-text', label: 'Texto' },
            { key: '--tx-sidebar-text-muted', label: 'Texto Secundário' },
        ],
        'Layout': [
            { key: '--tx-body-bg', label: 'Fundo da Página' },
            { key: '--tx-header-bg', label: 'Header' },
            { key: '--tx-card-bg', label: 'Cards' },
            { key: '--tx-border', label: 'Bordas' },
        ],
        'Tipografia': [
            { key: '--tx-text-heading', label: 'Títulos' },
            { key: '--tx-text', label: 'Texto Principal' },
            { key: '--tx-text-muted', label: 'Texto Secundário' },
        ],
    };

    var defaults = {
        '--tx-primary': '#485fc7', '--tx-success': '#48c774', '--tx-warning': '#f59e0b',
        '--tx-danger': '#f14668', '--tx-info': '#3273dc',
        '--tx-sidebar-bg': '#2c3e50', '--tx-sidebar-text': '#ecf0f1', '--tx-sidebar-text-muted': '#95a5a6',
        '--tx-body-bg': '#f5f5f5', '--tx-header-bg': '#ffffff', '--tx-card-bg': '#ffffff',
        '--tx-border': '#dbdbdb',
        '--tx-text-heading': '#1a1a2a', '--tx-text': '#363636', '--tx-text-muted': '#7a7a7a',
    };

    var activePaletteIdx = -1;

    function getVar(key) {
        return txStore.state.customTheme[key] || defaults[key] || '#000000';
    }

    /* ─── Theme buttons ─── */
    var lightBtn = document.getElementById('theme-light');
    var darkBtn = document.getElementById('theme-dark');
    function updateThemeButtons() {
        lightBtn.className = 'button ' + (!txStore.state.darkMode ? 'is-primary' : 'is-light');
        darkBtn.className = 'button ' + (txStore.state.darkMode ? 'is-primary' : 'is-light');
        // Re-add child icons since className overwrites
        lightBtn.innerHTML = '<span class="mdi mdi-weather-sunny" style="margin-right:0.25rem;"></span>Claro';
        darkBtn.innerHTML = '<span class="mdi mdi-weather-night" style="margin-right:0.25rem;"></span>Escuro';
    }
    lightBtn.addEventListener('click', function () { txStore.setDarkMode(false); updateThemeButtons(); });
    darkBtn.addEventListener('click', function () { txStore.setDarkMode(true); updateThemeButtons(); });
    updateThemeButtons();

    /* ─── Font size ─── */
    document.getElementById('font-size').addEventListener('change', function (e) {
        document.documentElement.style.fontSize = e.target.value;
    });

    /* ─── Palette grid ─── */
    var pgrid = document.getElementById('palette-grid');
    function renderPalettes() {
        pgrid.innerHTML = palettes.map(function (p, idx) {
            return '<div class="tx-palette-card ' + (activePaletteIdx === idx ? 'is-active' : '') + '" data-idx="' + idx + '">' +
                '<div class="tx-palette-preview">' +
                '  <div class="tx-palette-body" style="background:' + p.vars['--tx-primary'] + ';">' +
                    (activePaletteIdx === idx ? '<span class="tx-palette-check">✓</span>' : '') +
                '  </div>' +
                '  <div class="tx-palette-sidebar-strip" style="background:' + p.vars['--tx-sidebar-bg'] + ';">' +
                '    <span class="tx-palette-line"></span><span class="tx-palette-line"></span><span class="tx-palette-line"></span>' +
                '  </div>' +
                '</div>' +
                '<div class="tx-palette-name">' + p.name + '</div>' +
                '</div>';
        }).join('');
        pgrid.querySelectorAll('[data-idx]').forEach(function (el) {
            el.addEventListener('click', function () {
                var idx = Number(el.getAttribute('data-idx'));
                activePaletteIdx = idx;
                Object.entries(palettes[idx].vars).forEach(function (e) { txStore.setThemeVar(e[0], e[1]); });
                renderPalettes();
                renderColorGroups();
            });
        });
    }
    renderPalettes();

    /* ─── Color groups ─── */
    var cg = document.getElementById('color-groups');
    function renderColorGroups() {
        cg.innerHTML = Object.entries(themeGroups).map(function (entry) {
            var name = entry[0], defs = entry[1];
            return '<div class="tx-color-group">' +
                '<div class="tx-color-group-label">' + name + '</div>' +
                defs.map(function (d) {
                    var v = getVar(d.key);
                    return '<div class="tx-color-row">' +
                        '<span class="tx-color-label">' + d.label + '</span>' +
                        '<div class="tx-color-swatch" style="background:' + v + ';"></div>' +
                        '<input type="color" value="' + v + '" class="tx-color-picker" data-key="' + d.key + '" />' +
                        '<code class="tx-color-hex">' + v + '</code>' +
                        '</div>';
                }).join('') +
                '</div>';
        }).join('');
        cg.querySelectorAll('[data-key]').forEach(function (input) {
            input.addEventListener('input', function (e) {
                activePaletteIdx = -1;
                txStore.setThemeVar(input.getAttribute('data-key'), e.target.value);
                renderPalettes();
                renderColorGroups();
            });
        });
    }
    renderColorGroups();

    document.getElementById('reset-theme').addEventListener('click', function () {
        txStore.resetThemeVars();
        activePaletteIdx = -1;
        renderPalettes();
        renderColorGroups();
    });

    /* ─── Sidebar width ─── */
    var widthInput = document.getElementById('sidebar-width-input');
    var widthLabel = document.getElementById('sidebar-width-label');
    widthInput.value = txStore.state.sidebarWidth;
    widthLabel.textContent = txStore.state.sidebarWidth + 'px';
    widthInput.addEventListener('input', function (e) {
        txStore.setSidebarWidth(Number(e.target.value));
        widthLabel.textContent = txStore.state.sidebarWidth + 'px';
        // Re-apply layout
        var sidebar = document.getElementById('tx-sidebar');
        var main = document.getElementById('tx-main');
        if (sidebar && !txStore.state.sidebarCollapsed) {
            sidebar.style.width = txStore.state.sidebarWidth + 'px';
            sidebar.style.minWidth = txStore.state.sidebarWidth + 'px';
        }
        if (main && !txStore.state.sidebarCollapsed && window.innerWidth > 768) {
            main.style.marginLeft = txStore.state.sidebarWidth + 'px';
        }
    });

    /* ─── Sidebar collapse toggle ─── */
    var collapseToggle = document.getElementById('sidebar-collapse-toggle');
    var collapseLabel = document.getElementById('sidebar-collapse-label');
    collapseToggle.checked = txStore.state.sidebarCollapsed;
    collapseLabel.textContent = txStore.state.sidebarCollapsed ? 'Compactado (apenas ícones)' : 'Expandido';
    collapseToggle.addEventListener('change', function () {
        txStore.toggleSidebar();
        collapseLabel.textContent = txStore.state.sidebarCollapsed ? 'Compactado (apenas ícones)' : 'Expandido';
    });

    /* ─── Profile info ─── */
    var user = txAuth.currentUser();
    if (user) {
        var parts = user.name.split(' ');
        var initials = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
        document.getElementById('profile-avatar').textContent = initials;
        document.getElementById('profile-name').textContent = user.name;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-role').textContent = user.role;
    }
})();
