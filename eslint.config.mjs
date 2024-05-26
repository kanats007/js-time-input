import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import { env } from "process";


/** @see https://typescript-eslint.io/getting-started */
export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    env: {
      node: true,
    },
    rules: {
      "no-console": "warn",
    }
  },
  /** @see https://github.com/prettier/eslint-config-prettier?tab=readme-ov-file#installation */
  eslintConfigPrettier,
];