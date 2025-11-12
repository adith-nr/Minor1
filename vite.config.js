import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// ✅ Full configuration for React + Privy + Clerk + ethers.js
export default defineConfig({
  plugins: [react()],

  // Fix for Node built-ins (Buffer, process, etc.) when using ethers in browser
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },

  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },

  // Optional: resolves "with { type: 'json' }" issues from Privy dependencies
  resolve: {
    alias: {
      // Ensure compatibility if needed later
      buffer: "buffer/",
    },
  },

  // Optional: remove overlay error popup
  server: {
    hmr: {
      overlay: true, // set to false if you want to hide error overlay
    },
  },
});
