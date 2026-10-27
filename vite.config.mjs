import { defineConfig } from 'vite';

// examples/index.html は ../js/scroll-hint.js を参照するため、
// root はプロジェクトルートのままにして静的アセットとして配信する。
export default defineConfig({
  server: {
    open: '/examples/index.html'
  }
});
