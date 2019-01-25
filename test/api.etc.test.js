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

var txhash = '0x29ffe0dba5dc1783b6bcc291158e8ef3ffc0e7708b6ddc8c90736129206378eb';

const addresses = {
  sc_addr: '0x88d60255f917e3eb94eae199d827dad837fac4cb',
  normal: '0x6202c80d128510a51e2cdbfa8e3fd0b29cfa09fd',
  invalid: '0x53F47F4397bdaFD1dff0E4F6216D97EF4bcAc90d',
  lessThan_10txs: '0xf953856cdebda2522c7f67860e9e7e3825675dd8',
  moreThan_10txs: '0x749f132b1494a9a602e3c8e882c997701ef2a013',
  moreThan_50txs: '0x6202c80d128510a51e2cdbfa8e3fd0b29cfa09fd',
  noUTXO: '0xe77551c2f5b43c47108cd5f38318fbb022c4036c',
  someUTXO: '0xf953856cdebda2522c7f67860e9e7e3825675dd8'
};

var api = null;
var coinAPI = null;

describe('api.etc', async() => {

  beforeEach(async() => {
    api = new InfinitoApi(opts);
    coinAPI = api.ETC;
  });

  // TC1: Addr History
  describe('#getAddrHistory', async() => {
    it('', async() => {
      let info = await coinAPI.getHistory(addresses.normal, 0, 10);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('total');
      info.data.should.have.property('from');
      info.data.should.have.property('to');
      info.data.should.have.property('transactions');
    });
  });

  // TC2: Internal History
  describe('#getInternalHistory', async() => {
    it('', async() => {
      let info = await coinAPI.getInternalHistory(addresses.normal, 0, 10);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('total');
      info.data.should.have.property('from');
      info.data.should.have.property('to');
      info.data.should.have.property('transactions');
    });
  });

  // TC3: get Nonce
  describe('#getNonce', async() => {
    it('', async() => {
      let info = await coinAPI.getNonce(addresses.normal);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('nonce');
    });
  });

  // TC4: get Balance
  describe('#getBalance', async() => {
    it('', async() => {
      let info = await coinAPI.getBalance(addresses.normal);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('addr');
      info.data.should.have.property('balance');

    });
  });

  // TC9: Send TX
  describe('#sendTransaction', async() => {
    it('', async() => {
      let res = await coinAPI.sendTransaction({ txhash: txhash });
      // console.log(info);
      res.should.have.property('cd');
    });
  });
});