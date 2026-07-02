(function () {
    'use strict';
    if (!txAuth.requireAuth()) return;
    txLayout.init({ current: 'forms.html', pageTitle: 'Formulários' });

    /* ─── Tabs ─── */
    document.querySelectorAll('#tabs-nav a').forEach(function (a) {
        a.addEventListener('click', function () {
            var idx = a.getAttribute('data-tab');
            document.querySelectorAll('#tabs-nav li').forEach(function (li) { li.classList.remove('is-active'); });
            a.parentElement.classList.add('is-active');
            document.querySelectorAll('.tx-tab-panel').forEach(function (p) { p.style.display = 'none'; });
            document.getElementById('tab-' + idx).style.display = 'block';
        });
    });

    /* ─── Rate stars ─── */
    var rateEl = document.getElementById('rate-stars');
    function renderStars() {
        var value = Number(rateEl.getAttribute('data-value')) || 0;
        rateEl.innerHTML = [1, 2, 3, 4, 5].map(function (s) {
            return '<span class="mdi mdi-star tx-star ' + (s <= value ? 'is-filled' : '') + '" data-star="' + s + '"></span>';
        }).join('');
        rateEl.querySelectorAll('[data-star]').forEach(function (s) {
            s.addEventListener('click', function () {
                rateEl.setAttribute('data-value', s.getAttribute('data-star'));
                renderStars();
                updatePreview();
            });
        });
    }
    renderStars();

    /* ─── Sliders ─── */
    document.getElementById('vol-slider').addEventListener('input', function (e) {
        document.getElementById('vol-value').textContent = e.target.value;
    });
    document.getElementById('budget-slider').addEventListener('input', function (e) {
        document.getElementById('budget-value').textContent = Number(e.target.value).toLocaleString('pt-BR');
    });

    /* ─── Wizard ─── */
    var step = 1;
    var stepContents = {
        1: '<div class="columns"><div class="column is-6"><div class="field"><label class="label">Nome</label><input class="input" placeholder="Nome completo" /></div></div><div class="column is-6"><div class="field"><label class="label">E-mail</label><input class="input" type="email" /></div></div></div>',
        2: '<div class="columns"><div class="column is-8"><div class="field"><label class="label">Endereço</label><input class="input" placeholder="Rua, número" /></div></div><div class="column is-4"><div class="field"><label class="label">Cidade</label><input class="input" /></div></div></div>',
        3: '<p style="font-size: 0.875rem; color: var(--tx-text-muted);">Confirme os dados antes de finalizar.</p>',
    };
    function renderStep() {
        document.querySelectorAll('#wizard-steps .tx-step').forEach(function (el) {
            var s = Number(el.getAttribute('data-step'));
            el.classList.remove('is-active', 'is-done');
            if (s === step) el.classList.add('is-active');
            else if (s < step) el.classList.add('is-done');
        });
        document.getElementById('step-content').innerHTML = stepContents[step];
        document.getElementById('prev-step').style.display = step > 1 ? 'inline-flex' : 'none';
        document.getElementById('next-step').style.display = step < 3 ? 'inline-flex' : 'none';
        document.getElementById('finish-step').style.display = step === 3 ? 'inline-flex' : 'none';
    }
    document.getElementById('next-step').addEventListener('click', function () { if (step < 3) { step++; renderStep(); } });
    document.getElementById('prev-step').addEventListener('click', function () { if (step > 1) { step--; renderStep(); } });
    document.getElementById('finish-step').addEventListener('click', function () { txStore.notifySuccess('Cadastro finalizado!'); });
    renderStep();

    /* ─── Form preview + validation ─── */
    var form = document.getElementById('register-form');
    function readForm() {
        var data = {};
        var fd = new FormData(form);
        for (var pair of fd.entries()) {
            if (pair[0] === 'perm') {
                if (!data.permissions) data.permissions = [];
                data.permissions.push(pair[1]);
            } else {
                data[pair[0]] = pair[1];
            }
        }
        // Checkboxes don't appear in FormData if unchecked
        data.active = form.elements['active'].checked;
        data.notifications = form.elements['notifications'].checked;
        data.rating = Number(rateEl.getAttribute('data-value'));
        return data;
    }
    function updatePreview() {
        document.getElementById('form-preview').textContent = JSON.stringify(readForm(), null, 2);
    }
    form.addEventListener('input', updatePreview);
    form.addEventListener('change', updatePreview);
    updatePreview();

    function clearErrors() {
        document.querySelectorAll('[data-error]').forEach(function (el) { el.style.display = 'none'; });
        form.querySelectorAll('.input, .select select').forEach(function (i) { i.classList.remove('is-danger'); });
    }
    function showError(name, msg) {
        var el = form.querySelector('[data-error="' + name + '"]');
        el.textContent = msg;
        el.style.display = 'block';
        var input = form.querySelector('[name="' + name + '"]');
        if (input) input.classList.add('is-danger');
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors();
        var data = readForm();
        var valid = true;
        if (!data.name) { showError('name', 'Nome é obrigatório'); valid = false; }
        if (!data.email) { showError('email', 'E-mail é obrigatório'); valid = false; }
        if (!data.password) { showError('password', 'Senha é obrigatória'); valid = false; }
        else if (data.password.length < 8) { showError('password', 'Mínimo 8 caracteres'); valid = false; }
        if (!data.profile) { showError('profile', 'Selecione um perfil'); valid = false; }
        if (!valid) return;

        var btn = document.getElementById('submit-btn');
        btn.classList.add('is-loading');
        setTimeout(function () {
            btn.classList.remove('is-loading');
            txStore.notifySuccess('Cadastro salvo com sucesso!');
        }, 800);
    });

    document.getElementById('reset-btn').addEventListener('click', function () {
        form.reset();
        clearErrors();
        rateEl.setAttribute('data-value', '4');
        renderStars();
        updatePreview();
    });
})();
