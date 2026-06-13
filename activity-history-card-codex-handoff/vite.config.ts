import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/activity-history-card.ts",
      name: "ActivityHistoryCard",
      formats: ["es"],
      fileName: () => "activity-history-card.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    sourcemap: true,
    target: "es2022",
  },
});
