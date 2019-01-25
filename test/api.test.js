const Assert = require('assert');
const Util = require('util');
const InfinitoApi = require('../index');
const Messages = require('../lib/messages');
const TestMessages = require('./messages');

describe('api', async() => {
  describe('#constructor()', async() => {
    it('Should be errored when missing opts', async() => {
      Assert.throws(
        () => {
          new InfinitoApi();
        },
        err => {
          if (err.code !== Messages.missing_parameter.code) return false;
          if (
            err.message !==
            Util.format(Messages.missing_parameter.message, 'options')
          )
            return false;

          return true;
        }
      );
    });

    it('Should be errored when missing options.apiKey', async() => {
      Assert.throws(
        () => {
          new InfinitoApi({});
        },
        err => {
          if (err.code !== TestMessages.util.missing_parameter.code)
            return false;

          if (
            err.message !==
            Util.format(Messages.missing_parameter.message, 'options.apiKey')
          )
            return false;


          return true;
        }
      );
    });

    it('Should be errored when missing options.secret', async() => {
      Assert.throws(
        () => {
          new InfinitoApi({ apiKey: 'apiKey' });
        },
        err => {
          if (err.code !== TestMessages.util.missing_parameter.code) return false;
          if (
            err.message !==
            Util.format(Messages.missing_parameter.message, 'options.secret')
          )
            return false;

          return true;
        }
      );
    });
  });
});