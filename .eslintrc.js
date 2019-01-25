module.exports = {
  extends: ['eslint:recommended'],
  plugins: ['prettier'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    mocha: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8,
  },
  rules: {
    'object-curly-spacing': [2, 'always'],
    strict: 0,
    quotes: [2, 'single', 'avoid-escape'],
    semi: [1, 'always'],
    'keyword-spacing': [2, { before: true, after: true }],
    'space-infix-ops': 2,
    'spaced-comment': [2, 'always'],
    'arrow-spacing': 2,
    'no-console': 0,
  },
};