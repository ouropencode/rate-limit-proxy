const F = require('./_frame.js');
const RLP = require('../index.js');

class RetryTestUnqueued extends F.Test {

	async run() {
		const rlp = RLP(this._demo, { concurrency: 1, retryInterval: 100 });

		await Promise.all([
			this.failTwiceThenPass(rlp),
			this.failTwiceThenPass(rlp),
			this.failTwiceThenPass(rlp),
			this.failForeverThenFail(rlp),
			this.failForeverThenFail(rlp),
			this.failForeverThenFail(rlp),
			this.failTwiceThenPass(rlp),
			this.failTwiceThenPass(rlp),
			this.failTwiceThenPass(rlp),
			this.failForeverThenFail(rlp),
			this.failForeverThenFail(rlp),
			this.failForeverThenFail(rlp),
			this.failTwiceThenPass(rlp),
			this.failTwiceThenPass(rlp),
			this.failTwiceThenPass(rlp),
			this.failForeverThenFail(rlp),
			this.failForeverThenFail(rlp),
			this.failForeverThenFail(rlp),
			this.failTwiceThenPass(rlp),
			this.failTwiceThenPass(rlp),
			this.failTwiceThenPass(rlp),
			this.failForeverThenFail(rlp),
			this.failForeverThenFail(rlp),
			this.failForeverThenFail(rlp)
		]);
	}

	async failTwiceThenPass(rlp) {
		const failTwiceValue = await rlp.getFailTwiceValue();
		if(failTwiceValue != 123)
			throw new Error("[FAIL] Didn't get our value back in the end!");

		return true;
	}

	async failForeverThenFail(rlp) {
		let failForeverValue = -123;
		try {
			failForeverValue = await rlp.getFailForeverValue();
		} catch(e) {
			return true;
		}

		throw new Error("[FAIL] We got a value when we expected to fail forever!");
	}

}

F.Test.run(RetryTestUnqueued);
