import { resolve } from "path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es", "cjs"],
    },
  },
  test: {
    environment: "happy-dom",
    include: [resolve(__dirname, "test/**")],
  },
  plugins: [dts()],
});
