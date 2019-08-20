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

(async() => {
  // Use multi-chain api
  const btcAPI = api.getChainService().BTC;
  var balance = await btcAPI.getBalance('1Dp1TZfsMDfrNwuAzXi8mJwcXNA5xiHPor');
  console.log('balance :', balance);

  // Use exchange-api
  const exchangeAPI = api.getExchangeService();
  var currencies = await exchangeAPI.getCurrencies();
  console.log('currencies :', currencies);
})();
```