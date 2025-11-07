import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  //we then set the server
  server: {
    //https settings
    https: {
      //and pass our private kep, and certificate files (like the backend)
      key: fs.readFileSync('./certs/localhost+1-key.pem'),
      cert: fs.readFileSync('./certs/localhost+1.pem'),
    },
    port: 5174,
  }
})
