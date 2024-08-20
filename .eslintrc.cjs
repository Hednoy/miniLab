module.exports = {
  root: true,
  ignorePatterns: ["**/__generated__/*.{ts,tsx}", "codegen.ts"],
  overrides: [
    {
      files: "*.{cjs,tsx,ts,js,jsx}",
      extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
      ],
      env: {
        es2021: true,
        node: true,
      },
      globals: {
        cy: true,
      },
    },
    {
      files: "*.{tsx,ts,js,jsx}",
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 12,
        ecmaFeatures: {
          jsx: true,
        },
      },
      parser: "@typescript-eslint/parser",
      plugins: ["react", "react-hooks", "@typescript-eslint", "prettier"],
      rules: {
        "prettier/prettier": [
          "error",
          {
            endOfLine: "auto",
          },
        ],
        "@typescript-eslint/indent": "off",
        "no-unused-vars": "off",
        "require-await": "off",
        "array-bracket-spacing": [
          "error",
          "never",
          {
            arraysInArrays: false,
            singleValue: false,
          },
        ],
        "space-in-parens": ["error", "never"],
        "space-before-blocks": "error",
        "space-infix-ops": [
          2,
          {
            int32Hint: false,
          },
        ],
        "comma-spacing": [
          "error",
          {
            before: false,
            after: true,
          },
        ],
        "key-spacing": [
          "error",
          {
            beforeColon: false,
            afterColon: true,
          },
        ],
        "react/jsx-filename-extension": [
          "warn",
          {
            extensions: [".ts", ".tsx"],
          },
        ],
        "react/react-in-jsx-scope": "off",
        "react/jsx-first-prop-new-line": "error",
        "react/prop-types": "error",
        "react/jsx-closing-bracket-location": ["warn", "tag-aligned"],
        "react/jsx-tag-spacing": "warn",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/type-annotation-spacing": "error",
        "@typescript-eslint/explicit-module-boundary-types": "warn",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/keyword-spacing": ["error"],
        "jsx-quotes": ["warn", "prefer-double"],
        semi: 0,
        "arrow-spacing": "error",
        "no-trailing-spaces": ["error"],
        "no-whitespace-before-property": "error",
        // 'brace-style': [
        //   'error',
        //   '1tbs',
        //   {
        //     allowSingleLine: true,
        //   },
        // ],
        "react/jsx-space-before-closing": ["warn", "always"],
      },
      settings: {
        react: {
          version: "detect",
        },
      },
    },
  ],
};
