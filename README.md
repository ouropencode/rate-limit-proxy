# rate-limit-proxy
## Automagically proxy an object for rate-limit/retry functionality
You give it an object, it'll wrap it up in a proxy and jiggle it all to be promise compatable. This proxy can then manage concurrency and retry on fail.

## Installation:
```
npm install rate-limit-proxy --save
```

## Dependencies
None

## Usage and options:
```js
const RLP = require('rate-limit-proxy');

const demoObject = {                    // our sample object we'll be working with.
  getVersion() {
    return "1.0.0";
  }

  async getUserFromDatabase(id) {
    // [...]
  }
};

const obj = RLP(demoObject, {
  concurrency:      3,                  // the amount of promises to allow running at once
  retryOnQueueFail: true,               // auto-retry when a fail promise occurs
  retryMaxAttempts: 2,                  // maximum attempts of auto-retry
  retryInterval:    5000,               // how long we should wait before a retry
  returnHandler:    false,              // return the proxy control handler, instead of the proxied object
  interceptor:      [AsyncFunction]     // a method to call that can modify the value of resolve data
});

const version = await obj.getVersion(); // => "1.0.0"   - this became promise driven automatically

await Promise.all([
  obj.getUser(1),
  obj.getUser(2),
  obj.getUser(3),
  obj.getUser(4),                       // You can call any number of promise simultaneously
  obj.getUser(5),                       // and they will run with your desired options :)
  obj.getUser(6),
  obj.getUser(7),
  obj.getUser(8),
  obj.getUser(9),
  obj.getUser(10)
]);
```
