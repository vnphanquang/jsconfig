const base = require('@vnphanquang/eslint-config');
module.exports = {
  ...base,
  plugins: ['svelte3', ...base.plugins],
  overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }, ...base.overrides],
  settings: {
    'svelte3/typescript': () => require('typescript'),
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
};
