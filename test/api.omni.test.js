const Assert = require('assert');
const InfinitoApi = require('../index');
const ConfigTest = require('./config.test');
const chai = require('chai');
chai.should();

const opts = {
  apiKey: ConfigTest.API_KEY,
  secret: ConfigTest.SECRECT,
  baseUrl: ConfigTest.BASE_URL,
  logLevel: ConfigTest.LOG_LEVEL,
};

const addresses = {
  normal: '1Dp1TZfsMDfrNwuAzXi8mJwcXNA5xiHPor',
  invalid: '1Dp1TZfsMDfrNwuAzXi8mJwcXNA5xiHPora',
  lessThan_10txs: '3FfQGY7jqsADC7uTVqF3vKQzeNPiBPTqt4',
  moreThan_10txs: '1ButHWWeVhcvV1ETBrnLw5r35hDJfFQeUo',
  moreThan_50txs: '19D7RrLKjWSBwxQfxJqZ1CnohCFy9TzFjz',
  noUTXO: '1DpSfMhn2hhHdUJiL5Uaftj8jkSV16EP2',
  someUTXO: '1BbPX745towBVLrdU1yutDzw5bsx611LoB'
};

const rawtx = '17cf9bd54ca5a6a30c16e3c6fe5c0193b6875d1c57662e0f26c2759623f534b3';
const txId = 'bd589d1ae831ff536d76630c15c619a74c683d437ff69e8159321a080552496b';

var api = null;
var coinAPI = null;

describe('api.omni', async () => {
  beforeEach(async () => {
    api = new InfinitoApi(opts);
    coinAPI = api.getChainService().OMNI;
  });

  describe('#getBalance(address)', async () => {
    it('Get balance first time', async () => {
      var result = await coinAPI.getBalance(addresses.normal, 31);
      Assert.ok(result.data.balance !== undefined, 'balance must be exist');
    });
  });

  describe('#getUtxo(address)', async() => {
    it('addr with some utxo', async () => {
      let info = await coinAPI.getUtxo(addresses.someUTXO);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('transactions');
    });
  });

  describe('#postSendRaw', async() => {
    it('send a tx', async() => {
      let res = await coinAPI.sendTransaction({ rawtx: rawtx });
      res.should.have.property('cd');
    });
  });

  describe('#getTransactionDetails', async() => {
    it('', async() => {
      let info = await coinAPI.getTransaction(txId);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('txid');
    });
  });
});
