const F = require('./_frame.js');
const RLP = require('../index.js');

class Main extends F.Test {

	async run() {
		await this.valueTest();
		await this.returnHandlerTest();
	}

	async valueTest() {
		const rlp = RLP(this._demo);

		const normalVal = await rlp.getNormalValue();
		if(normalVal != 123)
			throw new Error("[FAIL] Didn't get our normal value back!");

		const promiseVal = await rlp.getPromiseValue();
		if(promiseVal != 123)
			throw new Error("[FAIL] Didn't get our promise value back!");

		return true;
	}

	async returnHandlerTest() {
		const rlpA = RLP(this._demo, { returnHandler: false });
		const rlpB = RLP(this._demo, { returnHandler: true });

		if(rlpA._isRateLimitProxy == true)
			throw new Error("[FAIL] Got handler back when requested without");

		if(rlpB._isRateLimitProxy != true)
			throw new Error("[FAIL] Didn't get handler back when requested with");

		return true;
	}

}

F.Test.run(Main);
