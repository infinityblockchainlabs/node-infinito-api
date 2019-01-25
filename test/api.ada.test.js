const InfinitoApi = require('../index');
const ConfigTest = require('./config.test');
const chai = require('chai');
chai.should();

const opts = {
  apiKey: ConfigTest.API_KEY,
  secret: ConfigTest.SECRECT,
  baseUrl: ConfigTest.BASE_URL,
  logLevel: ConfigTest.LOG_LEVEL
};

const addresses = {
  normal: 'DdzFFzCqrhsusbs38PS2ifeS3GCc59H8Lx6dXqYQALzSTe3jybXbziHmhutRuhFgYj2nbJ7q2gW46ysxzWxmYzw8c4MXZNhqvCTGHUJE',
  invalid: 'DdzFFzCqrhsusbs38PS2ifeS3GCc59H8Lx6dXqYQALzSTe3jybXbziHmhutRuhFgYj2nbJ7q2gW46ysxzWxmYzw8c4MXZNhqvCTGHUJEs',
  lessThan_10txs: 'DdzFFzCqrhsusbs38PS2ifeS3GCc59H8Lx6dXqYQALzSTe3jybXbziHmhutRuhFgYj2nbJ7q2gW46ysxzWxmYzw8c4MXZNhqvCTGHUJE',
  moreThan_10txs: 'DdzFFzCqrhssyDaSC5qpZVVAwEEQ19opkkRN3oyruKeQZrHmf7tgupanRaPt6QVTLHHRawCaPWMyiZBqAcSJieJmqmhY4KEsad4496s4',
};

var txhash = '';
var txbody = '';

var api = null;
var coinAPI = null;

describe('api.ada', async() => {
  beforeEach(async() => {
    api = new InfinitoApi(opts);
    coinAPI = api.ADA;
  });
  // ---------------------------------------------------------------------------------------------------
  /** ************************* get Asset Info Address *******************************/
  describe('#getBalance', async() => {
    it('', async() => {
      let info = await coinAPI.getBalance(addresses.normal);
      // console.log(info);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('addr');
      info.data.should.have.property('balance');
    });
  });

  /** ************************* get Global Asset Transactions Address *******************************/
  describe('#getHistory', async() => {
    it('', async() => {
      let info = await coinAPI.getHistory(addresses.normal);
      // console.log(info);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('total');
      info.data.should.have.property('from');
      info.data.should.have.property('to');
      info.data.should.have.property('transactions');
    });
  });

  /** ************************* get Global Asset Transaction Address *******************************/
  describe('#getUtxo', async() => {
    it('', async() => {
      let info = await coinAPI.getUtxo(addresses.normal);
      // console.log(info);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('transactions');
    });
  });

  /** ************************* send Raw TX *******************************/
  describe('#sendTransaction', async() => {
    it('', async() => {
      let res = await coinAPI.sendTransaction({ txhash: txhash, txbody: txbody });
      // console.log(info);
      res.should.have.property('cd');
      // res.should.have.property('data');
      // res.data.should.have.property('tx_id');
    });
  });
});