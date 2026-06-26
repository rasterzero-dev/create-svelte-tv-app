import { svelte } from '@sveltejs/vite-plugin-svelte';
import legacy from '@vitejs/plugin-legacy';
import { svelteTvFonts } from 'svelte-tv/vite';
import { defineConfig } from 'vite';

const charset =
  ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' +
  '.,:;!?-_/()[]';

export default defineConfig({
  define: {
    __DEV__: true,
    __RTT__: true,
    __renderTextBatching__: true,
    __enableCompressedTextures__: true,
    __calculateFps__: true,
    LIGHTNING_DOM_RENDERING: true,
  },
  plugins: [
    svelteTvFonts({
      charsets: {
        '*': { charset },
      },
    }),
    svelte(),
    legacy({
      targets: ['chrome>=49', 'not IE 11'],
      additionalLegacyPolyfills: ['whatwg-fetch'],
      modernPolyfills: ['es.global-this'],
      assumptions: {
        setPublicClassFields: true,
        privateFieldsAsProperties: true,
        constantSuper: true,
        noClassCalls: true,
        noDocumentAll: true,
      },
    }),
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: false,
      mangle: false,
      format: {
        comments: false,
        beautify: true,
      },
    },
    sourcemap: false,
  },
  server: {
    port: 5174,
    hmr: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});
