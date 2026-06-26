import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTvFonts } from 'svelte-tv/vite';
import { defineConfig } from 'vite';

const charset =
  ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' +
  '.,:;!?-_/()[]';

function queueMicrotaskPolyfillPlugin() {
  const polyfill =
    "if(typeof queueMicrotask!=='function'){self.queueMicrotask=function(fn){Promise.resolve().then(fn).catch(function(e){setTimeout(function(){throw e},0);});};}";

  return {
    name: 'queue-microtask-polyfill',
    transformIndexHtml(html) {
      return html.replace('<head>', `<head>\n  <script>${polyfill}</script>`);
    },
  };
}

export default defineConfig(({ mode }) => ({
  define: {
    __DEV__: mode !== 'production',
    __RTT__: false,
    __renderTextBatching__: true,
    __enableCompressedTextures__: false,
    __calculateFps__: true,
    LIGHTNING_DOM_RENDERING: false,
  },
  plugins: [
    queueMicrotaskPolyfillPlugin(),
    svelteTvFonts({
      charsets: {
        '*': { charset },
      },
    }),
    svelte(),
  ],
  build: {
    target: 'chrome69',
    modulePreload: false,
    rollupOptions: {
      output: {
        format: 'iife',
      },
    },
    minify: false,
    sourcemap: false,
  },
}));
