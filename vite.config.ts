import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { tempo } from "tempo-devtools/dist/vite"

const conditionalPlugins: [string, Record<string, any>][] = []
if (process.env.TEMPO) {
  conditionalPlugins.push(['tempo-devtools/swc', {}])
}

export default defineConfig({
  plugins: [
    react({
      plugins: [...conditionalPlugins]
    }),
    tempo()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      plugins: []
    }
  },
  json: {
    stringify: true
  }
})
