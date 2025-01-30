const js = require('@eslint/js');
const importPlugin = require('eslint-plugin-import');
const regexopt = require('eslint-plugin-optimize-regex');
const prettier = require('eslint-plugin-prettier');
const promise = require('eslint-plugin-promise');
const sequelize = require('eslint-plugin-sequelize');
const sortkeys = require('eslint-plugin-sort-keys-fix');

module.exports = [
  {
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
        browser: 'readonly',
        console: 'readonly',
        es6: 'readonly',
        module: 'readonly',
        node: 'readonly',
        process: 'readonly',
        require: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      import: importPlugin,
      'optimize-regex': regexopt,
      prettier,
      promise,
      sequelize,
      'sort-keys-fix': sortkeys,
    },
    rules: {
      ...js.configs.recommended.rules,
      'array-bracket-newline': ['warn', 'consistent'],
      'array-callback-return': 'error',
      'arrow-body-style': 'warn',
      'block-scoped-var': 'error',
      'block-spacing': ['warn', 'always'],
      camelcase: ['warn', { properties: 'always' }],
      'capitalized-comments': ['off', 'always'],
      'class-methods-use-this': 'error',
      'comma-dangle': ['off', 'always-multiline'],
      'comma-spacing': [
        'warn',
        {
          after: true,
          before: false,
        },
      ],
      'consistent-return': 'warn',
      curly: ['warn', 'all'],
      'default-case': 'error',
      'default-case-last': 'error',
      'default-param-last': 'warn',
      'dot-location': ['warn', 'property'],
      'eol-last': ['error', 'always'],
      eqeqeq: 'error',
      'for-direction': 'error',
      'func-call-spacing': 'error',
      'func-name-matching': 'warn',
      'generator-star-spacing': 'error',
      'getter-return': 'error',
      'global-require': 'off',
      'guard-for-in': 'warn',
      'import/exports-last': 'warn',
      'import/first': 'error',
      'import/newline-after-import': ['warn', { count: 1 }],
      'import/no-absolute-path': 'error',
      'import/no-amd': 'error',
      'import/no-duplicates': 'error',
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'import/no-mutable-exports': 'error',
      'import/no-named-as-default': 'warn',
      'import/no-named-as-default-member': 'warn',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'import/order': [
        'warn',
        {
          alphabetize: { caseInsensitive: true, order: 'asc' },
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            ['sibling', 'index'],
          ],
          'newlines-between': 'always',
          pathGroups: [
            {
              group: 'internal',
              pattern: '{.,..,../..,../../..}/{app,config,db,models}{,/**}',
              position: 'before',
            },
            {
              group: 'internal',
              pattern:
                '{.,..,../..,../../..}/{constants,utils,errors,middlewares}{,/**}',
              position: 'after',
            },
            {
              group: 'internal',
              pattern:
                '{.,..,../..,../../..}/{routers,controllers,services}{,/**}',
              position: 'after',
            },
          ],
        },
      ],
      'init-declarations': ['warn', 'always'],
      'lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true },
      ],
      'max-classes-per-file': ['error', 1],
      'max-nested-callbacks': ['error', 5],
      'new-cap': 'off',
      'new-parens': 'error',
      'no-array-constructor': 'warn',
      'no-await-in-loop': 'error',
      'no-bitwise': 'warn',
      'no-caller': 'error',
      'no-confusing-arrow': 'error',
      'no-console': 'off',
      'no-const-assign': 'error',
      'no-constructor-return': 'error',
      'no-continue': 'error',
      'no-control-regex': 'error',
      'no-div-regex': 'error',
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-duplicate-imports': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-empty-character-class': 'error',
      'no-empty-function': 'error',
      'no-empty-pattern': 'error',
      'no-eval': 'error',
      'no-ex-assign': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-label': 'error',
      'no-extra-parens': ['error', 'functions'],
      'no-fallthrough': 'error',
      'no-floating-decimal': 'error',
      'no-func-assign': 'error',
      'no-implicit-coercion': 'error',
      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',
      'no-inline-comments': 'warn',
      'no-invalid-regexp': 'error',
      'no-invalid-this': 'error',
      'no-iterator': 'error',
      'no-label-var': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'warn',
      'no-lonely-if': 'warn',
      'no-loop-func': 'error',
      'no-mixed-operators': [
        'error',
        {
          groups: [
            ['*', '/', '%', '**'],
            ['+', '-'],
            ['&', '|', '^', '~', '<<', '>>', '>>>'],
            ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
            ['&&', '||'],
            ['in', 'instanceof'],
          ],
        },
      ],
      'no-mixed-requires': 'error',
      'no-multi-assign': 'warn',
      'no-multi-spaces': 'warn',
      'no-multi-str': 'warn',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-native-reassign': 'error',
      'no-negated-condition': 'error',
      'no-negated-in-lhs': 'error',
      'no-nested-ternary': 'warn',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-object': 'warn',
      'no-new-symbol': 'error',
      'no-new-wrappers': 'error',
      'no-obj-calls': 'error',
      'no-octal': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': 'error',
      'no-path-concat': 'error',
      'no-promise-executor-return': 'error',
      'no-proto': 'error',
      'no-redeclare': 'error',
      'no-regex-spaces': 'error',
      'no-restricted-globals': 'error',
      'no-restricted-syntax': [
        'error',
        'WithStatement',
        // {
        //   selector: "LogicalExpression[operator='||']",
        //   message:
        //     'Используйте ?? вместо || для проверки на null или undefined.',
        // },
      ],
      'no-return-assign': 'error',
      'no-return-await': 'error',
      'no-script-url': 'error',
      'no-self-assign': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-sparse-arrays': 'error',
      'no-template-curly-in-string': 'error',
      'no-this-before-super': 'error',
      'no-throw-literal': 'error',
      'no-trailing-spaces': 'warn',
      'no-undef': 'error',
      'no-undef-init': 'error',
      'no-undefined': 'warn',
      'no-underscore-dangle': ['error', { allow: ['_id'] }],
      'no-unmodified-loop-condition': 'error',
      'no-unneeded-ternary': 'error',
      'no-unreachable': 'error',
      'no-unreachable-loop': 'error',
      'no-unsafe-optional-chaining': [
        'warn',
        {
          disallowArithmeticOperators: true,
        },
      ],
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      'no-unused-labels': 'error',
      'no-unused-vars': 'warn',
      'no-use-before-define': 'error',
      'no-useless-backreference': 'error',
      'no-useless-call': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-concat': 'error',
      'no-useless-constructor': 'error',
      'no-useless-escape': 'error',
      'no-useless-rename': [
        'error',
        {
          ignoreDestructuring: false,
          ignoreExport: false,
          ignoreImport: false,
        },
      ],
      'no-useless-return': 'error',
      'no-var': 'error',
      'no-void': 'error',
      'no-warning-comments': 'warn',
      'no-with': 'error',
      'object-curly-newline': ['warn', { consistent: true }],
      'object-curly-spacing': ['warn', 'always'],
      'object-shorthand': 'warn',
      'one-var': ['warn', 'never'],
      'one-var-declaration-per-line': ['error', 'always'],
      'operator-assignment': 'error',
      'optimize-regex/optimize-regex': 'warn',
      'prefer-arrow-callback': 'warn',
      'prefer-const': ['warn', { destructuring: 'all' }],
      'prefer-destructuring': [
        'warn',
        {
          AssignmentExpression: {
            array: false,
            object: false,
          },
          VariableDeclarator: {
            array: true,
            object: true,
          },
        },
      ],
      'prefer-object-spread': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-regex-literals': 'error',
      'prefer-spread': 'warn',
      'prefer-template': 'warn',
      'prettier/prettier': 'warn',
      'promise/always-return': 'warn',
      'promise/catch-or-return': 'warn',
      'promise/no-return-wrap': 'error',
      'promise/prefer-await-to-then': 'warn',
      'require-atomic-updates': 'error',
      'require-await': 'error',
      'require-yield': 'error',
      'sort-keys-fix/sort-keys-fix': 'warn',
      'sort-vars': [
        'warn',
        {
          ignoreCase: true,
        },
      ],
      'space-in-parens': ['error', 'never'],
      'spaced-comment': 'error',
      strict: ['error', 'never'],
      'symbol-description': 'error',
      'valid-typeof': 'error',
      'vars-on-top': 'error',
      'wrap-regex': 'off',
      'yield-star-spacing': 'warn',
      yoda: 'error',
    },
  },
];
