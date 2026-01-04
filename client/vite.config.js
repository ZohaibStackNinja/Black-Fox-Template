// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // ⬅️ ADD THE SERVER CONFIGURATION HERE
  server: {
    proxy: {
      // Any requests starting with '/api' (e.g., /api/projects)
      '/api': {
        // Will be forwarded to this target (your Express backend)
        target: 'http://localhost:5000',
        // Important for host-header rewriting
        changeOrigin: true, 
        // Optional: Rewrites the path by removing '/api' before sending to the backend
        // Since your Express routes start with '/api' (e.g., app.use("/api/projects", ...)),
        // we'll keep the path as-is by omitting the rewrite.
      }
    }
  }
});