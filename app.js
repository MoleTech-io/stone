const express = require('express');
const path = require('path');
const log = require('log4js').getLogger('[app]');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const dispatcher = require('./routes/dispatcher');
const { initLog4js } = require('./util/logger');
const { readFrontEndConfigPath } = require('./controller_conf/handler');

const port = process.env.PORT || '3838';
const app = express();
const server = http.createServer(app);
initLog4js();
readFrontEndConfigPath();
const corsOptions = { origin: '*', optionsSuccessStatus: 200 };
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsOptions));
app.use('/data', dispatcher);
server.listen(port, () => {
  log.info(`listening on port: ${port} env: ${process.env.NODE_ENV}`);
});
module.exports = app;
