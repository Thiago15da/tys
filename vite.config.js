import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  /**
   * Base relativa, a propósito.
   *
   * En GitHub Pages el sitio vive en /tys/ mientras sea un "project page", y
   * pasa a servirse desde la raíz el día que le enchufes un dominio propio.
   * Con `./` los assets se resuelven contra el documento y andan en los dos
   * casos: cuando conectemos el dominio no hay que recompilar ni tocar nada.
   *
   * Funciona porque esto es una sola página sin router. Si algún día agregás
   * rutas del lado del cliente, hay que volver a una base absoluta.
   */
  base: './',
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173 },
})
