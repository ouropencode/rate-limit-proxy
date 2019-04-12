const DEBUG = process.env.DEBUG;

class RateLimitProxy {

	constructor(obj, options = {}) {
		this._options = {
			concurrency:      3,
			retryOnQueueFail: true,
			retryMaxAttempts: 2,
			retryInterval:    5000,
			interceptor:      false,
			returnHandler:    false,
		  ...options
		};
		this._obj     = obj;
		this._proxy   = this._createProxy();
		this._queue   = [];
		this._nextId  = 0;
		this._isRateLimitProxy = true;
	}

	getProxy() {
		return this._proxy;
	}

	_createProxy() {
		const obj = this._obj;

		const execute = (method, args) => {
			return new Promise((resolve, reject) => {
				this._execute(resolve, reject, method, args);
			});
		};

		return new Proxy(obj, {
			get(target, key, receiver) { // hook the getter for everything
				if(typeof key == "symbol")
					console.error("RateLimitProxy cannot handle 'symbols'. Maybe you tried to console.log the proxy? This isn't possible.");

				return (...args) => {
					if(!obj[key]) throw new Error("unknown property '" + key + "'");
					return execute(obj[key], args);
				};
			}
		});
	}

	async _execute(resolve, reject, method, args) {
		const buildExecutor = id => {
			const intercept = async data => {
				if(typeof this._options.interceptor == 'function')
					data = await this._options.interceptor(data);
				return data;
			}

			const exec = (done, fail, attempts = 0) => {
				const result = method.apply(this._obj, args);
				if(typeof result != 'object' || typeof result.then != 'function')
					return intercept(result).then(done); // non-promise handler, return resolved promise with value.

				return result.then(data => intercept(data).then(done))
					.catch(err => {
						if(!this._options.retryOnQueueFail || attempts >= this._options.retryMaxAttempts)
							return fail(err);

						if(DEBUG) console.log("  " + id + ": failed, retrying");
						setTimeout(() => {
							exec(done, fail, attempts + 1);
						}, this._options.retryInterval);
					});
			};

			return () => new Promise(done => exec(
				v => { done(v); resolve(v); },
				e => { done(e); reject(e); })
			);
		};

		this._nextId++;

		const task = {
			id:       this._nextId,
			executor: buildExecutor(this._nextId),
			running:  false
		};

		const finishAndRun = async () => {
			const running   = this._queue.filter(t => t.running == true);
			const remaining = this._queue.filter(t => t.running == false);
			if(running.length < this._options.concurrency && remaining.length > 0) {
				const nextTask = remaining[0];
				nextTask.running = true;
				if(DEBUG) console.log(nextTask.id + " started [" + (running.length + 1) + " running - " + remaining.length + " pending]");
				await nextTask.executor();
				if(DEBUG) console.log(nextTask.id + " finished");
				this._queue = this._queue.filter(t => t.id != nextTask.id);
				return finishAndRun();
			}
		};

		this._queue.push(task);
		return finishAndRun();
	}

}

module.exports = (obj, options = undefined) => {
	const rlp = new RateLimitProxy(obj, options);

	if(typeof options == "object" && options.returnHandler == true)
		return rlp;

	return rlp.getProxy();
};
