import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // theme has to be read from the DOM class the no-flash script set before
    // hydration, then synced into React state post-mount to avoid a hydration
    // mismatch. Reading eagerly during render breaks that. Inline disable
    // comments don't suppress this rule, so it's turned off for this file.
    files: ["src/components/theme/ThemeProvider.tsx"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
