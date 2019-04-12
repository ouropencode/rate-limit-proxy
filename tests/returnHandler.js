const F = require('./_frame.js');
const RLP = require('../index.js');

const test = new F.DemoClass();
let rlp;

// 1. Test we get the proxied object back, when it's requested.
rlp = RLP(test, { returnHandler: false });
if(!rlp || (rlp && rlp._isRateLimitProxy == true))
	throw new Error("[FAIL] Got handler back when requested without");

// 2. Test we get the handler, when it's requested.
rlp = RLP(test, { returnHandler: true });
if(!rlp || rlp._isRateLimitProxy != true)
	throw new Error("[FAIL] Didn't get handler back when requested with");

console.log("Test Passed");
