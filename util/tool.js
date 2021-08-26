/* eslint-disable guard-for-in */
const scheduler = require('node-schedule');
const CryptoJS = require('crypto-js');
const md5 = require('md5');
const Big = require('big.js');
const moment = require('moment');
const handlebars = require('handlebars');

const toolUtil = { };
toolUtil.mod = (a, b) => new Big(a).mod(new Big(b)).toString();
toolUtil.div = (a, b) => new Big(a).div(new Big(b)).toString();
toolUtil.minus = (a, b) => new Big(a).minus(new Big(b)).toString();
toolUtil.add = (a, b) => new Big(a).add(new Big(b)).toString();
toolUtil.times = (a, b) => new Big(a).times(new Big(b)).toString();
toolUtil.convertToBJTs = (date) => {
  const dt = moment(date);
  const year = dt.get('year');
  const month = dt.get('month');
  const day = dt.get('date');
  const hour = dt.get('hour');
  const minute = dt.get('minute');
  const monent = moment().tz('Asia/Shanghai');
  monent.set('year', year);
  monent.set('month', month); // April
  monent.set('date', day);
  monent.set('hour', hour);
  monent.set('minute', minute);
  monent.set('second', 0);
  return monent.unix();
};
toolUtil.getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));
toolUtil.shuffle = (arr) => {
  let j; let x; let i;
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = arr[i];
    arr[i] = arr[j];
    arr[j] = x;
  }
  return arr;
};
toolUtil.validateEmail = (email) => {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
toolUtil.covertTs2MMSS = (ts) => moment.unix(ts).format('mm:ss');
toolUtil.getTS = () => moment().tz('Asia/Shanghai').unix();
toolUtil.getYesterday = () => moment().tz('Asia/Shanghai').subtract(1, 'days').format('YYYYMMDD');
toolUtil.getTSFromDate = (datetime) => moment(datetime).tz('Asia/Shanghai').unix();
toolUtil.getYesterdayTsFromDate = () => toolUtil.getTSFromDate(toolUtil.getYesterday());

toolUtil.getTSOfTodayFromHours = (hour, minute, second) => moment().tz('Asia/Shanghai').hour(hour).minute(minute)
  .second(second)
  .unix();
toolUtil.getCurrentMinutes = () => moment().tz('Asia/Shanghai').format('m');
toolUtil.getCurrentHour = () => moment().tz('Asia/Shanghai').format('H');
toolUtil.getDateTimeYYYYMMDD = () => moment().tz('Asia/Shanghai').format('YYYYMMDD');
toolUtil.getCurrentDateTime = () => moment().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
toolUtil.isArrayDuplicate = (arr) => {
  const hash = {};
  for (const i in arr) {
    if (hash[arr[i]]) {
      return true;
    }
    hash[arr[i]] = true;
  }
  return false;
};
toolUtil.getCurrentDate = () => moment().tz('Asia/Shanghai').format('YYYY-MM-DD');
toolUtil.get00Number = (num) => {
  if (num < 10) {
    return `0${num}`;
  }
  return num;
};
toolUtil.get000Number = (num) => {
  if (num < 10) {
    return `00${num}`;
  } if (num < 100) {
    return `0${num}`;
  }
  return num;
};
toolUtil.getFormatDate = (date) => {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = `0${month}`;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = `0${strDate}`;
  }
  const FormatDate = year + month + strDate;
  return FormatDate;
};

toolUtil.sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

toolUtil.scheduler = (cron, callback) => {
  scheduler.scheduleJob(cron, callback);
};

toolUtil.encrypt = (data, password) => new Promise((resolve, reject) => {
  let encryptedkeystore;
  try {
    encryptedkeystore = CryptoJS.AES.encrypt(data, password);
  } catch (exception) {
    reject(exception);
  }
  resolve(encryptedkeystore);
});
toolUtil.md5 = (message) => md5(message);
toolUtil.decrypt = (data, password) => new Promise((resolve, reject) => {
  let keyStore;
  try {
    const bytes = CryptoJS.AES.decrypt(data, password);
    keyStore = bytes.toString(CryptoJS.enc.Utf8);
  } catch (exception) {
    reject(exception);
  }
  resolve(keyStore);
});
toolUtil.getCombinationOrPermutation = (source, count, isPermutation = false) => {
  const currentList = source.map((item) => [item]);
  if (count === 1) {
    return currentList;
  }
  const result = [];
  for (let i = 0; i < currentList.length; i++) {
    const current = currentList[i];
    let children = [];
    if (isPermutation) {
      children = toolUtil.getCombinationOrPermutation(source.filter((item) => item !== current[0]), count - 1, isPermutation);
    } else {
      children = toolUtil.getCombinationOrPermutation(source.slice(i + 1), count - 1, isPermutation);
    }
    for (const child of children) {
      result.push([...current, ...child]);
    }
  }
  return result;
};
toolUtil.sort00Array = (numbers) => {
  const arr = numbers.split(',');
  const tmpArr = [];
  for (const num of arr) {
    tmpArr.push(parseInt(num, 10));
  }
  tmpArr.sort((a, b) => a - b);
  const resArr = [];
  for (const num1 of tmpArr) {
    resArr.push(toolUtil.get00Number(num1));
  }
  return resArr.join(',');
};
toolUtil.parseTemplateByHandlerBar = (text, data) => {
  const template = handlebars.compile(text);
  return JSON.parse(template(data));
};

module.exports = toolUtil;
