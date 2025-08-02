// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import playwrighteslint from "eslint-plugin-playwright";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  playwrighteslint.configs["flat/recommended"],
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-empty-pattern": ["error", { allowObjectPatternsAsParameters: true }],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            // Note: Ideally, we'd want an src/helpers/index.ts barrel export. However, with the current structure, this leads to circular dependencies.
            // {
            //   "regex": "/helpers/(?!index\.js)",
            //   "message": "Exported modules of \"helpers\" directory are listed in \/helpers\/index.js. Please import from there instead."
            // },
            {
              regex: "/pages/(?!index\.js)",
              message:
                'Exported modules of "pages" directory are listed in \/pages\/index.js. Please import from there instead.',
            },
            {
              regex: "/services/(?!index\.js)",
              message:
                'Exported modules of "services" directory are listed in \/services\/index.js. Please import from there instead.',
            },
            {
              regex: "/types/(?!index\.js)",
              message:
                'Exported modules of "types" directory are listed in \/types\/index.js. Please import from there instead.',
            },
            {
              regex: "/utils/(?!index\.js)",
              message:
                'Exported modules of "utils" directory are listed in \/utils\/index.js. Please import from there instead.',
            },
          ],
        },
      ],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
      "playwright/no-standalone-expect": "off",
      "playwright/no-conditional-in-test": "off",
      "playwright/expect-expect": "off",
      "playwright/valid-title": "off",
    },
    settings: {
      playwright: {
        globalAliases: {
          test: ["test", "extendedTest"],
        },
      },
    },
  },
  {
    ignores: ["eslint.config.mjs"],
  },
  eslintConfigPrettier,
);
