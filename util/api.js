const log = require('log4js').getLogger('[api]');
const errcode = require('err-code');
const request = require('request').defaults({ jar: true, proxy: process.env.PROXY ? process.env.PROXY: null });

const get = (url) => {
  log.info(`[get]: ${url}`);
  const options = {
    url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
    }
  };
  return new Promise((resolve, reject) => {
    request.get(options, (err, resp, body) => {
      if (err) return reject(errcode(Error('-32001'), { url }));
      if (typeof body === 'string') return resolve(JSON.parse(body));
      return resolve(body);
    });
  });
};

const post = (url, data) => {
  log.info(`[post]: url: ${url} data: ${JSON.stringify(data, null, 2)}`);
  const { id } = data;
  const options = {
    url,
    method: 'POST',
    json: data,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
    }
  };

  return new Promise((resolve, reject) => {
    request.post(options, (err, resp, body) => {
      if (!body) return reject(errcode(Error('-32006'), { url, data, err }));
      if (id && id !== body.id) return reject(errcode(Error('-32007'), { url, data, err }));
      if (err) return reject(errcode(Error('-32002'), { url, data, err }));
      if (typeof body === 'string') return resolve(JSON.parse(body));
      return resolve(body);
    });
  });
};

module.exports = { get, post };
