const config = require('config');
const ethers = require('ethers');
const errcode = require('err-code');
const { get, post } = require('../util/api');

const getBalance = async (params) => {
  const id = new Date().getTime();
  if (params.length === 1) {
    const [address] = params;
    const data = { id, method: config.get('bsc.constant.getBalance'), params: [address] };
    const { result, error } = await post(config.get('bsc.uri.node'), data);
    return { result, error };
  }
  const [contractAddress, inputData] = params;
  const data = { id, method: config.get('bsc.constant.callEth'), params: [{ to: contractAddress, data: inputData }, 'latest'] };
  const { result, error } = await post(config.get('bsc.uri.node'), data);
  return { result, error };
};

const getTransactionReceipt = async (params) => {
  const [txid] = params;
  const id = new Date().getTime();
  const data = { id, method: config.get('bsc.constant.getTransactionReceipt'), params: [txid] };
  const { result, error } = await post(config.get('bsc.uri.node'), data);
  return { result, error };
};

const getInternalTransaction = async (params) => {
  const [txid] = params;
  const { result, error } = await get(`${config.get('bsc.uri.getInternalTransaction') + txid}`);
  return { result, error };
};

const gaspriceEstimator = async () => {
  const { result, error } = await get(config.get('bsc.uri.gaspriceEstimator'));
  return { result, error };
};

const getTransactionCount = async (params) => {
  const [address] = params;
  const id = new Date().getTime();
  const data = { id, method: config.get('bsc.constant.getTransactionCount'), params: [address, 'latest'] };
  const { result, error } = await post(config.get('bsc.uri.node'), data);
  return { result, error };
};

const sendRawTransaction = async (params) => {
  let nonce;
  let from;
  const [rawTx] = params;
  try {
    ({ nonce, from } = ethers.utils.parseTransaction(rawTx));
  } catch (error) {
    throw errcode(Error('-32005'), { rawTx });
  }
  const { result: nonceOnline } = await getTransactionCount([from]);
  if (parseInt(nonce, 10) < parseInt(nonceOnline, 16)) throw Error('-32004');
  const id = new Date().getTime();
  const data = { id, method: config.get('bsc.constant.sendRawTransaction'), params: [rawTx] };
  const { result, error } = await post(config.get('bsc.uri.node'), data);
  return { result, error };
};

const getBlockByNumber = async (params) => {
  const [number, isObjectOrHash] = params;
  const id = new Date().getTime();
  const data = { id, method: config.get('bsc.constant.getBlockByNumber'), params: [number, isObjectOrHash] };
  const { result, error } = await post(config.get('bsc.uri.node'), data);
  return { result, error };
};

const getBlockNumber = async () => {
  const id = new Date().getTime();
  const data = { id, method: config.get('bsc.constant.getBlockNumber'), params: [] };
  const { result, error } = await post(config.get('bsc.uri.node'), data);
  return { result, error };
};

const getTransactionByHash = async (params) => {
  const [txid] = params;
  const id = new Date().getTime();
  const data = { id, method: config.get('bsc.constant.getTransactionByHash'), params: [txid] };
  const { result, error } = await post(config.get('bsc.uri.node'), data);
  return { result, error };
};

module.exports = {
  getTransactionReceipt,
  getInternalTransaction,
  gaspriceEstimator,
  getTransactionCount,
  getTransactionByHash,
  sendRawTransaction,
  getBlockByNumber,
  getBlockNumber,
  getBalance
};
