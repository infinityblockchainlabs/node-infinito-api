const { Helper } = require('node-infinito-util');
const Assert = require('assert');
const InfinitoApi = require('../index');
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
  normal: 'XhPdPRbeYrPFZPqnyCUGuyUUs1g8ZDaTma',
  invalid: 'XhPdPRbeYrPFZPqnyCUGuyUUs1g8ZDaTmanm',
  lessThan_10txs: 'XhPdPRbeYrPFZPqnyCUGuyUUs1g8ZDaTma',
  moreThan_10txs: 'XxviPxvESQ4ATkZTFJ3RboWUy2cntzX4Vk',
  moreThan_50txs: 'XoowiBmAJtaMd6NiuxL2iQ2UzzQPWcM7em',
  noUTXO: 'XoowiBmAJtaMd6NiuxL2iQ2UzzQPWcM7em',
  someUTXO: 'XxviPxvESQ4ATkZTFJ3RboWUy2cntzX4Vk'
};

const rawtx =
  'f375b493976a289025d1278e8a5b3ae0dfcb4fc51ea43cea9f039106d3f35877';

const index = 962317;
const blockId = '000000000000000aee4017f828ecb3496ac66c5905290f5409cd89424773ab4b';
const txId = 'd90c27d3da1fab4961d98e9d2abccf380fa9a2ce5ab74c8dfccadf7fda266714';

var api = null;
var coinAPI = null;

describe('api.dash', async () => {
  beforeEach(async () => {
    api = new InfinitoApi(opts);
    coinAPI = api.DASH;
  });

  describe('#getBalance(address)', async () => {
    it('Get balance first time', async () => {
      var result = await coinAPI.getBalance(addresses.normal);
      Assert.ok(result.data.balance !== undefined, 'balance must be exist');
      Assert.ok(
        result.data.unconfirmed_balance !== undefined,
        'unconfirmed_balance must be exist'
      );
    });

    it('Get balance with wrong api key', async () => {
      coinAPI = new InfinitoApi(
        Helper.merge({}, opts, { apiKey: 'wrong api key' })
      ).DASH;

      try {
        await coinAPI.getBalance(addresses.normal);
        Assert.fail('Should throw exception');
      } catch (err) {
        Assert.equal(err.code, TestMessages.util.invalid_api_key.code);
        Assert.equal(err.message, TestMessages.util.invalid_api_key.message);
      }
    });

    it('test dynamic ', async () => {
      let balance = await coinAPI.getBalance(addresses.normal);
      console.log('balance :', balance);

      let history = await coinAPI.getHistory(addresses.normal, 1, 2);
      console.log('history :', history);

      let utxo = await coinAPI.getUtxo(addresses.normal);
      console.log('utxo :', utxo);
    });

    it('test dynamic expired key', async () => {
      api.tokenProvider.setToken(ConfigTest.EXPRIRED_TOKEN);

      coinAPI.getBalance(addresses.normal);
      coinAPI.getHistory(addresses.normal, 1, 2);
      coinAPI.getUtxo(addresses.normal);
    });
  });

  /** ************************* Add get Address info *******************************/
  describe('#getInfo(address)', async () => {
    /* Testcase: Check with valid address*/
    it('Check with valid address', async () => {
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
  describe('#getHistory(address)', async () => {
    /* Testcase:
          Input parameter:
            addr with >10 transaction
            no offset
            no limit*/
    it('addr with >10 transaction | no offset | no limit', async () => {
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
  describe('#getUtxo(address)', async () => {
    /* Testcase:
      Input parameter:
        addr with some utxo*/
    it('addr with some utxo', async () => {
      let info = await coinAPI.getUtxo(addresses.someUTXO);
      // console.log(util.inspect(info, false, null));
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('transactions');
    });
  });

  /** *********************** post Send Raw ***********************************/
  describe('#postSendRaw', async () => {
    it('send a tx', async () => {
      let res = await coinAPI.sendTransaction({ rawtx: rawtx });
      console.log(res);
      res.should.have.property('cd');
    });
  });

  // -----------------------------------------------------------------------------------------------------
  /** *********************** get Transaction Details ***********************************/
  describe('#getTransactionDetails', async () => {
    it('', async () => {
      let info = await coinAPI.getTransaction(txId);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('tx_id');
      info.data.should.have.property('version');
      info.data.should.have.property('locktime');
      info.data.should.have.property('vin');
      info.data.should.have.property('vout');
      /* info.data.should.have.property('sys_fee');
      info.data.should.have.property('net_fee');
      info.data.should.have.property('confirmations');
      info.data.should.have.property('blockhash');
      info.data.should.have.property('blockheight'); */

    });
  });

  /** *********************** get Raw Transaction ***********************************/
  describe('#getRawTransaction', async () => {
    it('', async () => {
      let info = await coinAPI.getRawTransaction(txId);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('raw_tx');
    });
  });

  /** *********************** get Block Hash By Block Index ***********************************/
  describe('#getBlockHashByBlockIndex', async () => {
    it('', async () => {
      let info = await coinAPI.getBlockHashByIndex(index);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('block_id');
    });
  });

  /** *********************** get Block Info ***********************************/
  describe('#getBlockInfo', async () => {
    it('', async () => {
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
  describe('#getBlockTransactions', async () => {
    it('', async () => {
      let info = await coinAPI.getTransactionByBlock(blockId);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('total');
      info.data.should.have.property('transactions');
    });
  });

  /** *********************** get Raw Block ***********************************/
  describe('#getRawBlock', async () => {
    it('', async () => {
      let info = await coinAPI.getRawBlock(blockId);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('raw_block');

    });
  });

  /** *********************** sync Block ***********************************/
  describe('#sync', async() => {
    it('', async() => {
      let info = await coinAPI.sync();
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('height');
    });
  });

});