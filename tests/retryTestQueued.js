const F = require('./_frame.js');
const RLP = require('../index.js');

class RetryTestQueued extends F.Test {

	async run() {
		const rlp = RLP(this._demo, { concurrency: 3, retryInterval: 10 });

		await Promise.all([
			this.failForever(rlp),
			this.failForever(rlp),
			this.failForever(rlp),
			this.failForever(rlp),
			this.failForever(rlp),
			this.failForever(rlp),
			this.failForever(rlp),
			this.failForever(rlp),
			this.failForever(rlp),
			this.failForever(rlp),
			this.failForever(rlp),
			this.failForever(rlp)
		]);
	}


	async failForever(rlp) {
		let failForeverValue = -123;
		try {
			failForeverValue = await rlp.getFailForeverValue();
		} catch(e) {
			return true;
		}

		throw new Error("[FAIL] We got a value when we expected to fail forever!");
	}

}

F.Test.run(RetryTestQueued);
