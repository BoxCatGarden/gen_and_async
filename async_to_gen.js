class Next {
    next;
    v;
    resolveYield;
    rejectYield;

    constructor(next, v, resolveYield, rejectYield) {
        this.next = next;
        this.v = v;
        this.resolveYield = resolveYield;
        this.rejectYield = rejectYield;
    }
}

class AsyncGenerator {
    #asyncFunc;
    #args;
    #done = false;
    #yielded = true;
    #returnValue = null;
    #nextQueue = new Next(null);
    #nextQueueTail = this.#nextQueue;
    #resolveNext = null;

    /**
     * @param asyncFunc - The async function (including async arrow function) on which this generator is based.
     * @param args - The arguments without `@_yield` for calling `@asyncFunc`.
     * @description -
     * The signature of `@asyncFunc` should be in the format like<br/>
     * "`asyncFunc(_yield[, para1[, para2[, ...[, paraN]]]])`" .<br/>
     * For example, "`baseFunc(_yield, a, b, c)`".
     * The first parameter `@_yield` is required, but the name of it
     * can be customized (e.g., "`abc`"). The `@_yield` argument will
     * be constructed and passed to `@asyncFunc` by
     * this generator automatically. <br/>
     * `@_yield` is a function with one parameter: `function _yield(value)` .
     * Use it to yield `@value` through "`await`": `await _yield(value)` .
     * To get the value of the "yield expression", use "`nextInput()`":
     * `nextInput(await _yield(value))` .
     * @see nextInput
     * */
    constructor(asyncFunc, ...args) {
        this.#asyncFunc = asyncFunc;
        this.#args = args;
    }

    #YIELD(value) {
        if (this.#yielded)
            throw new SyntaxError(
                'Yielded without "await". Try "await <gen>.YIELD(<value>)".');
        this.#yielded = true;

        let next = this.#nextQueue.next;
        this.#nextQueue = next;

        let resolveYield = next.resolveYield;
        let valuePromise = Promise.resolve(value);

        valuePromise.then(v => {
            resolveYield({
                value: v,
                done: false
            });
        });

        let nextPromise;

        if (next.next) {
            nextPromise = Promise.resolve(next.next.v);
            nextPromise.then(() => {
                this.#yielded = false;
            });
        } else
            nextPromise = new Promise(r => {
                this.#resolveNext = r;
            });

        return Promise.all([nextPromise, valuePromise]);
    }

    #nextDone(v) {
        return this.#returnValue.then(() => ({
            value: undefined,
            done: true
        }));
    }

    #nextEnqueue(v) {
        let resolveYield;
        let rejectYield;
        let yieldPromise = new Promise((r, e) => {
            resolveYield = r;
            rejectYield = e;
        });

        let next = new Next(
            null,
            v,
            resolveYield,
            rejectYield
        );
        this.#nextQueueTail.next = next;
        this.#nextQueueTail = next;

        if (this.#resolveNext) {
            this.#resolveNext(v);
            this.#resolveNext = null;
            this.#yielded = false;
        }

        return yieldPromise;
    }

    #nextInit(v) {
        let yieldPromise = this.#nextEnqueue(v);

        this.#yielded = false;

        let returnValue = this.#asyncFunc(value => {
            return this.#YIELD(value);
        }, ...this.#args);
        this.#asyncFunc = null;
        this.#args = null;
        this.#returnValue = returnValue;

        returnValue.then(
            value => {
                this.#nextQueue.next.resolveYield({
                    value: value,
                    done: true
                });
                this.#clearQueue();
            },
            error => {
                this.#nextQueue.next.rejectYield(error);
                this.#clearQueue();
            }
        );

        this.next = this.#nextEnqueue;

        return yieldPromise;
    }

    next = this.#nextInit;

    #clearQueue() {
        this.next = this.#nextDone;
        this.#done = true;
        this.#returnValue = Promise.resolve();
        this.#resolveNext = null;
        this.#yielded = true;

        let node = this.#nextQueue.next.next;
        this.#nextQueue = null;
        this.#nextQueueTail = null;
        while (node) {
            node.resolveYield({
                value: undefined,
                done: true
            });
            node = node.next;
        }
    }

    throw(e) {
        if (this.#done)
            return Promise.resolve(e).then(error => {
                throw error;
            });
    }

    return(v) {
        if (this.#done)
            return Promise.resolve(v).then(value => ({
                value: value,
                done: true
            }));
    }
}


/**
 * Use it like "`v = nextInput(await _yield(value));`" .
 * @param yieldExpressionResult - The result of a "yield expression".
 * @return - The value of the "yield expression".
 * */
const nextInput = (yieldExpressionResult) => yieldExpressionResult[0];


module.exports = {
    AsyncGenerator,
    nextInput,
};
