import { defineConfig } from "vitest/config";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "T",
      fileName: "index",
      formats: ["es", "cjs", "iife"],
    },
  },
  test: {
    environment: "happy-dom",
    include: [resolve(__dirname, "test/**")],
  },
  plugins: [dts()],
});
