import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'warn',
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'eslint-disable-next-line': 'off',
    },
  },
];
