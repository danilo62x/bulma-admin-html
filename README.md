# Bulma Admin / HTML

[Leia em português](./README.pt-BR.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE) ![Free](https://img.shields.io/badge/price-free-brightgreen)

Bulma Admin / HTML is the framework-free version of the Bulma admin layout: 25 static HTML pages with the same visual identity as the Vue, React, Angular and Laravel templates. There is no build step and no runtime dependency. Layout, menu, mock auth, theme switching and i18n are handled by a few small vanilla JS files, so the pages can be dropped into any backend. A light and dark theme, three languages and a PWA manifest with service worker are included.

Live preview: https://template.dev.br/preview/bulma-admin-html/

## Pages included

25 HTML pages at the repo root:

- index.html: public landing page with hero, feature and pricing sections
- login.html: sign-in form with mock credentials
- register.html: account creation form
- forgot-password.html: request form for a reset link
- reset-password.html: form to set a new password
- dashboard.html: KPI stat cards with sparklines, charts and recent activity
- charts.html: analytics with bar, area and donut charts drawn as inline SVG by `assets/js/pages/charts.js` (no chart library)
- forms.html: inputs, selects, date picker, file upload and validation
- tables.html: data table with sorting, filtering, pagination and row selection
- components.html: catalog of the base UI components
- ui-advanced.html: modals, tabs, toasts and other composite widgets
- typography.html: type scale, headings and text helpers
- integrations.html: third-party service cards with toggles
- profile.html: user page with personal data and activity
- pricing.html: plan comparison
- settings.html: application preferences, theme and language
- inbox.html: mail-style app screen with folders and message list
- file-manager.html: file listing with folders and file actions
- gallery.html: image grid
- invoice.html: printable invoice detail
- billing.html: payment methods and invoice history
- documentation.html: in-app reference page for the template
- maintenance.html: standalone downtime page
- coming-soon.html: standalone pre-launch page
- not-found.html: 404 error page

## Tech stack

- HTML5, CSS3 and vanilla JavaScript (no framework, no bundler)
- Bulma 1.0.4 and Material Design Icons 7.4.47, loaded from the jsDelivr CDN by default
- Optional build script (`build.js`, Node + Sass 1.83) that compiles Bulma to a local file for offline use
- PWA: `manifest.webmanifest` + `sw.js`

## Requirements

- A browser. Node.js is only needed for the optional local server or the optional Bulma build.

## Getting started

No build step: open `index.html` directly in the browser, or serve the folder over HTTP:

```bash
npx serve .
```

Authentication is simulated in `assets/js/auth.js` (localStorage). Demo credentials:

- `admin@template.com` / `admin123`
- `user@template.com` / `user123`

## Optional offline build

The pages link Bulma and the icon font from the jsDelivr CDN. To ship a self-contained bundle:

```bash
npm install
npm run build   # compiles Bulma from Sass to assets/css/bulma.css
```

Then swap the CDN `<link>` in the pages for `<link rel="stylesheet" href="assets/css/bulma.css" />`. `npm run watch` recompiles on change.

## Project structure

```
*.html                 25 pages (dashboard.html, login.html, ...)
assets/
├── css/               variables.css, dark.css, app.css, bulma.css (built output)
├── i18n/              en.json, es.json, pt-BR.json
└── js/
    ├── state.js       shared state helpers (localStorage)
    ├── auth.js        mock login, logout, route guard
    ├── menu.js        sidebar menu definition
    ├── layout.js      injects header, sidebar and footer into each page
    ├── i18n.js        translates [data-i18n] elements
    ├── pwa.js         service worker registration
    └── pages/         charts.js, tables.js, forms.js, components.js, pricing.js, settings.js
components/            source HTML fragments for the layout and ui pieces
build.js               optional Bulma compile script
sw.js                  service worker
manifest.webmanifest   PWA manifest
```

## Theming and customization

Design tokens are CSS custom properties with the `--tx-` prefix in `assets/css/variables.css`: primary color (#485fc7), semantic colors, sidebar and header dimensions, and a spacing scale. `assets/css/dark.css` overrides those tokens for the dark theme, toggled from the header, and `assets/css/app.css` holds the component styles built on top of Bulma. Since Bulma comes from the CDN by default, changing Bulma Sass variables requires the optional build step.

## Internationalization

`assets/js/i18n.js` translates elements marked with `data-i18n` using the JSON dictionaries in `assets/i18n/` (English, Spanish, Brazilian Portuguese). The default locale is pt-BR and the choice persists in localStorage.

## The same layout in other stacks

This repo is one of five implementations of the same Bulma admin layout. Each one has the same 25 views and the same visual identity:

- Vue 3 + Buefy: https://github.com/danilo62x/bulma-admin-buefy
- React 19: https://github.com/danilo62x/bulma-admin-react
- Angular 19: https://github.com/danilo62x/bulma-admin-angular
- Laravel 11 + Blade: https://github.com/danilo62x/bulma-admin-laravel

The full catalog of free and paid templates is at https://template.dev.br

## Support this project

This template is free and MIT licensed. If it saves you time, you can support the work with a donation at https://template.dev.br/doar?template=bulma-admin-html

## License

[MIT](./LICENSE), copyright 2026 Danilo Quinelato.
