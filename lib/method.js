const Util = require('util');
const Format = require('string-template');
const { Http, Logger, AppError } = require('node-infinito-util');
const Messages = require('./messages');
const Config = require('./config');
/**
 * API Method class
 *
 * @class Method
 */
class Method {
  /**
   * Creates an instance of Method.
   * @param {Object} options
   * @memberof Method
   */
  constructor(options) {
    this.httpMethod = options.method || 'GET';
    this.name = options.name;
    this.url = options.url;
    this.params = options.params;
    this.auth = options.auth || true; // use for no-need-token API
  }

  /**
   * Set token provider
   *
   * @param {TokenProvider} value
   * @memberof Method
   */
  setTokenProvider(value) {
    this.tokenProvider = value;
  }

  /**
   * Set http provider
   *
   * @param {HttpProvider} value
   * @memberof Method
   */
  setHttpProvider(value) {
    this.httpProvider = value;
  }

  /**
   * Set base url
   *
   * @param {String} value
   * @memberof Method
   */
  setBaseUrl(value) {
    this.baseUrl = value;
  }

  /**
   * Attach dynamic method to object
   *
   * @param {*} hostObject
   * @memberof Method
   */
  attachToObject(hostObject) {
    let func = this._buildFunc();
    hostObject[this.name] = func;
  }

  /**
   * Build function call
   *
   * @returns
   * @memberof Method
   */
  _buildFunc() {
    let _this = this;
    let headers = { 'Content-Type': 'application/json' };
    let retry = 1;
    var func = async(...args) => {
      let url = _this._getRequestUrl(args);
      let data = _this._extractData(args);

      Logger.debug('url :', url, _this);

      if (this.auth !== false && _this.tokenProvider !== false) {
        let token = await _this.tokenProvider.getLatestToken();
        headers.Authorization = `${Config.AUTH_PREFIX} ${token}`;
      }

      try {
        let result = await Http.send(url, _this.httpMethod, headers, data);

        if (this.auth !== false) {
          if (retry > 0 && _this.tokenProvider !== false && _this._isTokenExpired(result)) {
            _this.tokenProvider.clearToken();
            retry--;
            return func(...args);
          }
        }
        return result.data;
      } catch (err) {
        Logger.error('request: ', url, _this.httpMethod, err);

        if (err.response && err.response.status == 401) {
          if (this.auth !== false) {
            if (retry > 0 && _this.tokenProvider !== false) {
              _this.tokenProvider.clearToken();
              retry--;
              return func(...args);
            }
          }
          throw new AppError(
            Util.format(Messages.invalid_api_key.message, 'opts'),
            Messages.invalid_api_key.code
          );
        }
        throw new AppError(
          Util.format(Messages.internal_error.message, 'opts') + ' (' + err.message + ')',
          Messages.invalid_api_key.code
        );
      }
    };

    return func;
  }

  /**
   * Get request url
   *
   * @param {*} args
   * @returns
   * @memberof Method
   */
  _getRequestUrl(args) {
    let params = this._extractParams(args);
    let url = this.baseUrl + Format(this.url, params);
    return url;
  }

  /**
   * Parse parameters
   *
   * @param {*} args
   * @returns
   * @memberof Method
   */
  _extractParams(args) {
    let params = {};

    if (this.params && this.params.length > 0) {
      for (let index = 0; index < this.params.length; index++) {
        let key = this.params[index];
        params[key] = args[index] != undefined ? args[index] : null;
      }
    }

    return params;
  }

  /**
   * Extract data
   *
   * @param {*} args
   * @returns
   * @memberof Method
   */
  _extractData(args) {
    let paramLen = this.params ? this.params.length : 0;
    let data = args.length > paramLen ? args[paramLen] : {};
    return data;
  }

  /**
   * Check token expired
   *
   * @param {Response} res
   * @returns
   * @memberof Method
   */
  _isTokenExpired(res) {
    let data = res.data || {};
    if (data.cd === 401 && data.msg === 'E00001: Invalid token') {
      return true;
    }

    return false;
  }
}

module.exports = Method;