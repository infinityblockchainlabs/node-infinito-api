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

  describe('#serviceList', async() => {
    it('Retrieve list', async() => {
      Assert.ok(InfinitoApi.serviceNames().length > 0);
    });
  });

  describe('#getService', async() => {
    it('Not exist service', async() => {
      let api = new InfinitoApi({ apiKey: 'apiKey', secret: 'my_secret_key' });

      Assert.throws(
        () => {
          api.getService('NOT_EXIST');
        },
        err => {
          if (err.code !== Messages.invalid_parameter.code) return false;
          if (
            err.message !==
            Util.format(Messages.invalid_parameter.message, 'name')
          )
            return false;

          return true;
        }
      );
    });

    it('Not exist version', async() => {
      let api = new InfinitoApi({ apiKey: 'apiKey', secret: 'my_secret_key' });

      Assert.throws(
        () => {
          api.getService('chains', 'v100');
        },
        err => {
          if (err.code !== Messages.invalid_parameter.code) return false;
          if (
            err.message !==
            Util.format(Messages.invalid_parameter.message, 'version')
          )
            return false;

          return true;
        }
      );
    });

    it('service.chains.v1', async() => {
      let api = new InfinitoApi({ apiKey: 'apiKey', secret: 'my_secret_key' });

      let service = api.getService('chains', 'v1');

      Assert.ok(service !== undefined && service != null, 'Service must be exist');
      Assert.ok(service.BTC !== undefined && service.BTC != null, 'Service BTC must be exist');
      Assert.ok(service.BCH !== undefined && service.BCH != null, 'Service BCH must be exist');
      Assert.ok(service.LTC !== undefined && service.LTC != null, 'Service LTC must be exist');
      Assert.ok(service.DOGE !== undefined && service.DOGE != null, 'Service DOGE must be exist');
      Assert.ok(service.DASH !== undefined && service.DASH != null, 'Service DASH must be exist');
      Assert.ok(service.ETC !== undefined && service.ETC != null, 'Service ETC must be exist');
      Assert.ok(service.ETH !== undefined && service.ETH != null, 'Service ETH must be exist');
      Assert.ok(service.NEO !== undefined && service.NEO != null, 'Service NEO must be exist');
      Assert.ok(service.EOS !== undefined && service.EOS != null, 'Service EOS must be exist');
      Assert.ok(service.ADA !== undefined && service.ADA != null, 'Service ADA must be exist');
    });
  });

});