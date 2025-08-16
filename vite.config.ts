import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwind from "@tailwindcss/postcss";
import path from "path";
import { fileURLToPath } from "url";

// ESM replacements for __filename/__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src")}
  },
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
});
