import { readFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));

const banner = `/*!
 * scroll-hint v${pkg.version}
 * (c) ${pkg.author}
 * Released under the MIT License.
 */`;

const iife = {
  entry: { 'scroll-hint': 'src/index.js' },
  outDir: 'js',
  format: ['iife'],
  globalName: 'ScrollHint',
  target: 'es2017',
  clean: false,
  sourcemap: false,
  dts: false,
  banner: { js: banner },
  // esbuild の iife は `export default` を `.default` に残すため、
  // 従来の `window.ScrollHint` (クラス直参照) と互換にするため unwrap する。
  footer: { js: 'ScrollHint = ScrollHint.default;' },
  outExtension: () => ({ js: '.js' })
};

export default defineConfig([
  {
    entry: { index: 'src/index.js' },
    outDir: 'lib',
    format: ['cjs', 'esm'],
    target: 'es2017',
    clean: true,
    sourcemap: false,
    dts: false,
    // 従来 (babel-plugin-add-module-exports) と同じく `require('scroll-hint')` でクラスを直接返す。
    footer: (ctx) => (ctx.format === 'cjs' ? { js: 'module.exports = module.exports.default;' } : undefined)
  },
  { ...iife, clean: true },
  {
    ...iife,
    entry: { 'scroll-hint.min': 'src/index.js' },
    minify: true
  }
]);
