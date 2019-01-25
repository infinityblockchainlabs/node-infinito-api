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
  normal: 'LU4Rk5xHz3Awfi6KeiRaupZqausrbHWXAP',
  invalid: 'LU4Rk5xHz3Awfi6KeiRaupZqausrbHWXAPnm',
  lessThan_10txs: 'LQB2bZJvC4oGvf63eWebX3n54qquWoPhcH',
  moreThan_10txs: 'LRW6iW3NGmT1wrVK3dTAq6UZ9qbEaYmS3y',
  moreThan_50txs: 'LdxToaZif4q1hWqKhNx5ieKsPunKXZMUgs',
  noUTXO: 'LP8fvvYWngYQ54BNL6s6HhSTBx94QaLTWq',
  someUTXO: 'LduWkLMXJNprvLi2P4LnfSGwQL24rdVzzk'
};

const rawtx =
  'add7d7f6929d619b1613d08c6422116f78ed9e77fceb91ef2bd9cb77367b5c02';
const index = 1517992;
const blockId = '63925b9ce9f3a51abfab0ff23f3847d9b9fb6e2757176742602e2a49ec679bdd';
const txId = '9ff4ec6b863811c7f9e84002e12a8f50e2af80c623e37faeafffc58097a95b51';

var api = null;
var coinAPI = null;

describe('api.ltc', async() => {
  beforeEach(async() => {
    api = new InfinitoApi(opts);
    coinAPI = api.LTC;
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
      ).LTC;

      try {
        await coinAPI.getBalance(addresses.normal);
        Assert.fail('Should throw exception');
      } catch (err) {
        Assert.equal(err.code, TestMessages.util.invalid_api_key.code);
        Assert.equal(err.message, TestMessages.util.invalid_api_key.message);
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
      console.log(res);
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
      /*  info.data.should.have.property('sys_fee');
      info.data.should.have.property('net_fee');
      info.data.should.have.property('confirmations');
      info.data.should.have.property('blockhash');
      info.data.should.have.property('blockheight'); */
      // SAME AS BCH, THESE FIELDS AREN'T RETURNED DURING TESTING

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