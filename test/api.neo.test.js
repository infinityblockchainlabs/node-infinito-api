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
  normal: 'ASH41gtWftHvhuYhZz1jj7ee7z9vp9D9wk',
  invalid: 'ASH41gtWftHvhuYhZz1j7ee7z9vp9D9wk',
  lessThan_10txs: 'AYVYDKH3kRnZJttY2DU78isQjY57vSL5q7',
  moreThan_10txs: 'ASH41gtWftHvhuYhZz1jj7ee7z9vp9D9wk',
  sc_address: 'ac116d4b8d4ca55e6b6d4ecce2192039b51cccc5'
};

const asset_id = 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b';

var txhash = '';

var api = null;
var coinAPI = null;

describe('api.neo', async() => {
  beforeEach(async() => {
    api = new InfinitoApi(opts);
    coinAPI = api.NEO;
  });
  // ---------------------------------------------------------------------------------------------------
  /** ************************* get Asset Info Address *******************************/
  describe('#getBalance', async() => {
    it('', async() => {
      let info = await coinAPI.getBalance(addresses.normal, asset_id);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('addr');
      info.data.should.have.property('assets');
    });
  });

  /** ************************* get History *******************************/
  describe('#getHistory', async() => {
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

  /** ************************* get UTXO *******************************/
  describe('#getUtxo', async() => {
    it('', async() => {
      let info = await coinAPI.getUtxo(addresses.normal, asset_id);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('transactions');
    });
  });

  /** ************************* get Claimable *******************************/
  describe('#getClaimable', async() => {
    it('', async() => {
      let info = await coinAPI.getClaimable(addresses.normal);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('transactions');
    });
  });

  /** ************************* get Unclaimed *******************************/
  describe('#getUnclaimed', async() => {
    it('', async() => {
      let info = await coinAPI.getUnclaimed(addresses.normal);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('addr');
      info.data.should.have.property('available');
      info.data.should.have.property('unavailable');
    });
  });

  /** ************************* send Raw TX *******************************/
  describe('#sendTransaction', async() => {
    it('', async() => {
      let res = await coinAPI.sendTransaction({ txhash: txhash });
      res.should.have.property('cd');
    });
  });

  /** ************************* get Contract Info *******************************/
  describe('#getContractInfo', async() => {
    it('', async() => {
      let info = await coinAPI.getContractInfo(addresses.sc_address);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('address');
      info.data.should.have.property('name');
      info.data.should.have.property('symbol');
      info.data.should.have.property('decimals');
      info.data.should.have.property('total_supply');
    });
  });

  /** ************************* get Contract Balance *******************************/
  describe('#getContractBalance', async() => {
    it('', async() => {
      let info = await coinAPI.getContractBalance(addresses.sc_address, addresses.normal);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('addr');
      info.data.should.have.property('balance');
    });
  });

  /** ************************* get Contract History *******************************/
  describe('#getContractHistory', async() => {
    it('', async() => {
      let info = await coinAPI.getContractHistory(addresses.sc_address, addresses.normal);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('total');
      info.data.should.have.property('from');
      info.data.should.have.property('to');
      info.data.should.have.property('transactions');
    });
  });
});