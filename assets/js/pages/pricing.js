(function () {
    'use strict';
    if (!txAuth.requireAuth()) return;
    txLayout.init({ current: 'pricing.html', pageTitle: 'Planos & Preços' });

    var annual = false;
    var openFaq = 0;

    var plans = [
        { key: 'basic', name: 'Básico', desc: 'Ideal para pequenas equipes iniciando.', priceMonthly: 99, priceAnnual: 79, cta: 'Começar grátis', featured: false, color: '#48c774', icon: 'mdi-leaf',
          features: [
            { text: 'Até 3 usuários', included: true },
            { text: '5 GB de armazenamento', included: true },
            { text: 'Relatórios básicos', included: true },
            { text: 'Suporte por e-mail', included: true },
            { text: 'API de integração', included: false },
            { text: 'White-label', included: false },
            { text: 'Suporte prioritário', included: false },
            { text: 'SLA garantido', included: false },
          ] },
        { key: 'pro', name: 'Profissional', desc: 'Para equipes em crescimento.', priceMonthly: 249, priceAnnual: 199, cta: 'Assinar agora', featured: true, color: '#485fc7', icon: 'mdi-rocket-launch',
          features: [
            { text: 'Até 15 usuários', included: true },
            { text: '50 GB de armazenamento', included: true },
            { text: 'Relatórios avançados', included: true },
            { text: 'Suporte por chat', included: true },
            { text: 'API completa', included: true },
            { text: 'White-label parcial', included: true },
            { text: 'Suporte prioritário', included: false },
            { text: 'SLA garantido', included: false },
          ] },
        { key: 'enterprise', name: 'Empresarial', desc: 'Solução completa para grandes empresas.', priceMonthly: 699, priceAnnual: 559, cta: 'Falar com vendas', featured: false, color: '#f59e0b', icon: 'mdi-office-building',
          features: [
            { text: 'Usuários ilimitados', included: true },
            { text: 'Armazenamento ilimitado', included: true },
            { text: 'Analytics em tempo real', included: true },
            { text: 'Suporte 24/7', included: true },
            { text: 'API + Webhooks', included: true },
            { text: 'White-label completo', included: true },
            { text: 'Gerente de conta', included: true },
            { text: 'SLA 99.9%', included: true },
          ] },
    ];

    var faqs = [
        { q: 'Posso trocar de plano a qualquer momento?', a: 'Sim! Upgrade/downgrade a qualquer momento, com cálculo pro-rata.' },
        { q: 'Como funciona o teste?', a: '14 dias grátis, sem cartão de crédito.' },
        { q: 'Desconto para startups/ONGs?', a: '40% para startups com menos de 2 anos e 60% para ONGs registradas.' },
        { q: 'Os dados ficam seguros?', a: 'Criptografia TLS 1.3 em trânsito, AES-256 em repouso. Compliance LGPD/GDPR.' },
        { q: 'Posso cancelar sem multa?', a: 'Planos mensais sem multa. Anuais encerram no fim do ciclo pago.' },
    ];

    function renderPlans() {
        document.getElementById('plans-row').innerHTML = plans.map(function (plan) {
            var price = annual ? plan.priceAnnual : plan.priceMonthly;
            return '<div class="column is-4-desktop is-6-tablet"><div class="tx-plan-card ' + (plan.featured ? 'tx-plan-featured' : '') + '">' +
                (plan.featured ? '<div class="tx-plan-badge">Mais Popular</div>' : '') +
                '<div class="tx-plan-header">' +
                '  <div class="tx-plan-icon" style="background: color-mix(in srgb, ' + plan.color + ' 15%, transparent); color: ' + plan.color + ';"><span class="mdi ' + plan.icon + '"></span></div>' +
                '  <div class="tx-plan-name">' + plan.name + '</div>' +
                '  <div class="tx-plan-desc">' + plan.desc + '</div>' +
                '</div>' +
                '<div class="tx-plan-price"><span class="tx-price-currency">R$</span><span class="tx-price-amount">' + price + '</span><span class="tx-price-period">/mês</span></div>' +
                (annual ? '<div class="tx-price-note">Cobrado anualmente (R$ ' + (plan.priceAnnual * 12) + '/ano)</div>' : '') +
                '<button class="button tx-plan-cta is-fullwidth ' + (plan.featured ? 'is-primary' : 'is-light') + '" data-plan="' + plan.name + '">' + plan.cta + '</button>' +
                '<ul class="tx-plan-features">' + plan.features.map(function (f) {
                    return '<li class="tx-feat-item">' +
                        '<span class="mdi tx-feat-icon ' + (f.included ? 'mdi-check-circle' : 'mdi-close-circle') + '" style="color: ' + (f.included ? '#48c774' : 'var(--tx-border)') + ';"></span>' +
                        '<span class="' + (f.included ? '' : 'tx-feat-disabled') + '">' + f.text + '</span>' +
                        '</li>';
                }).join('') + '</ul>' +
                '</div></div>';
        }).join('');
        document.querySelectorAll('[data-plan]').forEach(function (b) {
            b.addEventListener('click', function () { txStore.notifySuccess('Plano ' + b.getAttribute('data-plan') + ' selecionado!'); });
        });
    }

    function renderFaqs() {
        document.getElementById('faq-list').innerHTML = faqs.map(function (faq, i) {
            return '<div class="tx-collapse-item">' +
                '<div class="tx-collapse-trigger" data-faq="' + i + '">' +
                '  <span class="tx-collapse-label">' + faq.q + '</span>' +
                '  <span class="mdi tx-collapse-chevron ' + (openFaq === i ? 'mdi-chevron-up' : 'mdi-chevron-down') + '"></span>' +
                '</div>' +
                (openFaq === i ? '<div class="tx-collapse-body" style="padding-left:1rem;">' + faq.a + '</div>' : '') +
                '</div>';
        }).join('');
        document.querySelectorAll('[data-faq]').forEach(function (el) {
            el.addEventListener('click', function () {
                var i = Number(el.getAttribute('data-faq'));
                openFaq = (openFaq === i ? null : i);
                renderFaqs();
            });
        });
    }

    var toggle = document.getElementById('annual-toggle');
    var labelM = document.getElementById('label-monthly');
    var labelA = document.getElementById('label-annual');
    var save = document.getElementById('save-badge');
    toggle.addEventListener('change', function () {
        annual = toggle.checked;
        labelM.className = annual ? '' : 'tx-toggle-active';
        labelA.className = annual ? 'tx-toggle-active' : '';
        save.style.display = annual ? 'inline-flex' : 'none';
        renderPlans();
    });
    renderPlans();
    renderFaqs();
})();
