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
  secret: '<YOUR SECRET KEY>'
};
const api = new InfinitoApi(opts);
const coinAPI = api.BTC;

(async() => {
  var result = await coinAPI.getBalance('1Dp1TZfsMDfrNwuAzXi8mJwcXNA5xiHPor');
  console.log('result :', result);
})();
```