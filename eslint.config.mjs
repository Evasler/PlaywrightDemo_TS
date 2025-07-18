// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwrighteslint from 'eslint-plugin-playwright';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  playwrighteslint.configs['flat/recommended'],
  {
    languageOptions: {
        parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname
        }
    },
    rules: {
        "no-empty-pattern": ["error", { "allowObjectPatternsAsParameters": true }],
        "@typescript-eslint/restrict-template-expressions": ["error", { "allowNumber": true }],
        "playwright/no-standalone-expect": "off",
        "playwright/no-conditional-in-test": "off",
        "playwright/expect-expect": "off",
        "playwright/valid-title": "off"
    },
    settings: {
      "playwright": {
        "globalAliases": {
          "test": ["test", "extendedTest"]
        }
      }
    }
  },
  {
    ignores: [
      "eslint.config.mjs"
    ]
  }
);