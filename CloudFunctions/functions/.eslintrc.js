module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'google',
  ],
  rules: {
    'quotes': ['error', 'single'],
    'linebreak-style': 0,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
};
