const { Helper } = require('node-infinito-util');
const Assert = require('assert');
const InfinitoApi = require('../index');
const Messages = require('../lib/messages');
const TestMessages = require('./messages');
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
const index = 547808;
const blockId = '00000000000000000025387f00dc4b174df5f00d44169785bd2042dc2c0d8cb0';
const txId = 'bd589d1ae831ff536d76630c15c619a74c683d437ff69e8159321a080552496b';

var api = null;
var coinAPI = null;

describe('api.btc', async() => {
  beforeEach(async() => {
    api = new InfinitoApi(opts);
    // EXAMPLE FOR extendMethod
    // let myMethods = [
    //   {
    //     "name": "getMyAddressInfo",
    //     "method": "GET",
    //     "url": "/BCH/addr/{address}",
    //     "params": ["address"]
    //   },
    // ];
    // api.extendMethod("test", myMethods);
    // let result = await api.test.getMyAddressInfo("1Dp1TZfsMDfrNwuAzXi8mJwcXNA5xiHPor");
    // console.log(result);
    coinAPI = api.BTC;
  });

  describe('#getBalance(address)', async() => {
    it('Get balance first time', async() => {
      var result = await coinAPI.getBalance(addresses.normal);
      Assert.ok(result.data.balance !== undefined, 'balance must be exist');
      Assert.ok(
        result.data.unconfirmed_balance !== undefined,
        'unconfirmed_balance must be exist'
      );
    });

    it('Get balance with wrong api key', async() => {
      coinAPI = new InfinitoApi(
        Helper.merge({}, opts, { apiKey: 'wrong api key' })
      ).BTC;

      try {
        await coinAPI.getBalance(addresses.normal);
        Assert.fail('Should throw exception');
      } catch (err) {
        console.log('Get balance with wrong api key' + JSON.stringify(err));
        Assert.equal(err.code, TestMessages.util.invalid_api_key.code);
        Assert.equal(err.message, Messages.invalid_api_key.message);
      }
    });

    it('test dynamic ', async() => {
      let balance = await coinAPI.getBalance('getAddressInfogetAddressInfo');
      console.log('balance :', balance);

      let history = await coinAPI.getHistory(addresses.normal, 1, 2);
      console.log('history :', history);

      let utxo = await coinAPI.getUtxo(addresses.normal);
      console.log('utxo :', utxo);
    });

    it('test dynamic expired key', async() => {
      api.tokenProvider.setToken(ConfigTest.EXPRIRED_TOKEN);
      coinAPI.getBalance(addresses.normal);
      coinAPI.getHistory(addresses.normal, 1, 2);
      coinAPI.getUtxo(addresses.normal);
    });
  });

  /** ************************* Add get Address info *******************************/
  describe('#getInfo(address)', async() => {
    /* Testcase: Check with valid address*/
    it('Check with valid address', async() => {
      let info = await coinAPI.getAddressInfo(addresses.normal);
      // console.log(info);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('addr');
      info.data.should.have.property('balance');
      info.data.should.have.property('unconfirmed_balance');
      info.data.should.have.property('total_received');
      info.data.should.have.property('total_sent');
      info.data.should.have.property('total_tx');
    });
  });

  /** ************************ Add get Address history ******************************/
  describe('#getHistory(address)', async() => {
    /* Testcase:
          Input parameter:
            addr with >10 transaction
            no offset
            no limit*/
    it('addr with >10 transaction | no offset | no limit', async() => {
      let info = await coinAPI.getHistory(addresses.moreThan_10txs);
      // console.log(util.inspect(info, false, null));
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('total');
      info.data.should.have.property('from');
      info.data.should.have.property('to');
      info.data.should.have.property('txs');
    });
  });

  /** *********************** Add get Address utxo ****************************/
  describe('#getUtxo(address)', async() => {
    /* Testcase:
      Input parameter:
        addr with some utxo*/
    it('addr with some utxo', async() => {
      let info = await coinAPI.getUtxo(addresses.someUTXO);
      // console.log(util.inspect(info, false, null));
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('transactions');
    });
  });

  /** *********************** post Send Raw ***********************************/
  describe('#postSendRaw', async() => {
    it('send a tx', async() => {
      let res = await coinAPI.sendTransaction({ rawtx: rawtx });
      // console.log(res);
      res.should.have.property('cd');
    });
  });

  // -----------------------------------------------------------------------------------------------------
  /** *********************** get Transaction Details ***********************************/
  describe('#getTransactionDetails', async() => {
    it('', async() => {
      let info = await coinAPI.getTransaction(txId);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('tx_id');
      info.data.should.have.property('version');
      info.data.should.have.property('locktime');
      info.data.should.have.property('vin');
      info.data.should.have.property('vout');
    });
  });

  /** *********************** get Raw Transaction ***********************************/
  describe('#getRawTransaction', async() => {
    it('', async() => {
      let info = await coinAPI.getRawTransaction(txId);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('raw_tx');
    });
  });

  /** *********************** get Block Hash By Block Index ***********************************/
  describe('#getBlockHashByBlockIndex', async() => {
    it('', async() => {
      let info = await coinAPI.getBlockHashByIndex(index);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('block_id');
    });
  });

  /** *********************** get Block Info ***********************************/
  describe('#getBlockInfo', async() => {
    it('', async() => {
      let info = await coinAPI.getBlock(blockId);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('block_id');
      info.data.should.have.property('size');
      info.data.should.have.property('height');
      info.data.should.have.property('version');
      info.data.should.have.property('merkleroot');
      info.data.should.have.property('time');
      info.data.should.have.property('nonce');
      info.data.should.have.property('bits');
      info.data.should.have.property('difficulty');
      info.data.should.have.property('chainwork');
      info.data.should.have.property('confirmations');
      info.data.should.have.property('previous_block_hash');
      info.data.should.have.property('next_block_hash');
      info.data.should.have.property('reward');
      info.data.should.have.property('pool_info');
    });
  });

  /** *********************** get Block Transactions ***********************************/
  describe('#getBlockTransactions', async() => {
    it('', async() => {
      let info = await coinAPI.getTransactionByBlock(blockId);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('total');
      info.data.should.have.property('transactions');
    });
  });

  /** *********************** get Raw Block ***********************************/
  describe('#getRawBlock', async() => {
    it('', async() => {
      let info = await coinAPI.getRawBlock(blockId);

      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('raw_block');
    });
  });
});