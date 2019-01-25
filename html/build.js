const inputData = require('../lib/methods/index.js');
const InfinitoApi = require('../lib/api');
const Messages = require('../lib/messages');
const ConfigTest = require('../test/config.test');
const opts = {
  logLevel: ConfigTest.LOG_LEVEL,
};

global.inputData = inputData;
global.InfinitoApi = InfinitoApi;
global.Messages = Messages;
global.opts = opts;
