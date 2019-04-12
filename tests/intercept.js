const F = require('./_frame.js');
const RLP = require('../index.js');

class Main extends F.Test {

	async run() {
		const rlp = RLP(this._demo, {
			interceptor: this._intercept
		});

		const value = await rlp.getNormalValue();
		if(value != 321)
			throw new Error("[FAIL] intercept didn't modify value");
	}

	async _intercept(data) {
		if(data == 123)
			return 321;
		return data;
	}

}

F.Test.run(Main);
