import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Unplugin from '../src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    Unplugin({
      fileName: 'detect-update-version.json',
      worker: {
        enable: true,
        fileName: 'detect-update-worker.js',
      },
    }),
  ],
})
