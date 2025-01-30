const js = require('@eslint/js');
const importPlugin = require('eslint-plugin-import');
const regexopt = require('eslint-plugin-optimize-regex');
const prettier = require('eslint-plugin-prettier');
const promise = require('eslint-plugin-promise');
const sequelize = require('eslint-plugin-sequelize');

module.exports = [
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
      sequelize,
      import: importPlugin,
      'optimize-regex': regexopt,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
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
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-new-symbol': 'error',
      'no-trailing-spaces': 'warn',
      'no-undef': 'error',
      'no-unused-vars': 'warn',
      'object-curly-spacing': ['warn', 'always'],
      'object-shorthand': 'warn',
      'prefer-const': ['warn', { destructuring: 'all' }],
      'space-in-parens': ['error', 'never'],
      strict: ['error', 'never'],
      'no-underscore-dangle': ['error', { allow: ['_id'] }],
      'promise/always-return': 'warn',
      'promise/no-return-wrap': 'error',
      'promise/catch-or-return': 'warn',
      'prettier/prettier': 'warn',
      'import/first': 'error',
      'import/newline-after-import': ['warn', { count: 1 }],
      'import/no-duplicates': 'error',
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
      eqeqeq: 'error',
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      'no-param-reassign': 'error',
      'prefer-template': 'warn',
      'no-throw-literal': 'error',
      'no-undefined': 'warn',
      'capitalized-comments': ['off', 'always'],
      curly: ['warn', 'all'],
      'no-await-in-loop': 'error',
      'require-await': 'error',
      'prefer-object-spread': 'error',
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
      'no-var': 'error',
      'no-use-before-define': 'error',
      'consistent-return': 'warn',
      'default-case-last': 'error',
      'no-lonely-if': 'warn',
      'no-multi-str': 'warn',
      'no-unreachable-loop': 'error',
      'prefer-spread': 'warn',
      'no-duplicate-imports': 'error',
      'no-empty-function': 'error',
      'no-extra-parens': ['error', 'functions'],
      'max-nested-callbacks': ['error', 5],
      'no-implicit-globals': 'error',
      'prefer-arrow-callback': 'warn',
      'global-require': 'off',
      'no-mixed-requires': 'error',
      'no-restricted-globals': 'error',
      'no-const-assign': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-multi-assign': 'warn',
      'no-undef-init': 'error',
      'prefer-promise-reject-errors': 'error',
      'no-warning-comments': 'warn',
      'no-implicit-coercion': 'error',
      'no-invalid-this': 'error',
      'require-atomic-updates': 'error',
      'no-return-await': 'error',
      'block-scoped-var': 'error',
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-keys': 'error',
      'no-unreachable': 'error',
      'no-duplicate-case': 'error',
      'valid-typeof': 'error',
      'require-yield': 'error',
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'no-eval': 'error',
      'no-new-wrappers': 'error',
      'no-loop-func': 'error',
      'no-void': 'error',
      'prefer-regex-literals': 'error',
      'no-self-compare': 'error',
      'no-obj-calls': 'error',
      'no-template-curly-in-string': 'error',
      'no-useless-concat': 'error',
      'no-promise-executor-return': 'error',
      'default-case': 'error',
      'import/no-absolute-path': 'error',
      'no-continue': 'error',
      'no-unmodified-loop-condition': 'error',
      'spaced-comment': 'error',
      'max-classes-per-file': ['error', 1],
      'no-extra-bind': 'error',
      'no-iterator': 'error',
      'no-extend-native': 'error',
      'no-useless-call': 'error',
      'no-useless-constructor': 'error',
      'import/no-self-import': 'error',
      'no-bitwise': 'warn',
      'no-confusing-arrow': 'error',
      'no-useless-computed-key': 'error',
      'no-ex-assign': 'error',
      'no-useless-return': 'error',
      'no-useless-backreference': 'error',
      'import/no-useless-path-segments': 'error',
      'no-implied-eval': 'error',
      'no-new': 'error',
      'no-sequences': 'error',
      'array-callback-return': 'error',
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-useless-rename': [
        'error',
        {
          ignoreDestructuring: false,
          ignoreImport: false,
          ignoreExport: false,
        },
      ],
      'symbol-description': 'error',
      'no-constructor-return': 'error',
      yoda: 'error',
      'operator-assignment': 'error',
      'no-native-reassign': 'error',
      'no-path-concat': 'error',
      'no-regex-spaces': 'error',
      'getter-return': 'error',
      'no-caller': 'error',
      'import/no-mutable-exports': 'error',
      'no-new-object': 'warn',
      'no-unneeded-ternary': 'error',
      'no-div-regex': 'error',
      'no-extra-label': 'error',
      'no-floating-decimal': 'error',
      'no-labels': 'error',
      'no-new-func': 'error',
      'no-negated-condition': 'error',
      'one-var': ['warn', 'never'],
      'no-octal': 'error',
      'no-redeclare': 'error',
      'no-self-assign': 'error',
      'no-useless-escape': 'error',
      'no-empty-character-class': 'error',
      'no-empty-pattern': 'error',
      'no-fallthrough': 'error',
      'class-methods-use-this': 'error',
      'no-lone-blocks': 'warn',
      'init-declarations': ['warn', 'always'],
      'new-cap': 'off',
      'new-parens': 'error',
      'default-param-last': 'warn',
      'no-octal-escape': 'error',
      'no-script-url': 'error',
      'guard-for-in': 'warn',
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
      'no-sparse-arrays': 'error',
      'no-this-before-super': 'error',
      'no-func-assign': 'error',
      'no-invalid-regexp': 'error',
      'no-with': 'error',
      'block-spacing': ['warn', 'always'],
      'func-call-spacing': 'error',
      'vars-on-top': 'error',
      'lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true },
      ],
      'dot-location': ['warn', 'property'],
      'no-nested-ternary': 'warn',
      'wrap-regex': 'off',
      'no-label-var': 'error',
      'import/exports-last': 'warn',
      'import/no-named-as-default': 'warn',
      'arrow-body-style': 'warn',
      'no-multi-spaces': 'warn',
      'object-curly-newline': ['warn', { consistent: true }],
      'for-direction': 'error',
      'generator-star-spacing': 'error',
      'one-var-declaration-per-line': ['error', 'always'],
      'import/no-amd': 'error',
      'no-control-regex': 'error',
      'no-negated-in-lhs': 'error',
      'no-unused-labels': 'error',
      'sort-vars': [
        'warn',
        {
          ignoreCase: true,
        },
      ],
      'func-name-matching': 'warn',
      'no-array-constructor': 'warn',
      'import/no-named-as-default-member': 'warn',
      'array-bracket-newline': ['warn', 'consistent'],
      'yield-star-spacing': 'warn',
      'promise/prefer-await-to-then': 'warn',
      'optimize-regex/optimize-regex': 'warn',
      'no-unsafe-optional-chaining': [
        'warn',
        {
          disallowArithmeticOperators: true,
        },
      ],
      'no-restricted-syntax': [
        'error',
        'WithStatement',
        // {
        //   selector: "LogicalExpression[operator='||']",
        //   message:
        //     'Используйте ?? вместо || для проверки на null или undefined.',
        // },
      ],
      'no-console': 'off',
      'no-inline-comments': 'warn',
    },
  },
];
