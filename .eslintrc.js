module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jasmine: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  ignorePatterns: ["dist/", "docs/"],
  rules: {
    "semi": ["error", "never"],
    "space-before-function-paren": ["error", "never"],
    "object-curly-newline": ["error", {
      "multiline": true,
      "minProperties": 4,
    }],
    "no-use-before-define": "off",
    "no-plusplus": "off",
    "no-underscore-dangle": "off"
  },
};
