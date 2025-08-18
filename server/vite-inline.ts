// server/vite-inline.ts
import type { Express } from "express";
import { createServer as createViteServer } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

export async function setupViteInline(app: Express) {
  const vite = await createViteServer({
    configFile: false,                   // ← ignore vite.config.ts
    root: path.resolve(root, "client"),
    plugins: [react()],                  // ← only official React plugin
    server: { middlewareMode: true, hmr: { overlay: true } },
    resolve: { alias: { "@": path.resolve(root, "client/src") } },
    build: { outDir: path.resolve(root, "dist/public"), emptyOutDir: true },
  });

  app.use(vite.middlewares);
}