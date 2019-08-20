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


var api = null;
var exchangeAPI = null;
var id = null;

describe('api.exchange', async() => {
  beforeEach(async() => {
    api = new InfinitoApi(opts);
    exchangeAPI = api.getExchangeService().Exchange;    
    let transactions = await exchangeAPI.getTransactions();    
    if (transactions.data.length > 0)
      id = transactions.data[0].id;
  });
  // ---------------------------------------------------------------------------------------------------
  /** ************************* get Currencies *******************************/
  describe('#getCurrencies', async() => {
    it('', async() => {
      let info = await exchangeAPI.getCurrencies();
      // console.log(info);     
      info.should.have.property('data');
      info.should.have.property('total');
      info.should.have.property('offset');
      info.should.have.property('limit');      
    });
  });

  /** ************************* get Transactions *******************************/
  describe('#getTransactions', async() => {
    it('', async() => {
      let info = await exchangeAPI.getTransactions();
      // console.log(info);
      info.should.have.property('data');
      info.should.have.property('total');
      info.should.have.property('offset');
      info.should.have.property('limit'); 
    });
  });

  /** ************************* get Transaction *******************************/
  describe('#getTransaction', async() => {
    it('', async() => {        
      let info = await exchangeAPI.getTransaction(id);
      // console.log(info);        
      info.should.have.property('data');        
    });
  });

  /** ************************* create Transaction *******************************/
  describe('#createTransaction', async() => {
    it('success', async() => {
      let info = await exchangeAPI.createTransaction({ provider: 'changelly', from: 'dai', to: 'bat', amount: 100, address: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359' });
      // console.log(info);      
      info.should.have.property('data');      
    });    
  });

  /** ************************* estimate Transaction *******************************/
  describe('#estimateTransaction', async() => {
    it('', async() => {
      let res = await exchangeAPI.estimateTransaction('dai', 'bat', 1);
      // console.log(res);      
      res.should.have.property('data');      
    });
  });

  /** ************************* get min amount *******************************/
  describe('#getMinAmount', async() => {
    it('', async() => {
      let res = await exchangeAPI.getMinAmount('changelly', 'dai', 'bat');
      // console.log(res);      
      res.should.have.property('data');      
    });
  });
  /** ************************* broadcast raw *******************************/
  describe('#broadcastTransaction', async() => {
    it('', async() => {
      let raw = '123';
      let res = await exchangeAPI.broadcastTransaction({ id: '5d4a6e2b67151d0238791c04', raw_tx: raw });
      // console.log(res);
      res.should.have.property('data');
    });
  });
});