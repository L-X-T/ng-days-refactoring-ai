const ngConfig = require('../../eslint.ng.config.cjs');

module.exports = [
  ...ngConfig,
  {
    files: ['**/*.ts'],
    rules: {},
  },
];
