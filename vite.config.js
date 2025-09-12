import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  // Allow override via env: VITE_BASE
  const base = process.env.VITE_BASE || '/CabinetsSite/'
  return {
    base,
    plugins: [react()],
  }
})
