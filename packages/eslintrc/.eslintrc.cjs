// eslint-disable-next-line @typescript-eslint/no-var-requires
const base = require('./base.cjs');

module.exports = {
  ...base,
  extends: [...base.extends],
  plugins: [...base.plugins, 'prettier'],
};
