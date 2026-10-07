import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTs from "eslint-config-next/typescript.js";

const eslintConfig = defineConfig([
  {
    ignores: [
      "public/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**"
    ],
  },
  ...nextVitals,
  ...nextTs,
  {
    linterOptions: {
      reportUnusedDisableDirectives: "off"
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/exhaustive-deps": "off",
      "react/no-children-prop": "off",
      "react-hooks/rules-of-hooks": "warn",
      "@next/next/no-html-link-for-pages": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "prefer-const": "off",
    }
  }
]);

export default eslintConfig;
