const config = require('config');
const path = require('path');
const fs = require('fs');
const log4js = require('log4js');
const { parseTemplateByHandlerBar } = require('./tool');

const initLog4js = () => {
  const logDirectory = path.join(__dirname, '../log');
  // eslint-disable-next-line no-unused-expressions
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
  const configuration = config.get('log4js');
  log4js.configure(parseTemplateByHandlerBar(JSON.stringify(configuration), { logDirectory }));
};
module.exports = { initLog4js };
