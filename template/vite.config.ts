import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTvFonts } from 'svelte-tv/vite';
import { defineConfig } from 'vite';

const charset =
  ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' +
  '.,:;!?-_/()[]';

export default defineConfig({
  plugins: [
    svelteTvFonts({
      charsets: {
        '*': { charset },
      },
    }),
    svelte(),
  ],
});
