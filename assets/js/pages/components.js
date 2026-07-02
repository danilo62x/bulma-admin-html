(function () {
    'use strict';
    if (!txAuth.requireAuth()) return;
    txLayout.init({ current: 'components.html', pageTitle: 'Componentes' });

    /* ─── Modals ─── */
    function openModal(id) { document.getElementById(id).classList.add('is-active'); }
    function closeModal(id) { document.getElementById(id).classList.remove('is-active'); }

    document.getElementById('open-modal').addEventListener('click', function () { openModal('modal-example'); });
    document.getElementById('open-confirm').addEventListener('click', function () { openModal('modal-confirm'); });
    document.getElementById('save-modal').addEventListener('click', function () { closeModal('modal-example'); txStore.notifySuccess('Modal salvo!'); });
    document.getElementById('save-confirm').addEventListener('click', function () { closeModal('modal-confirm'); txStore.notifySuccess('Confirmado!'); });
    document.querySelectorAll('[data-close-modal]').forEach(function (el) {
        el.addEventListener('click', function () { closeModal(el.getAttribute('data-close-modal')); });
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') document.querySelectorAll('.modal.is-active').forEach(function (m) { m.classList.remove('is-active'); });
    });

    /* ─── Collapse ─── */
    var panels = [
        { title: 'O que é este template?', icon: 'mdi-information-outline', content: 'Template administrativo em HTML puro, com Bulma 1.x via CDN. Sem build, sem dependências.' },
        { title: 'Como funciona o Dark Mode?', icon: 'mdi-theme-light-dark', content: 'CSS custom properties + atributo data-theme="dark" no <html>. Variáveis sobrescritas em dark.css.' },
        { title: 'Posso personalizar as cores?', icon: 'mdi-palette', content: 'Sim! Variáveis CSS em assets/css/variables.css. Ajuste em runtime na tela de Configurações.' },
        { title: 'Estrutura de pastas', icon: 'mdi-folder-outline', content: 'assets/css/ — estilos. assets/js/ — scripts. assets/js/pages/ — JS por página. *.html — páginas.' },
    ];
    var openPanel = 0;
    function renderCollapse() {
        document.getElementById('collapse-list').innerHTML = panels.map(function (p, i) {
            return '<div class="tx-collapse-item">' +
                '<div class="tx-collapse-trigger" data-panel="' + i + '">' +
                '  <span class="mdi ' + p.icon + '" style="font-size: 1.1rem; color: var(--tx-primary);"></span>' +
                '  <span class="tx-collapse-label">' + p.title + '</span>' +
                '  <span class="mdi tx-collapse-chevron ' + (openPanel === i ? 'mdi-chevron-up' : 'mdi-chevron-down') + '"></span>' +
                '</div>' +
                (openPanel === i ? '<div class="tx-collapse-body">' + p.content + '</div>' : '') +
                '</div>';
        }).join('');
        document.querySelectorAll('[data-panel]').forEach(function (el) {
            el.addEventListener('click', function () {
                var i = Number(el.getAttribute('data-panel'));
                openPanel = (openPanel === i ? null : i);
                renderCollapse();
            });
        });
    }
    renderCollapse();
})();
