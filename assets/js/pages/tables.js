(function () {
    'use strict';
    if (!txAuth.requireAuth()) return;
    txLayout.init({ current: 'tables.html', pageTitle: 'Tabelas' });

    var avatarColors = ['#485fc7', '#48c774', '#3273dc', '#f59e0b', '#f14668', '#9b59b6', '#1abc9c', '#e67e22'];
    var names = ['João Silva', 'Maria Santos', 'Carlos Lima', 'Ana Costa', 'Pedro Oliveira', 'Lucia Fernandes', 'Roberto Alves', 'Fernanda Ramos', 'Thiago Souza', 'Camila Barbosa', 'Diego Martins', 'Beatriz Carvalho', 'Rodrigo Pereira', 'Juliana Rocha', 'Marcelo Gomes', 'Patricia Teixeira', 'Anderson Lima', 'Renata Moreira', 'Felipe Nascimento', 'Claudia Ribeiro'];
    var handles = ['joao', 'maria', 'carlos', 'ana', 'pedro', 'lucia', 'roberto', 'fernanda', 'thiago', 'camila', 'diego', 'beatriz', 'rodrigo', 'juliana', 'marcelo', 'patricia', 'anderson', 'renata', 'felipe', 'claudia'];
    var phones = ['(11) 98765-4321', '(21) 99876-5432', '(41) 97654-3210', '(31) 96543-2109', '(51) 95432-1098', '(71) 94321-0987', '(85) 93210-9876', '(92) 92109-8765', '(81) 91098-7654', '(11) 90987-6543', '(21) 89876-5432', '(41) 88765-4321', '(31) 87654-3210', '(51) 86543-2109', '(11) 85432-1098', '(21) 84321-0987', '(41) 83210-9876', '(31) 82109-8765', '(51) 81098-7654', '(11) 80987-6543'];

    var users = [];
    for (var i = 0; i < 20; i++) {
        users.push({
            id: i + 1, name: names[i], email: handles[i] + '@empresa.com', phone: phones[i],
            role: ['Administrador', 'Gerente', 'Operador', 'Visualizador', 'Operador'][i % 5],
            status: i % 5 === 3 ? 'Inativo' : 'Ativo',
            date: String((i % 28) + 1).padStart(2, '0') + '/' + String((i % 12) + 1).padStart(2, '0') + '/2025',
            color: avatarColors[i % avatarColors.length],
        });
    }

    var search = '';
    var perPage = 10;
    var currentPage = 1;
    var sortField = 'id';
    var sortDir = 1;
    var checked = new Set();
    var editingUser = null;
    var deletingUser = null;

    function filtered() {
        var q = search.toLowerCase();
        var rows = q ? users.filter(function (r) {
            return r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.role.toLowerCase().includes(q);
        }) : users.slice();
        rows.sort(function (a, b) {
            return (a[sortField] < b[sortField] ? -1 : a[sortField] > b[sortField] ? 1 : 0) * sortDir;
        });
        return rows;
    }
    function totalPages() { return Math.max(1, Math.ceil(filtered().length / perPage)); }
    function paged() { return filtered().slice((currentPage - 1) * perPage, currentPage * perPage); }

    function renderTable() {
        var rows = paged();
        var tbody = document.getElementById('users-tbody');
        if (rows.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8"><div class="tx-table-empty"><span class="mdi mdi-magnify tx-table-empty-icon"></span>Nenhum resultado encontrado</div></td></tr>';
            return;
        }
        tbody.innerHTML = rows.map(function (r) {
            return '<tr>' +
                '<td><input type="checkbox" data-check="' + r.id + '" ' + (checked.has(r.id) ? 'checked' : '') + ' /></td>' +
                '<td><span class="tx-row-id">#' + r.id + '</span></td>' +
                '<td><div class="tx-row-name"><div class="tx-row-avatar" style="--avatar-color: ' + r.color + ';">' + r.name[0] + '</div>' + r.name + '</div></td>' +
                '<td><a href="mailto:' + r.email + '" style="color: var(--tx-text);">' + r.email + '</a></td>' +
                '<td><span class="tag is-light">' + r.role + '</span></td>' +
                '<td class="has-text-centered"><span class="tag ' + (r.status === 'Ativo' ? 'is-success is-light' : 'is-danger is-light') + '"><span class="mdi ' + (r.status === 'Ativo' ? 'mdi-check-circle' : 'mdi-close-circle') + '"></span> ' + r.status + '</span></td>' +
                '<td>' + r.date + '</td>' +
                '<td><div class="tx-row-actions"><button class="button is-small is-info is-outlined" data-edit="' + r.id + '"><span class="mdi mdi-pencil"></span></button><button class="button is-small is-danger is-outlined" data-del="' + r.id + '"><span class="mdi mdi-delete"></span></button></div></td>' +
                '</tr>';
        }).join('');

        tbody.querySelectorAll('[data-check]').forEach(function (cb) {
            cb.addEventListener('change', function () {
                var id = Number(cb.getAttribute('data-check'));
                if (cb.checked) checked.add(id);
                else checked.delete(id);
                updateBulkBar();
            });
        });
        tbody.querySelectorAll('[data-edit]').forEach(function (b) {
            b.addEventListener('click', function () { openEdit(Number(b.getAttribute('data-edit'))); });
        });
        tbody.querySelectorAll('[data-del]').forEach(function (b) {
            b.addEventListener('click', function () { openDelete(Number(b.getAttribute('data-del'))); });
        });

        var pagedIds = rows.map(function (r) { return r.id; });
        var allChecked = pagedIds.length > 0 && pagedIds.every(function (id) { return checked.has(id); });
        document.getElementById('check-all').checked = allChecked;
    }

    function renderFooter() {
        document.getElementById('users-count').textContent = 'Exibindo ' + filtered().length + ' de ' + users.length + ' registros';
        var tp = totalPages();
        var pag = document.getElementById('pagination');
        if (tp <= 1) { pag.innerHTML = ''; return; }
        var pages = [];
        for (var p = 1; p <= tp; p++) pages.push(p);
        pag.innerHTML = '<button class="pagination-previous" ' + (currentPage === 1 ? 'disabled' : '') + ' data-prev>Anterior</button>' +
            '<button class="pagination-next" ' + (currentPage === tp ? 'disabled' : '') + ' data-next>Próximo</button>' +
            '<ul class="pagination-list">' + pages.map(function (p) {
                return '<li><button class="pagination-link ' + (p === currentPage ? 'is-current' : '') + '" data-page="' + p + '">' + p + '</button></li>';
            }).join('') + '</ul>';
        pag.querySelectorAll('[data-page]').forEach(function (b) {
            b.addEventListener('click', function () { currentPage = Number(b.getAttribute('data-page')); renderAll(); });
        });
        pag.querySelector('[data-prev]').addEventListener('click', function () { if (currentPage > 1) { currentPage--; renderAll(); } });
        pag.querySelector('[data-next]').addEventListener('click', function () { if (currentPage < tp) { currentPage++; renderAll(); } });
    }

    function updateBulkBar() {
        var c = checked.size;
        var bar = document.getElementById('bulk-bar');
        if (c > 0) {
            bar.style.display = 'flex';
            document.getElementById('bulk-count').textContent = c;
        } else {
            bar.style.display = 'none';
        }
    }

    function renderAll() {
        renderTable();
        renderFooter();
        updateBulkBar();
    }

    /* ─── Search / sort ─── */
    document.getElementById('user-search').addEventListener('input', function (e) {
        search = e.target.value; currentPage = 1; renderAll();
    });
    document.querySelectorAll('[data-sort]').forEach(function (th) {
        th.addEventListener('click', function () {
            var f = th.getAttribute('data-sort');
            if (sortField === f) sortDir = -sortDir;
            else { sortField = f; sortDir = 1; }
            renderAll();
        });
    });
    document.getElementById('per-page').addEventListener('change', function (e) {
        perPage = Number(e.target.value); currentPage = 1; renderAll();
    });
    document.getElementById('check-all').addEventListener('change', function (e) {
        var pagedIds = paged().map(function (r) { return r.id; });
        if (e.target.checked) pagedIds.forEach(function (id) { checked.add(id); });
        else pagedIds.forEach(function (id) { checked.delete(id); });
        renderAll();
    });

    /* ─── Bulk actions ─── */
    document.getElementById('bulk-clear').addEventListener('click', function () { checked.clear(); renderAll(); });
    document.getElementById('bulk-delete').addEventListener('click', function () {
        var ids = Array.from(checked);
        users = users.filter(function (r) { return !checked.has(r.id); });
        checked.clear();
        txStore.notifySuccess(ids.length + ' usuário(s) excluído(s)!');
        renderAll();
    });

    /* ─── Modals ─── */
    function openModal(id) { document.getElementById(id).classList.add('is-active'); }
    function closeModal(id) { document.getElementById(id).classList.remove('is-active'); }
    document.querySelectorAll('[data-close-modal]').forEach(function (el) {
        el.addEventListener('click', function () { closeModal(el.getAttribute('data-close-modal')); });
    });

    document.getElementById('open-add').addEventListener('click', function () {
        editingUser = null;
        document.getElementById('modal-user-title').textContent = 'Novo Usuário';
        document.getElementById('uf-name').value = '';
        document.getElementById('uf-email').value = '';
        document.getElementById('uf-phone').value = '';
        document.getElementById('uf-role').value = 'Operador';
        document.getElementById('uf-active').checked = true;
        document.getElementById('uf-active-label').textContent = 'Ativo';
        openModal('modal-user');
    });

    function openEdit(id) {
        var u = users.find(function (r) { return r.id === id; });
        if (!u) return;
        editingUser = u;
        document.getElementById('modal-user-title').textContent = 'Editar Usuário';
        document.getElementById('uf-name').value = u.name;
        document.getElementById('uf-email').value = u.email;
        document.getElementById('uf-phone').value = u.phone;
        document.getElementById('uf-role').value = u.role;
        document.getElementById('uf-active').checked = u.status === 'Ativo';
        document.getElementById('uf-active-label').textContent = u.status === 'Ativo' ? 'Ativo' : 'Inativo';
        openModal('modal-user');
    }

    document.getElementById('uf-active').addEventListener('change', function (e) {
        document.getElementById('uf-active-label').textContent = e.target.checked ? 'Ativo' : 'Inativo';
    });

    document.getElementById('uf-save').addEventListener('click', function () {
        var name = document.getElementById('uf-name').value.trim();
        var email = document.getElementById('uf-email').value.trim();
        if (!name || !email) return;
        var data = {
            name: name, email: email,
            phone: document.getElementById('uf-phone').value,
            role: document.getElementById('uf-role').value,
            status: document.getElementById('uf-active').checked ? 'Ativo' : 'Inativo',
        };
        if (editingUser) {
            Object.assign(editingUser, data);
            txStore.notifySuccess('Usuário atualizado!');
        } else {
            users.push(Object.assign({
                id: Math.max.apply(null, users.map(function (r) { return r.id; })) + 1,
                date: new Date().toLocaleDateString('pt-BR'),
                color: avatarColors[users.length % avatarColors.length],
            }, data));
            txStore.notifySuccess('Usuário criado!');
        }
        closeModal('modal-user');
        renderAll();
    });

    function openDelete(id) {
        deletingUser = users.find(function (r) { return r.id === id; });
        if (!deletingUser) return;
        document.getElementById('del-name').textContent = deletingUser.name;
        openModal('modal-delete');
    }

    document.getElementById('confirm-delete').addEventListener('click', function () {
        if (!deletingUser) return;
        users = users.filter(function (r) { return r.id !== deletingUser.id; });
        checked.delete(deletingUser.id);
        closeModal('modal-delete');
        txStore.notifySuccess('Usuário excluído!');
        renderAll();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') document.querySelectorAll('.modal.is-active').forEach(function (m) { m.classList.remove('is-active'); });
    });

    renderAll();
})();
