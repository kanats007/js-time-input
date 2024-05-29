import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

/** @see https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules */
const __dirname = dirname(fileURLToPath(import.meta.url));

/** @see https://typescript-eslint.io/getting-started/typed-linting */
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  /** @see https://typescript-eslint.io/troubleshooting/#i-get-errors-telling-me-eslint-was-configured-to-run--however-that-tsconfig-does-not--none-of-those-tsconfigs-include-this-file */
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    rules: {
      'no-console': 'error',
    },
  },
  /** @see https://github.com/prettier/eslint-config-prettier?tab=readme-ov-file#installation */
  eslintConfigPrettier,
);
