import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const appRoot = fileURLToPath(new URL('./event budget/eventbudget-eventbudget-pro/', import.meta.url))

export default defineConfig({
  root: appRoot,
  plugins: [react()],
})
