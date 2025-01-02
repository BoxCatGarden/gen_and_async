class AsyncFunctionOnce {
    generator;
    resolve;
    reject;

    constructor(genFunc, args) {
        this.generator = genFunc(...args);
    }

    run() {
        let ret = new Promise((r, h) => {
            this.resolve = r;
            this.reject = h;
        });
        this.step();
        return ret;
    }

    step(v) {
        let next;
        try {
            next = this.generator.next(v);
        } catch (e) {
            this.reject(e);
            return;
        }
        if (!next.done) {
            Promise.resolve(next.value)
                .then(value => {
                    this.step({ok: true, value});
                }, value => {
                    this.step({ok: false, value});
                });
        } else
            this.resolve(next.value);
    }
}

/**
 * To await a value, use it like the following:
 * ```
 * let val = _await(yield value);
 * ```
 * */
const _await = (expResult) => {
    if (expResult.ok)
        return expResult.value;
    else
        throw expResult.value;
};

/**
 * Wrap the generator function as an async function.
 * @param genFunc - The generator function.
 * @return - The output async function.
 * @see _await
 * */
const __async = (genFunc) => {
    return (...args) => new AsyncFunctionOnce(genFunc, args).run();
};


module.exports = {
    __async,
    _await,
};
