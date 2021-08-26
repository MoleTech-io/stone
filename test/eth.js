
const assert = require('assert');
const request = require('supertest');
const app = require('../app');

describe('test eth api', function () {
  it('test eth_getTransactionReceipt failed', async function () {
    const data = { id: '12', method: 'eth_getTransactionReceipt', params: ['9e4b7d09c2f41ed12bdd5cf2bdb1438d9a94ecc91c76a4d15c96eadd875a0693'] };
    request(app).post('/data').send(data)
      .expect(200)
      .then(async (resp) => {
        const { id, code, error } = resp.body;
        assert.deepEqual(id, '12');
        assert.deepEqual(code, '-32602');
        assert.notDeepEqual(error, null);
      });
  });

  it('test eth_getTransactionReceipt success', async function () {
    const data = { id: '12', method: 'eth_getTransactionReceipt', params: ['0x9e4b7d09c2f41ed12bdd5cf2bdb1438d9a94ecc91c76a4d15c96eadd875a0693'] };
    request(app).post('/data').send(data)
      .expect(200)
      .then(async (resp) => {
        const { id, result } = resp.body;
        assert.deepEqual(id, '12');
        assert.notDeepEqual(result, null);
      });
  });

  it('test eth_getInternalTransactionByHash success', async function () {
    const data = { id: '12', method: 'eth_getInternalTransactionByHash', params: ['0xeba1de404e31fb9559ba33f230bb8e90b6dbbedd2df0b2d2bee3cb5218173f35'] };
    request(app).post('/data').send(data)
      .expect(200)
      .then(async (resp) => {
        const { id, result } = resp.body;
        assert.deepEqual(id, '12');
        assert.notDeepEqual(result, null);
      });
  });

  it('test eth_getInternalTransactionByHash fail', async function () {
    const data = { id: '12', method: 'eth_getInternalTransactionByHash', params: ['eba1de404e31fb9559ba33f230bb8e90b6dbbedd2df0b2d2bee3cb5218173f35'] };
    request(app).post('/data').send(data)
      .expect(200)
      .then(async (resp) => {
        const { id, error } = resp.body;
        assert.deepEqual(id, '12');
        assert.notDeepEqual(error, null);
      });
  });

  it('test eth_getInternalTransactionByHash fail params 0', async function () {
    const data = { id: '12', method: 'eth_getInternalTransactionByHash', params: [] };
    request(app).post('/data').send(data)
      .expect(200)
      .then(async (resp) => {
        const { id, error } = resp.body;
        assert.deepEqual(id, '12');
        assert.notDeepEqual(error, null);
      });
  });

  it('test eth_getTransactionCount nonce', async function () {
    const data = { id: '12', method: 'eth_getTransactionCount', params: ['0x2a70e97B788Ee7d9B8029491ad297E8A009B4706'] };
    request(app).post('/data').send(data)
      .expect(200)
      .then(async (resp) => {
        const { id, result } = resp.body;
        assert.deepEqual(id, '12');
        assert.notDeepEqual(result, null);
      });
  });

  it('test eth_getTransactionCount nonce fail', async function () {
    const data = { id: '12', method: 'eth_getTransactionCount', params: ['0x2a70e97B788Ee7d9B8029491ad297E8A009B4'] };
    request(app).post('/data').send(data)
      .expect(200)
      .then(async (resp) => {
        const { id, error } = resp.body;
        assert.deepEqual(id, '12');
        assert.notDeepEqual(error, null);
      });
  });

  it('test eth_sendRawTransaction fail', async function () {
    const data = { id: '12', method: 'eth_sendRawTransaction', params: ['0x2a70e97B788Ee7d9B8029491ad297E8A009B4'] };
    request(app).post('/data').send(data)
      .expect(200)
      .then(async (resp) => {
        const { id, error } = resp.body;
        assert.deepEqual(id, '12');
        assert.notDeepEqual(error, null);
      });
  });
});
