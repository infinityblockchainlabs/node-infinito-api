const Util = require('util');
const Messages = require('./messages');
const {
  Http,
  TokenProvider,
  Logger,
  AppError,
  Helper
} = require('node-infinito-util');
const Methods = require('./methods');
const Method = require('./method');

/**
 * Api class
 *
 * @class Api
 */
class Api {
  /**
   * Creates an instance of Api.
   * @param {Object} options
   * @param {String} options.apiKey              (required) API Key
   * @param {String} options.secret              (required) Secret Key
   * @param {String} options.baseUrl             (optional) Base url of api
   * @param {String} options.version             (optional) API version. Default is v1
   * @param {String} options.logger              (optional) Logger interface
   * @param {String} options.logLevel            (optional) Set internal logger level (ALL < DEBUG < INFO < WARN < ERROR < NONE)
   * @memberof Api
   */
  constructor(options) {
    const defaultOpt = {
      baseUrl: 'https://api.infinito.io',
      version: 'v1'
    };

    if (!options) {
      throw new AppError(
        Util.format(Messages.missing_parameter.message, 'options'),
        Messages.missing_parameter.code
      );
    }

    // this._enforce(options, ['apiKey', 'secret'])
    this.options = Helper.merge({}, defaultOpt, options);
    this.options.baseUrl = this._removeEndString(this.options.baseUrl, '/');

    let authUrl = `${this.options.baseUrl}/iam/token`;
    this.options.baseUrl = `${this.options.baseUrl}/chains/${this.options.version}`;

    if (this.options.tokenProvider !== undefined) {
      this.tokenProvider = this.options.tokenProvider;
    } else {
      this.tokenProvider = new TokenProvider({
        apiKey: options.apiKey,
        secret: options.secret,
        url: authUrl,
      });
    }

    if (this.options.httpProvider) {
      this.httpProvider = this.options.httpProvider;
    } else {
      this.httpProvider = Http;
    }

    if (this.options.logger) {
      Logger.setLogger(this.options.logger);
    }
    Logger.setLogLevel(this.options.logLevel);

    if (!Methods[this.options.version]) {
      throw new AppError(
        Util.format(Messages.invalid_version.message, this.options.version),
        Messages.invalid_version.code
      );
    }

    let definitions = Methods[this.options.version];
    Object.keys(definitions).forEach(groupName => {
      this.extendMethod(groupName, definitions[groupName]);
    });
  }

  /**
   * Generate api method and bind to object
   *
   * @param {*} groupName
   * @param {*} methods
   * @memberof Api
   */
  extendMethod(groupName, methods) {
    let group = {};
    this[groupName] = group;
    methods.forEach(methodOpt => {
      let method = new Method(methodOpt);
      method.setTokenProvider(this.tokenProvider);
      method.setHttpProvider(this.httpProvider);
      method.setBaseUrl(this.options.baseUrl);
      method.attachToObject(group);
    });
  }

  /**
   * Enforce require key in object
   *
   * @param {Object} opts
   * @param {Array[String]} requiredKeys
   * @memberof Api
   */
  _enforce(opts, requiredKeys) {
    if (!opts || typeof opts !== 'object') {
      throw new AppError(
        Util.format(Messages.missing_parameter.message, 'opts'),
        Messages.missing_parameter.code
      );
    }

    requiredKeys.forEach(function(requiredKey) {
      if (!opts[requiredKey])
        throw new AppError(
          Util.format(Messages.missing_parameter.message, requiredKey),
          Messages.missing_parameter.code
        );
    });
  }

  /**
   * Remove end splash
   *
   * @param {*} str
   * @memberof Api
   */
  _removeEndString(str, chr) {
    if (str) {
      while (str.length > 0 && str.charAt(str.length - 1) === chr)
        str = str.substr(0, str.length - 1);
    }

    return str;
  }
}

module.exports = Api;