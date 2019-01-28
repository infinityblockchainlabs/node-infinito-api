# Set up with React native



### Installation guide
1. Make sure you have Node version 6 or later installed, if not, get it on the [Node website](http://nodejs.org/)

	`node --version`
    

2. Use create-react-native-app to create the project boilerplate

	`react-native init my-app`

3. Install [node-libs-browser](https://github.com/webpack/node-libs-browser)
	
    `npm install --save node-libs-browser`

4. Install [react-native-randombytes](https://github.com/mvayngrib/react-native-randombytes)

    `npm install --save react-native-randombytes`

5. Create a file called *rn-cli.config.js* on the root of the project and add the following code into it:
	
    ```javascript
   	module.exports = {
  	  resolver: {
        extraNodeModules: require('node-libs-browser')
  	  }
	}
	```

6. Create a file called *global.js* on the root of the project and add the following code into it:

	```javascript
    // Inject node globals into React Native global scope.
	// Inject node globals into React Native global scope.
	global.Buffer = require('buffer').Buffer;
	global.process = require('process');
	global.process.env.NODE_ENV = __DEV__ ? 'development' : 'production';

	if (typeof __dirname === 'undefined') global.__dirname = '/';
	if (typeof __filename === 'undefined') global.__filename = '';

	// Needed so that 'stream-http' chooses the right default protocol.
	global.location = {
	  protocol: 'file:'
	};

	if (typeof btoa === 'undefined') {
      global.btoa = function (str) {
        return new Buffer(str, 'binary').toString('base64');
      };
	}

	if (typeof atob === 'undefined') {
	  global.atob = function (b64Encoded) {
		  return new Buffer(b64Encoded, 'base64').toString('binary');
	  };
	}

	
	global.crypto = {
	  getRandomValues(byteArray) {
	    let randomBytes = require('react-native-randombytes').randomBytes;
	    const bytes = randomBytes(byteArray.length);
	    for (var i = 0; i < bytes.length; i++) {
	      byteArray[i] = bytes[i];
	    }
	  }
	};

	```
    
7. Import the *global.js* file into top of your *[index.js]()* file
	
    ```javascript
   	import './global';
	
	// Current code of index.js file will be bellow here
   	```
    
8. Now we can install the `node-infinito-api`

	`npm install --save node-infinito-api`
    

9. Using the infinito-api in your project
	```javascript
    const InfinitoApi = require('node-infinito-api');
   	```

10. Before build your app please run.
    `react-native link`

### If you got error related to `scrypto` or `stream`. Follow below step
 1. `npm install rn-nodeify --save-dev`
 2. In file package.json. Add to 'script'
 
    "postinstall": "node_modules/.bin/rn-nodeify --hack --install"
 

