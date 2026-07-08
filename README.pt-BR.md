# Bulma Admin / HTML

[Read in English](./README.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE) ![Free](https://img.shields.io/badge/price-free-brightgreen)

Bulma Admin / HTML é a versão sem framework do layout admin em Bulma: 25 páginas HTML estáticas com a mesma identidade visual dos templates Vue, React, Angular e Laravel. Não há etapa de build nem dependência de runtime. Layout, menu, autenticação simulada, troca de tema e i18n são resolvidos por alguns arquivos pequenos de JavaScript puro, então as páginas podem ser coladas em qualquer backend. Inclui tema claro e escuro, três idiomas e manifest de PWA com service worker.

Preview ao vivo: https://template.dev.br/preview/bulma-admin-html/

## Páginas incluídas

25 páginas HTML na raiz do repositório:

- index.html: landing page pública com hero, seções de recursos e preços
- login.html: formulário de acesso com credenciais de demonstração
- register.html: formulário de criação de conta
- forgot-password.html: solicitação de link de redefinição de senha
- reset-password.html: definição de nova senha
- dashboard.html: cards de KPI com sparklines, gráficos e atividade recente
- charts.html: analytics com gráficos de barra, área e rosca desenhados como SVG inline por `assets/js/pages/charts.js` (sem biblioteca de gráficos)
- forms.html: inputs, selects, date picker, upload de arquivos e validação
- tables.html: tabela de dados com ordenação, filtros, paginação e seleção de linhas
- components.html: catálogo dos componentes base de UI
- ui-advanced.html: modais, abas, toasts e outros widgets compostos
- typography.html: escala tipográfica, títulos e utilitários de texto
- integrations.html: cards de serviços de terceiros com toggles
- profile.html: página do usuário com dados pessoais e atividade
- pricing.html: comparação de planos
- settings.html: preferências da aplicação, tema e idioma
- inbox.html: tela estilo cliente de e-mail com pastas e lista de mensagens
- file-manager.html: listagem de arquivos com pastas e ações
- gallery.html: grade de imagens
- invoice.html: detalhe de fatura pronto para impressão
- billing.html: formas de pagamento e histórico de faturas
- documentation.html: página de referência do template dentro do app
- maintenance.html: página avulsa de manutenção
- coming-soon.html: página avulsa de pré-lançamento
- not-found.html: página de erro 404

## Stack

- HTML5, CSS3 e JavaScript puro (sem framework, sem bundler)
- Bulma 1.0.4 e Material Design Icons 7.4.47, carregados do CDN jsDelivr por padrão
- Script de build opcional (`build.js`, Node + Sass 1.83) que compila o Bulma para um arquivo local, para uso offline
- PWA: `manifest.webmanifest` + `sw.js`

## Requisitos

- Um navegador. Node.js só é necessário para o servidor local opcional ou para o build opcional do Bulma.

## Como rodar

Sem build: abra o `index.html` direto no navegador, ou sirva a pasta por HTTP:

```bash
npx serve .
```

A autenticação é simulada em `assets/js/auth.js` (localStorage). Credenciais de demonstração:

- `admin@template.com` / `admin123`
- `user@template.com` / `user123`

## Build offline opcional

As páginas carregam o Bulma e a fonte de ícones do CDN jsDelivr. Para gerar um pacote autocontido:

```bash
npm install
npm run build   # compila o Bulma do Sass para assets/css/bulma.css
```

Depois troque o `<link>` do CDN nas páginas por `<link rel="stylesheet" href="assets/css/bulma.css" />`. O `npm run watch` recompila a cada mudança.

## Estrutura do projeto

```
*.html                 25 páginas (dashboard.html, login.html, ...)
assets/
├── css/               variables.css, dark.css, app.css, bulma.css (saída do build)
├── i18n/              en.json, es.json, pt-BR.json
└── js/
    ├── state.js       helpers de estado compartilhado (localStorage)
    ├── auth.js        login simulado, logout, guarda de rota
    ├── menu.js        definição do menu lateral
    ├── layout.js      injeta header, sidebar e footer em cada página
    ├── i18n.js        traduz elementos [data-i18n]
    ├── pwa.js         registro do service worker
    └── pages/         charts.js, tables.js, forms.js, components.js, pricing.js, settings.js
components/            fragmentos HTML de origem das peças de layout e ui
build.js               script opcional de compilação do Bulma
sw.js                  service worker
manifest.webmanifest   manifest de PWA
```

## Tema e customização

Os tokens de design são custom properties CSS com prefixo `--tx-` em `assets/css/variables.css`: cor primária (#485fc7), cores semânticas, dimensões de sidebar e header e uma escala de espaçamento. O `assets/css/dark.css` sobrescreve esses tokens para o tema escuro, alternado pelo header, e o `assets/css/app.css` guarda os estilos de componentes construídos sobre o Bulma. Como o Bulma vem do CDN por padrão, mudar variáveis Sass do Bulma exige o build opcional.

## Internacionalização

O `assets/js/i18n.js` traduz elementos marcados com `data-i18n` usando os dicionários JSON de `assets/i18n/` (inglês, espanhol e português do Brasil). O locale padrão é pt-BR e a escolha persiste no localStorage.

## O mesmo layout em outras stacks

Este repositório é uma das cinco implementações do mesmo layout admin em Bulma. Todas têm as mesmas 25 views e a mesma identidade visual:

- Vue 3 + Buefy: https://github.com/danilo62x/bulma-admin-buefy
- React 19: https://github.com/danilo62x/bulma-admin-react
- Angular 19: https://github.com/danilo62x/bulma-admin-angular
- Laravel 11 + Blade: https://github.com/danilo62x/bulma-admin-laravel

O catálogo completo de templates gratuitos e pagos está em https://template.dev.br

## Apoie o projeto

Este template é gratuito e licenciado sob MIT. Se ele economizou seu tempo, você pode apoiar o trabalho com uma doação em https://template.dev.br/doar?template=bulma-admin-html

## Licença

[MIT](./LICENSE), copyright 2026 Danilo Quinelato.
