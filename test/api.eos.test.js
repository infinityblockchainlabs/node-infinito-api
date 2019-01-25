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

const rawtx = '4da6e3759cb08d5b9a13a4d3afb9309a10c78209babb6b04c34655aba5d80e83';
const pubkey = 'EOS8MYaxw9eYYcoHzGDAYtzG761bEHsbL4xEuoEiPbVA3pCRHP3Xr';
const account_name = 'fepxecwzm41t';
const asset_id = 'EOS';

var api = null;
var coinAPI = null;

describe('api.eos', async() => {
  beforeEach(async() => {
    api = new InfinitoApi(opts);
    coinAPI = api.EOS;
  });

  // -------------------------------------------------------------------------------------------------------------------------
  /** *********************** get Balance ***********************************/
  describe('#getBalance', async() => {
    it('', async() => {
      let info = await coinAPI.getBalance(account_name, asset_id);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('account');
      info.data.should.have.property('assets');
    });
  });

  /** *********************** get All Account Name from Public Key ***********************************/
  describe('#getlAlAccountNamefromPublicKey', async() => {
    it('', async() => {
      let info = await coinAPI.getAccounts(pubkey);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('account_names');
    });
  });

  /** *********************** get Account Info ***********************************/
  describe('#getAccountInfo', async() => {
    it('', async() => {

      let info = await coinAPI.getAccountInfo(account_name);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('account_name');
      info.data.should.have.property('head_block_num');
      info.data.should.have.property('head_block_time');
      info.data.should.have.property('privileged');
      info.data.should.have.property('last_code_update');
      info.data.should.have.property('created');
      info.data.should.have.property('ram_quota');
      info.data.should.have.property('net_weight');
      info.data.should.have.property('cpu_weight');
      info.data.should.have.property('net_limit');
      info.data.should.have.property('cpu_limit');
      info.data.should.have.property('ram_usage');
      info.data.should.have.property('permissions');
      info.data.should.have.property('total_resources');
      info.data.should.have.property('self_delegated_bandwidth');
      info.data.should.have.property('refund_request');
      info.data.should.have.property('voter_info');
    });
  });

  /** *********************** get Total Balance All Accounts by Publish Key ***********************************/
  describe('#getTotalBalanceAllAccountsbyPublishKey', async() => {
    it('', async() => {
      let info = await coinAPI.getBalanceByPubKey(pubkey, 'eos', 'EOS');
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('total');
      info.data.should.have.property('accounts');
    });
  });

  /** *********************** send Raw Transaction ***********************************/
  describe('#sendTransaction', async() => {
    it('', async() => {
      let res = await coinAPI.sendTransaction({ rawtx: rawtx });
      res.should.have.property('cd');
    });
  });
  /** *********************** get Current Ram Price ***********************************/
  describe('#getCurrentRamPrice', async() => {
    it('', async() => {
      let info = await coinAPI.getRamPrice({});
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('price');
    });
  });

  /** *********************** get Current Cpu Net Price ***********************************/
  describe('#getCurrentCpuNetPrice', async() => {
    it('', async() => {
      let info = await coinAPI.getCpuPrice({});
      // console.log(info);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('cpu');
      info.data.should.have.property('net');
    });
  });

  /** *********************** get EOS Tokens List ***********************************/
  describe('#getEOSTokensList', async() => {
    it('', async() => {
      let info = await coinAPI.getContractInfo();
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('total');
      info.data.should.have.property('from');
      info.data.should.have.property('to');
      info.data.should.have.property('contracts');
    });
  });
  /** *********************** get Contract Balance ***********************************/
  describe('#getContractBalance', async() => {
    it('', async() => {
      let info = await coinAPI.getContractBalance('leonizeronet', 'eosio.token', 'EOS');
      console.log(info);
      info.should.have.property('cd');
      info.should.have.property('data');
      info.data.should.have.property('account');
      info.data.should.have.property('assets');
    });
  });

});