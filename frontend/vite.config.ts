import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  ssr: {
    noExternal: ["react-syntax-highlighter"]
  },
  optimizeDeps: {
    include: ["react-syntax-highlighter"]
  },
  server: {
    proxy: {
      // Proxy API requests to the Rust backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Proxy docs requests to the Rust backend
      '/docs': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Proxy OpenAPI spec requests to the Rust backend
      '/api-docs': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});
