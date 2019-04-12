class DemoClass {

	constructor() {
		this._failTwiceCount = 0;
	}

	getNormalValue() {
		return 123;
	}

	async getPromiseValue() {
		return 123;
	}

	getDelayedValue() {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(123), Math.random() * 100 | 0);
		});
	}

	getFailTwiceValue() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if(this._failTwiceCount == 2)
					return resolve(123);
				this._failTwiceCount++;
				reject("expected error");
			}, Math.random() * 100 | 0);
		});
	}

	getFailForeverValue() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				reject("expected error");
			}, Math.random() * 100 | 0);
		});
	}

}

class Test {

	constructor() {
		this._demo = new DemoClass();
	}

	static async run(Test) {
		const test = new Test();
		try {
			await test.run();
			console.log("TEST PASSED");
		} catch(e) {
			console.error("TEST FAILED");
			console.error(e);
		}
	}

}

module.exports = {
	DemoClass,
	Test
};
