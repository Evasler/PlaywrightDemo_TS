// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  // tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
        parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname
        }
    },
    rules: {
        "no-empty-pattern": ["error", { "allowObjectPatternsAsParameters": true }],
        "@typescript-eslint/restrict-template-expressions": ["error", { "allowNumber": true }]
    }
  },
  {
    ignores: [
      "eslint.config.mjs"
    ]
  }
);