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
        if (!next.done)
            Promise.resolve(next.value)
                .then(value => {
                    this.step(value);
                }, error => {
                    this.reject(error);
                });
        else
            this.resolve(next.value);
    }
}

const __async = (genFunc) => {
    return (...args) => new AsyncFunctionOnce(genFunc, args).run();
};


module.exports = {
    __async
};
