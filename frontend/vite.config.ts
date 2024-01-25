import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import commonjs from 'vite-plugin-commonjs';
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    commonjs({
      filter(id) {
        if (id.includes('node_modules/redux-storage/build-es')) {
          return true;
        }
      },
    }),
    react(),],
    base: './',
    server: {
      host: true,
      port: 3000, // This is the port which we will use in docker
      // Thanks @sergiomoura for the window fix
      // add the next lines if you're using windows and hot reload doesn't work

    }
    

})
