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

var txhash = '0x910ecf54a4081940db240f591b572dbc26a01ec6a4278eba63771da71b32c077';

const addresses = {
  sc_addr: '0x0d152B9EE87eBAe179F64c067A966dd716C50742',
  normal: '4A23863eA22Bc6fC0b7Eb6C8CB07DdF3bF3f4c15',
  invalid: '4A23863eA22Bc6fC0b7Eb6C8C07DdF3bF3f4c15',
  lessThan_10txs: 'F57A36876BBcdbe22cbc8c0f77e365cf78009E04',
  moreThan_10txs: '7BeE06704992e72A9E07987e98965C4a06d5d7a7',
  moreThan_50txs: 'AbE5f17d4bCB214A8e4d7aaEb20c56b5A38A897f',
  noUTXO: 'Cfaa3aaBdadf2f72fAd9f624F5B97dc0dbCFB090',
  someUTXO: '7BeE06704992e72A9E07987e98965C4a06d5d7a7'
};

var api = null;
var coinAPI = null;

describe('api.eth', async() => {

  beforeEach(async() => {
    api = new InfinitoApi(opts);
    coinAPI = api.ETH;
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

  // TC5: Contract List
  describe('#getContractList', async() => {
    it('', async() => {
      let info = await coinAPI.getContractList(addresses.normal);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('total');
      info.data.should.have.property('from');
      info.data.should.have.property('to');
      info.data.should.have.property('contracts');
    });
  });

  // TC6: Contract Info
  describe('#getContractInfo', async() => {
    it('', async() => {
      let info = await coinAPI.getContractInfo(addresses.sc_addr);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('address');
      info.data.should.have.property('name');
      info.data.should.have.property('symbol');
      info.data.should.have.property('decimals');
      info.data.should.have.property('total_supply');
    });
  });

  // TC7: Contract History
  describe('#getContractHistory', async() => {
    it('', async() => {
      let info = await coinAPI.getContractHistory(addresses.sc_addr, 0, 10, addresses.normal);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('total');
      info.data.should.have.property('from');
      info.data.should.have.property('to');
      info.data.should.have.property('transactions');
    });
  });

  // TC8: get Contract Balance
  describe('#getContractBalance', async() => {
    it('', async() => {
      let info = await coinAPI.getContractBalance(addresses.sc_addr, addresses.normal);
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