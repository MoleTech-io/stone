const NodeCache = require('node-cache');

const businessCache = new NodeCache({ stdTTL: 10, checkperiod: 10 });
const setBusinessResult = (key, value) => businessCache.set(key, value);
const getBusinessResult = (key) => businessCache.get(key);

module.exports = { getBusinessResult, setBusinessResult };
