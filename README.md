# rate-limit-proxy
## Automagically proxy an object for rate-limit/retry functionality
You give it an object, it'll wrap it up in a Proxy and jiggle it all to be promise compatable. This proxy can then manage concurrency and retry on fail.

## usage and options:
```
const proxiedObject = RLP(demoObject, {
	concurrency:      3,          // the amount of promises to allow running at once
	retryOnQueueFail: true,       // auto-retry when a fail promise occurs
	retryMaxAttempts: 2,          // maximum attempts of auto-retry
	retryInterval:    5000,       // how long we should wait before a retry
	returnHandler:    false,      // return the proxy control handler, instead of the proxied object
});

await Promise.all([
	proxiedObject.callAsMany();
	proxiedObject.promisesOnThisObject();
	proxiedObject.asYouWouldLike();
	proxiedObject.andEverythingWillBe();
	proxiedObject.managedForYou();
]);
```