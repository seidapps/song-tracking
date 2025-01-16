import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { tempo } from "tempo-devtools/dist/vite"

const conditionalPlugins: string[] = []
if (process.env.TEMPO) {
  conditionalPlugins.push('tempo-devtools/dist/babel-plugin')
}

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [...conditionalPlugins]
      }
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
