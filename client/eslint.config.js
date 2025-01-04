import { builtinModules } from 'module';

import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default [
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['dist'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-filename-extension': [
        'warn',
        {
          extensions: ['.js', '.jsx'],
        },
      ],
      'no-underscore-dangle': [
        'error',
        {
          allow: ['_id'],
        },
      ],
      camelcase: ['warn', { properties: 'always' }],
      'react/jsx-no-target-blank': 'off',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      'no-undef': 'error',
      'no-unused-vars': 'error',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            [`^(${builtinModules.join('|')})(/|$)`],
            [
              '^react',
              '^react-router-dom',
              '^react-redux',
              '^@reduxjs/toolkit',
              '^redux-logger',
              '^axios',
              '^chart.js',
              '^react-chartjs-2',
              '^date-fns',
              '^formik',
              '^yup',
              '^@mui/',
              '^@mui/x-date-pickers',
              '^@mui/icons-material',
              '^@mui/material/styles',
              '^@?\\w',
            ],
            [
              '^.*\\/constants($|\\/.*$)',
              '^.*\\/utils($|\\/.*$)',
              '^.*\\/api($|\\/.*$)',
              '^.*\\/rest($|\\/.*$)',
              '^.*\\/hooks($|\\/.*$)',
              '^.*\\/services($|\\/.*$)',
            ],
            ['^.*\\/components($|\\/.*$)'],
            ['^.*\\/pages($|\\/.*$)'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.*\\/assets($|\\/.*$)', '^.*\\/styles($|\\/.*$)', '^.*\\.css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'prettier/prettier': 'warn',
      'react/sort-comp': [
        'warn',
        {
          order: [
            'type-annotations',
            'static-methods',
            'lifecycle',
            'render',
            'everything-else',
          ],
        },
      ],
      'react/jsx-sort-props': [
        'warn',
        {
          ignoreCase: true,
          callbacksLast: true,
          shorthandFirst: true,
          reservedFirst: true,
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-no-undef': 'error',
      'sort-vars': [
        'warn',
        {
          ignoreCase: false,
        },
      ],
      'no-else-return': ['error', { allowElseIf: false }],
      'lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true },
      ],
      'import/extensions': [
        'warn',
        'never',
        { json: 'always', css: 'always', scss: 'always' },
      ],
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'react/function-component-definition': [
        'error',
        { namedComponents: 'function-declaration' },
      ],
    },
  },
];
