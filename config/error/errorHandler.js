const yaml = require('yaml');
const fs = require('fs');
const path = require('path');

let errorConfig;
const loadErrorConfig = () => {
  const coinErrorFile = fs.readFileSync(`${path.join(__dirname, './')}coinError.yml`, 'utf8');
  const lotteryErrorFile = fs.readFileSync(`${path.join(__dirname, './')}lotteryError.yml`, 'utf8');
  return { ...yaml.parse(coinErrorFile), ...yaml.parse(lotteryErrorFile) };
};

const getErrorMessage = (code) => {
  if (!errorConfig) errorConfig = loadErrorConfig();
  return errorConfig[code];
};

module.exports = { getErrorMessage };
