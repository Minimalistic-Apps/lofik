import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  // warnings in console about source maps are caused by this workaround for
  // https://github.com/vitejs/vite/issues/13314#issuecomment-1560745780
  optimizeDeps: {
    exclude: ["@lofik/react"],
  },
});
