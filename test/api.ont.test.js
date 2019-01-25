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
  normal: 'AGEdeZu965DFFFwsAWcThgL6uduJf4U7ci'
};

var api = null;
var coinAPI = null;

describe('api.ont', async() => {
  beforeEach(async() => {
    api = new InfinitoApi(opts);
    coinAPI = api.ONT;
  });
  // ---------------------------------------------------------------------------------------------------
  /** ************************* get ONT wallet Balances *******************************/
  describe('#getBalance', async() => {
    it('', async() => {
      let info = await coinAPI.getBalance(addresses.normal);
      console.log(info);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('ont');
      info.data.should.have.property('ong');
    });
  });

  // ---------------------------------------------------------------------------------------------------
  /** ************************* send raw ONT transaction *******************************/
  describe('#sendTransaction', async() => {
    it('Should be fail', async() => {
      let info = await coinAPI.sendTransaction({
        rawtx: "00d12d1cf46bf401000000000000d0070000000000003a8d04e847d8a58a5da618058a755e4ce310ba077100c66b143a8d04e847d8a58a5da618058a755e4ce310ba076a7cc814d7d59112c9d703b29676ebdd7496d72b4157a0b86a7cc8516a7cc86c51c1087472616e736665721400000000000000000000000000000000000000010068164f6e746f6c6f67792e4e61746976652e496e766f6b650001424101797d014859ffe19601e0e0c324a5f32554a99e48a26801bd53aeefdc0dfbc5f252d22712cbf4cfad4f0f29d8658fae4e40ae8e4f9025252c1e831e0366a0b158232102674da7c1bfb9257732824a2afbea78755710f416a7116fe976886d064f0472ffac"
      });
      info.should.have.property('cd');
      info.should.have.property('msg');
    });

    it('send transaction', async() => {
      let info = await coinAPI.sendTransaction({
        rawtx: "00d12baace0cf401000000000000204e0000000000003a8d04e847d8a58a5da618058a755e4ce310ba077900c66b143a8d04e847d8a58a5da618058a755e4ce310ba076a7cc8147e1ab490a2f8dbcbef0e3252b7ec34d71ccfc6976a7cc80800ca9a3b000000006a7cc86c51c1087472616e736665721400000000000000000000000000000000000000020068164f6e746f6c6f67792e4e61746976652e496e766f6b65000142410188e9db44ff1dd6f0c569d86988cc54d8ffbe1977a4af0a64ee49296c1ed9536c462a83d3db40b3ddc41904c38bbe2591ccbbda0aa42d9d799239fdd5ed912a16232102674da7c1bfb9257732824a2afbea78755710f416a7116fe976886d064f0472ffac"
      });
      info.should.have.property('cd');
      info.should.have.property('msg');
    });
  });

  // ---------------------------------------------------------------------------------------------------
  /** ************************* get claimable ONG *******************************/
  describe('#getClaimable', async() => {
    it('', async() => {
      let info = await coinAPI.getClaimable(addresses.normal);
      console.log(info);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('ong');
    });
  });

  // ---------------------------------------------------------------------------------------------------
  /** ************************* get unclaimed ONG *******************************/
  describe('#getUnclaimed', async() => {
    it('', async() => {
      let info = await coinAPI.getUnclaimed(addresses.normal);
      console.log(info);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('ong');
    });
  });

});