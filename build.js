/*
 * Build step — compiles Bulma to a local, minified stylesheet so the template
 * works fully offline (no CDN needed) and any Bulma classes used across the
 * new pages are guaranteed to be present.
 *
 * Output: assets/css/bulma.css
 *
 * The HTML pages load Bulma from the jsDelivr CDN by default. After running
 * `npm run build`, you may swap the CDN <link> for:
 *     <link rel="stylesheet" href="assets/css/bulma.css" />
 * to ship a self-contained bundle.
 */
const fs = require('fs');
const path = require('path');
const sass = require('sass');

const SRC = path.resolve(__dirname, 'node_modules/bulma/bulma.scss');
const OUT_DIR = path.resolve(__dirname, 'assets/css');
const OUT = path.join(OUT_DIR, 'bulma.css');

function build() {
  const start = Date.now();
  const result = sass.compile(SRC, {
    style: 'compressed',
    loadPaths: [path.resolve(__dirname, 'node_modules')],
    quietDeps: true,
    silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'mixed-decls'],
  });
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT, result.css);
  const kb = (Buffer.byteLength(result.css) / 1024).toFixed(1);
  console.log(`✓ Bulma compiled → assets/css/bulma.css (${kb} KB) in ${Date.now() - start}ms`);
}

build();

if (process.argv.includes('--watch')) {
  console.log('Watching node_modules/bulma for changes…');
  fs.watch(path.dirname(SRC), { recursive: true }, () => {
    try {
      build();
    } catch (e) {
      console.error(e.message);
    }
  });
}
