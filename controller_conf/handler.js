/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const yaml = require('yaml');
const path = require('path');
const fs = require('fs');
const log = require('log4js').getLogger(['controller_conf.handler']);

let controller_conf;
const readFrontEndConfigPath = () => {
  log.info('[readFrontEndConfigPath]: log config start');
  try {
    const fileNames = fs.readdirSync(path.join(__dirname, './'), 'utf8')
      .filter((fileName) => fileName.includes('yml') || fileName.includes('yaml'));
    controller_conf = fileNames.reduce((rawConf, fileName) => {
      const rawFile = fs.readFileSync(path.join(__dirname, './', fileName), 'utf8');
      const controllerName = fileName.replace('.yml', '').replace('.yaml', '');
      const controller = yaml.parse(rawFile);
      controller.processor = require(controller.processorPath);
      log.info(`[controllerName]:${controllerName}`);
      log.info(`[controller]: is controller loaded: ${!!controller}`);
      return { ...rawConf, [controllerName]: controller };
    }, {});
  } catch (error) {
    log.error(error);
  }
  return null;
};

const getController = (uri) => {
  const [controllerName] = Object.entries(controller_conf).find((entry) => entry[1][uri]);
  return controller_conf[controllerName];
};


module.exports = { getController, readFrontEndConfigPath };
