import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Unit + component тест. E2E (Playwright) нь e2e/ хавтаст тусдаа ажиллана.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    unstubGlobals: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/app/**/layout.tsx"],
      reporter: ["text", "html", "lcov"],
      // Мөнгө, сагс, захиалгын логик — эдгээр файл доош унавал CI унана
      thresholds: {
        "src/lib/cart.ts": { lines: 90, branches: 85, functions: 90 },
        "src/lib/products.ts": { lines: 100, functions: 100 },
        "src/app/actions/order.ts": { lines: 95, branches: 90, functions: 100 },
      },
    },
  },
});
