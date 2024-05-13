import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintImport from 'eslint-plugin-import';
import deprecationPlugin from 'eslint-plugin-deprecation';

export default tseslint.config(
  {
    ignores: [
      'temp.js',
      '.prettierrc.js',
      '**/coverage/**/*',
      '**/dist/**/*',
      '**/jest.config.js',
      '.eslintrc.js',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      deprecation: deprecationPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.base.json',
      },
    },
    rules: deprecationPlugin.configs.recommended.rules,
  },
  {
    plugins: {
      import: eslintImport,
    },
    rules: {
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['builtin', 'external', ['parent', 'sibling'], 'index'],
          pathGroups: [
            {
              pattern: '@4bitlabs/*',
              group: 'parent',
              position: 'before',
            },
          ],
          distinctGroup: false,
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
    },
  },
  {
    rules: {
      'no-constant-condition': ['error', { checkLoops: false }],
      '@typescript-eslint/no-shadow': ['error', { allow: ['_'] }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { ignoreRestSiblings: true },
      ],
    },
  },
);
