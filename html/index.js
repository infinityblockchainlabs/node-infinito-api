var api = null;
var coinAPI = null;
var appAPI = new Vue({
  el: '#restAPI',
  data: {
    config: {
      baseUrl: 'https://api.infinito.io',
      apiKey: '<YOUR API KEY>',
      secret: '<YOUR SECRET KEY>',
    },
    form: {
      service:"",
      version: '',
      coin: '',
      function: '',
    },
    inputData: null,
    objCoins: null,
    objVersion:null,
    serviceList:[],
    versionList: [],
    coinList: [],
    functionList: [],
    paramList: [],
    output: null,
    input: '',
    requestInfo: {
      requestURL: '',
      statusCode: '',
    },
    responseInfo: {},
  },
  mounted: function() {
    let self = this;
    self.inputData = inputData;
    for (var item in inputData) {
      this.serviceList.push(item);
    }

    // detect call ajax to
    var oldXHR = window.XMLHttpRequest;

    function newXHR() {
      var realXHR = new oldXHR();
      realXHR.addEventListener(
        'readystatechange',
        function() {
          if (realXHR.readyState == 1) {
            //   alert('server connection established');
          }
          if (realXHR.readyState == 2) {
            //   alert('request received');
            self.requestInfo.requestURL = realXHR.responseURL;
            self.requestInfo.statusCode = realXHR.status;
          }
          if (realXHR.readyState == 3) {
            //   alert('processing request');
          }
          if (realXHR.readyState == 4) {
            //  alert('request finished and response is ready');
          }
        },
        false
      );
      return realXHR;
    }
    window.XMLHttpRequest = newXHR;
  },
  methods: {
    changeService: function(){
      let self = this;

      // RESET
      self.versionList = [];
      self.functionList = [];
      self.paramList = [];
      self.input = '';
      self.output = null;
      self.requestInfo = {
        requestURL: '',
        statusCode: '',
      };
      //reset form
      self.form.version ="";
      self.form.coin ="";
      self.form.function ="";

      self.objVersion = self.getObjectChildFromKeyName(
        self.form.service,
        inputData
      );
      self.versionList = self.getKeyListFromObject(self.objVersion);
    },
    changeVersion: function() {
      let self = this;
      if(!self.form.version){
        return;
      }
      // RESET
      self.functionList = [];
      self.input = '';
      self.output = null;
      self.requestInfo = {
        requestURL: '',
        statusCode: '',
      };
      if(self.form.service === 'chains'){
        self.objCoins = self.getObjectChildFromKeyName(
          self.form.version,
          inputData
        );
        self.coinList = self.getKeyListFromObject(self.objCoins);
      }else{

        self.objVersion = self.getObjectChildFromKeyName(
          self.form.service,
          inputData
        );
        self.objCoins = self.getObjectChildFromKeyName(
          self.form.version,
          self.objVersion
        );
        self.functionList = self.getObjectChildFromKeyName(
          self.form.service,
          self.objCoins
        );
      }
   
    },
    changeCoin: function() {
      var self = this;
      // RESET
      self.input = '';
      self.output = null;
      self.requestInfo = {
        requestURL: '',
        statusCode: '',
      };
      self.functionList = self.getObjectChildFromKeyName(
        self.form.coin,
        self.objCoins
      );
    },
    changeFunction: function() {
      var self = this;
      self.requestInfo = {
        requestURL: '',
        statusCode: '',
      };
      var paramList = self.getParamListFromFunc(
        self.form.function,
        self.functionList
      );
      self.paramList = self.createParamList(paramList);
      if(self.form.service ==='chains'){
        self.input = `api.getService('${self.form.service}','${self.form.version}').${self.form.coin}.${self.form.function}(`;
      }else{
        self.input = `api.getService('${self.form.service}','${self.form.version}').${self.form.function}(`;
      }
     
      for (var i = 0; i < self.paramList.length; i++) {
        if (i != self.paramList.length - 1) {
          self.input += self.paramList[i].name + ', ';
        } else {
          self.input += self.paramList[i].name;
        }
      }
      self.input += ')';
    },
    onSubmit: function() {
      let self = this;

      // set config options for API
      opts.apiKey = self.config.apiKey;
      opts.secret = self.config.secret;
      opts.baseUrl = self.config.baseUrl;
      opts.version = self.form.version;
      api = new InfinitoApi(opts);

      coinAPI = self.getObjectChildFromKeyName(self.form.coin, api);
      var paramListValue = self.getParamlistValue(self.paramList);
      var result = coinAPI[self.form.function](...paramListValue)
        .then(function(res) {
          self.output = res;
        })
        .catch(function(err) {
          self.output = err;
        });
    },
    getObjectChildFromKeyName: function(keyName, objectParent) {
      for (var item in objectParent) {
        if (keyName.toLowerCase() == item.toLowerCase()) {
          var objectChild = objectParent[item];
          return objectChild;
        }
      }
      return null;
    },
    getKeyListFromObject(object) {
      let result = [];
      for (var item in object) {
        result.push(item);
      }
      return result;
    },
    getParamListFromFunc(functionName, functionList) {
      for (var i = 0; i < functionList.length; i++) {
        var item = functionList[i];
        if (item.name == functionName) {
          return item.params;
        }
      }

      return null;
    },
    createParamList(paramList) {
      var result = [];
      for (var i = 0; i < paramList.length; i++) {
        console.log(paramList[i]);
        var itemPush = {
          name: paramList[i],
          value: '',
        };
        result.push(itemPush);
      }
      return result;
    },
    getParamlistValue(paramList) {
      var result = [];
      for (var i = 0; i < paramList.length; i++) {
        result.push(paramList[i].value);
      }
      return result;
    },
  },
});