const express = require('express');
const Ajv = require('ajv');
const errcode = require('err-code');
const log = require('log4js').getLogger('[data]');
const { getErrorMessage } = require('../config/error/errorHandler');
const { getController } = require('../controller_conf/handler');

const ajv = new Ajv({ allErrors: true });
const router = express.Router();
const doAjvCheck = ({ param_schema, params }) => ajv && !ajv.validate(param_schema, params);
const sendErrorMsg = ({ id, res, error, statusCode = 200 }) => {
  const code = error.message;
  const message = getErrorMessage(code);
  if (code === '-32603') return res.status(500).json({ id, error: message, code });
  log.error(`Error Message: ${message}`);
  return res.status(statusCode).json({ id, error: message, code });
};

const dispatchRequest = async ({ controller, method, id, params, res }) => {
  try {
    const { result, error } = await controller.processor[method](params);
    if (result) {
      log.info(`[${method}]:  returns ${JSON.stringify(result, null, 2)}`);
      return res.status(200).json({ id, result });
    }
    if (error) return res.status(200).json({ id, error: error.message || error });
    throw errcode(Error('-32003'), { method, params });
  } catch (error) {
    sendErrorMsg({ id, res, error });
    return log.error(error);
  }
};

router.post('/', async (req, res) => {
  const { method: uri, params, id } = req.body;
  log.info(`[${uri}]: start: params: ${params}`);
  try {
    const controller = getController(uri);
    if (!controller) return res.status(404).json({ id, code: '-32602', error: getErrorMessage('-32602') });
    const { method, param_schema } = controller[uri];
    if (doAjvCheck({ param_schema, params })) return res.status(200).json({ id, code: '-32602', error: ajv.errors });
    return dispatchRequest({ controller, method, id, params, res });
  } catch (error) {
    log.error(error);
    return sendErrorMsg({ id, res, error: Error('-32603') });
  }
});

module.exports = router;
