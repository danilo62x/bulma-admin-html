(function () {
    'use strict';
    if (!txAuth.requireAuth()) return;
    txLayout.init({ current: 'charts.html', pageTitle: 'Gráficos & Analytics' });

    function spark(vals) {
        var W = 60, H = 30, p = 2;
        var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), rng = (mx - mn) || 1;
        var pts = vals.map(function (v, i) {
            return { x: p + (i / (vals.length - 1)) * (W - 2 * p), y: H - p - ((v - mn) / rng) * (H - 2 * p - 3) };
        });
        var line = pts.map(function (pt, i) { return (i === 0 ? 'M' : 'L') + pt.x + ',' + pt.y; }).join(' ');
        return { line: line, area: line + ' L' + (W - p) + ',' + H + ' L' + p + ',' + H + ' Z' };
    }

    /* ─── Stats ─── */
    var stats = [
        { key: 'rev', label: 'Receita Total', value: 'R$ 665k', trend: '+23.4% no ano', trendUp: true, icon: 'mdi-currency-brl', color: '#485fc7', vals: [42, 38, 51, 45, 67, 58, 72, 65, 78, 83, 71, 95] },
        { key: 'ord', label: 'Pedidos', value: '1.284', trend: '+8.2% no mês', trendUp: true, icon: 'mdi-cart', color: '#48c774', vals: [120, 135, 128, 142, 158, 165, 172, 168, 180, 192, 185, 198] },
        { key: 'cus', label: 'Clientes', value: '1.480', trend: '+31.2% no ano', trendUp: true, icon: 'mdi-account-group', color: '#3273dc', vals: [820, 910, 880, 950, 1020, 1150, 1230, 1290, 1310, 1380, 1420, 1480] },
        { key: 'cvr', label: 'Conversão', value: '6.2%', trend: '+0.8pp no mês', trendUp: true, icon: 'mdi-percent', color: '#f59e0b', vals: [3.2, 3.8, 3.5, 4.1, 4.4, 4.2, 4.8, 5.1, 4.9, 5.4, 5.8, 6.2] },
    ];

    document.getElementById('chart-stats-row').innerHTML = stats.map(function (s) {
        var sp = spark(s.vals);
        return '<div class="column is-3-desktop is-6-tablet is-12-mobile"><div class="tx-stats-card">' +
            '<div class="tx-stats-icon" style="--icon-color: ' + s.color + ';"><span class="mdi ' + s.icon + '"></span></div>' +
            '<div class="tx-stats-info"><div class="tx-stats-value">' + s.value + '</div><div class="tx-stats-label">' + s.label + '</div>' +
            '<div class="tx-stats-trend ' + (s.trendUp ? 'has-text-success' : 'has-text-danger') + '">' +
            '<span class="mdi ' + (s.trendUp ? 'mdi-trending-up' : 'mdi-trending-down') + '"></span>' + s.trend + '</div></div>' +
            '<div class="tx-sparkline"><svg width="60" height="30" viewBox="0 0 60 30">' +
            '<defs><linearGradient id="sg-' + s.key + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="' + s.color + '" stop-opacity="0.45"/><stop offset="100%" stop-color="' + s.color + '" stop-opacity="0"/></linearGradient></defs>' +
            '<path d="' + sp.area + '" fill="url(#sg-' + s.key + ')"/>' +
            '<path d="' + sp.line + '" fill="none" stroke="' + s.color + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg></div></div></div>';
    }).join('');

    /* ─── Bar chart ─── */
    (function () {
        var W = 700, H = 260, pl = 46, pr = 10, pt = 20, pb = 28;
        var cW = W - pl - pr, cH = H - pt - pb;
        var months = [
            { month: 'Jan', value: 42 }, { month: 'Fev', value: 38 }, { month: 'Mar', value: 51 },
            { month: 'Abr', value: 45 }, { month: 'Mai', value: 67 }, { month: 'Jun', value: 58 },
            { month: 'Jul', value: 72 }, { month: 'Ago', value: 65 }, { month: 'Set', value: 78 },
            { month: 'Out', value: 83 }, { month: 'Nov', value: 71 }, { month: 'Dez', value: 95 },
        ];
        var max = 100, slot = cW / months.length, bw = Math.max(slot * 0.58, 18), bp = (slot - bw) / 2;
        var bars = months.map(function (d, i) {
            var h = (d.value / max) * cH;
            return { x: pl + i * slot + bp, y: pt + cH - h, w: bw, h: h, month: d.month, value: d.value };
        });
        var grid = [0, 20, 40, 60, 80, 100].map(function (v) {
            return { y: pt + cH - (v / max) * cH, label: v === 0 ? '0' : v + 'k' };
        });
        var html = grid.map(function (g) {
            return '<line x1="' + pl + '" y1="' + g.y + '" x2="690" y2="' + g.y + '" stroke="var(--tx-border)" stroke-width="1" stroke-dasharray="4 4"/>' +
                '<text x="' + (pl - 6) + '" y="' + (g.y + 4) + '" text-anchor="end" font-size="9.5" fill="var(--tx-text-muted)">' + g.label + '</text>';
        }).join('') + bars.map(function (b, i) {
            return '<rect x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h + '" fill="#485fc7" rx="4" ry="4" opacity="0.85" data-bar="' + i + '" class="tx-bar-rect"/>' +
                '<text x="' + (b.x + b.w / 2) + '" y="255" text-anchor="middle" font-size="9" fill="var(--tx-text-muted)">' + b.month + '</text>';
        }).join('');
        document.getElementById('bar-chart').innerHTML = html;
        var rects = document.querySelectorAll('#bar-chart .tx-bar-rect');
        rects.forEach(function (r) {
            r.addEventListener('mouseenter', function () { rects.forEach(function (x) { x.setAttribute('opacity', '0.3'); }); r.setAttribute('opacity', '0.85'); });
            r.addEventListener('mouseleave', function () { rects.forEach(function (x) { x.setAttribute('opacity', '0.85'); }); });
        });
    })();

    /* ─── Donut chart ─── */
    (function () {
        var r = 65, C = 2 * Math.PI * r;
        var raw = [
            { label: 'Orgânico', pct: 38, color: '#485fc7' },
            { label: 'Social', pct: 27, color: '#48c774' },
            { label: 'Direto', pct: 20, color: '#3273dc' },
            { label: 'E-mail', pct: 15, color: '#f59e0b' },
        ];
        var cum = 0;
        var segments = raw.map(function (d) {
            var dash = (d.pct / 100) * C;
            var rot = -90 + cum * 3.6;
            cum += d.pct;
            return Object.assign({}, d, { dash: dash, rot: rot });
        });
        document.getElementById('donut-chart').innerHTML =
            '<circle cx="90" cy="90" r="65" fill="none" stroke="var(--tx-border)" stroke-width="24"/>' +
            segments.map(function (s) {
                return '<circle cx="90" cy="90" r="65" fill="none" stroke="' + s.color + '" stroke-width="24" stroke-dasharray="' + s.dash + ' ' + (C - s.dash) + '" transform="rotate(' + s.rot + ', 90, 90)" stroke-linecap="butt"/>';
            }).join('') +
            '<text x="90" y="86" text-anchor="middle" font-size="20" font-weight="700" fill="var(--tx-text-heading)">24.8k</text>' +
            '<text x="90" y="103" text-anchor="middle" font-size="10" fill="var(--tx-text-muted)">Visitantes</text>';

        document.getElementById('donut-legend').innerHTML = segments.map(function (s) {
            return '<div class="tx-donut-leg-item"><span class="tx-legend-dot" style="background:' + s.color + ';"></span><span class="tx-leg-label">' + s.label + '</span><span class="tx-leg-val">' + s.pct + '%</span></div>';
        }).join('');
    })();

    /* ─── Area chart ─── */
    (function () {
        var W = 860, H = 220, pl = 48, pr = 15, pt = 14, pb = 26;
        var cW = W - pl - pr, cH = H - pt - pb;
        var d1 = [820, 940, 880, 1020, 1150, 1080, 1230, 1180, 1350, 1290, 1420, 1380, 1510, 1460, 1620, 1580, 1740, 1690, 1820, 1760, 1950, 1880, 2040, 2120];
        var d2 = [510, 590, 540, 620, 700, 660, 730, 720, 810, 790, 850, 830, 910, 880, 960, 940, 1010, 990, 1060, 1030, 1120, 1080, 1150, 1200];
        var mx = 2200, n = d1.length;
        function pts(data) { return data.map(function (v, i) { return { x: pl + (i / (n - 1)) * cW, y: pt + cH - (v / mx) * cH }; }); }
        function smooth(p, closed) {
            var d = 'M' + p[0].x + ',' + p[0].y;
            for (var i = 0; i < p.length - 1; i++) {
                var dx = (p[i + 1].x - p[i].x) * 0.38;
                d += ' C' + (p[i].x + dx) + ',' + p[i].y + ' ' + (p[i + 1].x - dx) + ',' + p[i + 1].y + ' ' + p[i + 1].x + ',' + p[i + 1].y;
            }
            if (closed) d += ' L' + p[p.length - 1].x + ',' + (pt + cH) + ' L' + p[0].x + ',' + (pt + cH) + ' Z';
            return d;
        }
        var p1 = pts(d1), p2 = pts(d2);
        var grid = [0, 500, 1000, 1500, 2000].map(function (v) { return { y: pt + cH - (v / mx) * cH, label: v === 0 ? '0' : (v / 1000) + 'k' }; });
        var xLabels = [0, 4, 8, 12, 16, 20, 23].map(function (i) { return { x: pl + (i / (n - 1)) * cW, text: 'S' + (i + 1) }; });
        var html = '<defs>' +
            '<linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#485fc7" stop-opacity="0.28"/><stop offset="100%" stop-color="#485fc7" stop-opacity="0"/></linearGradient>' +
            '<linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#48c774" stop-opacity="0.2"/><stop offset="100%" stop-color="#48c774" stop-opacity="0"/></linearGradient>' +
            '</defs>';
        html += grid.map(function (g) {
            return '<line x1="' + pl + '" y1="' + g.y + '" x2="' + (W - 10) + '" y2="' + g.y + '" stroke="var(--tx-border)" stroke-width="1" stroke-dasharray="4 4"/>' +
                '<text x="' + (pl - 6) + '" y="' + (g.y + 4) + '" text-anchor="end" font-size="9" fill="var(--tx-text-muted)">' + g.label + '</text>';
        }).join('');
        html += xLabels.map(function (l) {
            return '<text x="' + l.x + '" y="' + (H - 4) + '" text-anchor="middle" font-size="9" fill="var(--tx-text-muted)">' + l.text + '</text>';
        }).join('');
        html += '<path d="' + smooth(p2, true) + '" fill="url(#ag2)"/>';
        html += '<path d="' + smooth(p1, true) + '" fill="url(#ag1)"/>';
        html += '<path d="' + smooth(p2) + '" fill="none" stroke="#48c774" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        html += '<path d="' + smooth(p1) + '" fill="none" stroke="#485fc7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
        document.getElementById('area-chart').innerHTML = html;
    })();

    /* ─── Top products ─── */
    var topProducts = [
        { name: 'Monitor 27" 4K', revenue: 'R$ 147.2k', units: 67, pct: 100, icon: 'mdi-monitor', color: '#3273dc' },
        { name: 'Licença Office 365', revenue: 'R$ 121.8k', units: 445, pct: 83, icon: 'mdi-microsoft-office', color: '#e67e22' },
        { name: 'Teclado Mecânico', revenue: 'R$ 65.3k', units: 142, pct: 44, icon: 'mdi-keyboard', color: '#485fc7' },
        { name: 'Hub USB-C 7 em 1', revenue: 'R$ 58.8k', units: 327, pct: 40, icon: 'mdi-usb-port', color: '#1abc9c' },
        { name: 'SSD NVMe 1TB', revenue: 'R$ 54.2k', units: 198, pct: 37, icon: 'mdi-harddisk', color: '#f59e0b' },
    ];
    document.getElementById('top-products').innerHTML = topProducts.map(function (p, i) {
        return '<div class="tx-top-row">' +
            '<div class="tx-top-rank">' + (i + 1) + '</div>' +
            '<div class="tx-top-icon" style="background: color-mix(in srgb, ' + p.color + ' 13%, transparent); color: ' + p.color + ';"><span class="mdi ' + p.icon + '"></span></div>' +
            '<div class="tx-top-info"><div class="tx-top-name">' + p.name + '</div><div class="tx-bar-track"><div class="tx-bar-fill" style="width:' + p.pct + '%; background:' + p.color + ';"></div></div></div>' +
            '<div class="tx-top-vals"><div class="tx-top-revenue">' + p.revenue + '</div><div class="tx-top-units">' + p.units + ' un.</div></div>' +
            '</div>';
    }).join('');

    /* ─── Funnel ─── */
    var funnel = [
        { label: 'Visitantes', count: 24800, pct: 100, color: '#485fc7', rate: '' },
        { label: 'Leads', count: 8920, pct: 36, color: '#3273dc', rate: '36.0%' },
        { label: 'Prospects', count: 3140, pct: 12.7, color: '#48c774', rate: '35.2%' },
        { label: 'Oportunidades', count: 1290, pct: 5.2, color: '#f59e0b', rate: '41.1%' },
        { label: 'Clientes', count: 312, pct: 1.3, color: '#48c774', rate: '24.2%' },
    ];
    document.getElementById('funnel').innerHTML = funnel.map(function (s) {
        return '<div class="tx-funnel-step">' +
            '<div class="tx-funnel-header"><span class="tx-funnel-label">' + s.label + '</span><span class="tx-funnel-count">' + s.count.toLocaleString('pt-BR') + '</span></div>' +
            '<div class="tx-funnel-track"><div class="tx-funnel-fill" style="width:' + s.pct + '%; background:' + s.color + ';"></div></div>' +
            (s.rate ? '<div class="tx-funnel-rate">↳ ' + s.rate + ' conversão</div>' : '') +
            '</div>';
    }).join('');
})();
