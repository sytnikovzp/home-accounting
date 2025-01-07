const js = require('@eslint/js');
const importPlugin = require('eslint-plugin-import');
const prettier = require('eslint-plugin-prettier');
const promise = require('eslint-plugin-promise');
const security = require('eslint-plugin-security');
const sequelize = require('eslint-plugin-sequelize');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        node: 'readonly',
        browser: 'readonly',
        es6: 'readonly',
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      promise,
      security,
      sequelize,
      import: importPlugin,
      prettier,
    },
    rules: {
      camelcase: ['warn', { properties: 'always' }],
      'comma-dangle': ['off', 'always-multiline'],
      'comma-spacing': [
        'warn',
        {
          before: false,
          after: true,
        },
      ],
      'eol-last': ['error', 'always'],
      indent: [
        'off',
        2,
        {
          MemberExpression: 1,
        },
      ],
      'no-multiple-empty-lines': ['error'],
      'no-new-symbol': ['error'],
      'no-trailing-spaces': ['error'],
      'no-undef': ['error'],
      'no-unused-vars': ['warn'],
      'object-curly-spacing': ['error', 'always'],
      'object-shorthand': ['error'],
      'prefer-const': ['error'],
      quotes: ['warn', 'single'],
      semi: ['error', 'always'],
      'space-in-parens': ['error', 'never'],
      strict: ['error', 'never'],
      'no-underscore-dangle': ['error', { allow: ['_id'] }],
      'promise/always-return': ['warn'],
      'promise/no-return-wrap': ['error'],
      'promise/catch-or-return': ['warn'],
      'prettier/prettier': ['warn'],
      'import/first': ['error'],
      'import/newline-after-import': ['warn'],
      'import/no-duplicates': ['error'],
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            ['sibling', 'index'],
          ],
          pathGroups: [
            {
              pattern: '{.,..,../..,../../..}/{app,config,db,models}{,/**}',
              group: 'internal',
              position: 'before',
            },
            {
              pattern:
                '{.,..,../..,../../..}/{constants,utils,errors,middlewares}{,/**}',
              group: 'internal',
              position: 'after',
            },
            {
              pattern:
                '{.,..,../..,../../..}/{routers,controllers,services}{,/**}',
              group: 'internal',
              position: 'after',
            },
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
];
