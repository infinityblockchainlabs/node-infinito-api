# Documentation

- For Documentation, visit https://platform.infinito.io/docs/

# Install

```
npm i node-infinito-api
```

# Example

```javascript
const InfinitoApi = require('node-infinito-api');
const opts = {
  apiKey: '<YOUR API KEY>',
  secret: '<YOUR SECRET KEY>',
  // baseUrl: 'https://api.infinito.io',          // Mainnet
  // baseUrl: 'https://sandbox-api.infinito.io',  // Sandbox (Testnet): support only BTC, DASH, ETH, NEO, EOS 
};
const api = new InfinitoApi(opts);
const coinAPI = api.getChainService().BTC;

(async() => {
  var result = await coinAPI.getBalance('1Dp1TZfsMDfrNwuAzXi8mJwcXNA5xiHPor');
  console.log('result :', result);
})();
```