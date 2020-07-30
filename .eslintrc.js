module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
      sourceType: 'module'
    },
    env: {
      'browser': true
    },
    globals: {
      $: true,
      Vue: true,
      Regular: true,
    },
    extends: 'airbnb-base',
    plugins: [
      'html'
    ],
    rules: {
      'no-debugger': global.IS_DEV ? 0 : 2,
      'no-console': global.IS_DEV ? 0 : 1,
      'func-names': 0,
      'import/no-unresolved': 0,
      'import/extensions': 0,
      'import/no-extraneous-dependencies': 0,
      'linebreak-style': 0
    }
  };
  

// module.exports = {
//   "env": {
//       "browser": true,
//       "es6": true
//   },
//   "extends": [
//       "plugin:vue/essential",
//       "standard"
//   ],
//   "globals": {
//       "Atomics": "readonly",
//       "SharedArrayBuffer": "readonly"
//   },
//   "parserOptions": {
//       "ecmaVersion": 2018,
//       "sourceType": "module"
//   },
//   "plugins": [
//       "vue",
//   ],
//   "rules": {
//   }
// };

