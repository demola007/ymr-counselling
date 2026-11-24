import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 8080,
    // Polling keeps HMR working when the source is bind-mounted into the dev container.
    watch: process.env.CHOKIDAR_USEPOLLING ? { usePolling: true, interval: 300 } : undefined,
  },
  preview: { host: true, port: 8080 },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
          charts: ["recharts"],
          xlsx: ["xlsx"],
        },
      },
    },
  },
});
