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
    #started = false;
    #done = false;
    #yielded = true;
    #nextQueue = null;
    #nextQueueTail = null;
    #resolveNext = null;
    #lastReturn = null;

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

        let valuePromise = Promise.resolve(value);

        valuePromise.then(v => {
            let next = this.#nextQueue.next;
            this.#nextQueue = next;
            next.resolveYield({
                value: v,
                done: false
            });
        }, () => {
        });

        let nNext = this.#nextQueue.next.next;
        let nextPromise;

        if (nNext) {
            if (nNext.rejectYield) {
                nextPromise = Promise.resolve(nNext.v);
                nextPromise.then(() => {
                    this.#yielded = false;
                });
            } else {
                nextPromise = new Promise(() => {
                });
                valuePromise.then(() => {
                    this.#clearQueue();
                }, () => {
                });
            }
        } else
            nextPromise = new Promise(r => {
                this.#resolveNext = r;
            });

        return Promise.all([nextPromise, valuePromise]);
    }

    #nextDone(v) {
        return this.#lastReturn.then(
            () => ({
                value: undefined,
                done: true
            }),
            () => ({
                value: undefined,
                done: true
            })
        );
    }

    #nextEnqueue(v) {
        v = {v};

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
        this.next = this.#nextEnqueue;

        let asyncFunc = this.#asyncFunc;
        let args = this.#args;
        this.#start();

        let yieldPromise = this.#nextEnqueue(v);
        this.#yielded = false;

        let returnValue = asyncFunc(value => {
            return this.#YIELD(value);
        }, ...args);

        returnValue.then(
            value => {
                this.#nextQueue.next.resolveYield({
                    value: value,
                    done: true
                });
                this.#nextQueue = this.#nextQueue.next;
                this.#clearQueue();
            },
            error => {
                this.#nextQueue.next.rejectYield(error);
                this.#nextQueue = this.#nextQueue.next;
                this.#clearQueue();
            }
        );

        return yieldPromise;
    }

    next = this.#nextInit;

    #clearQueue() {
        let node = this.#nextQueue.next;
        this.#end();

        while (node && node.rejectYield) {
            node.resolveYield({
                value: undefined,
                done: true
            });
            node = node.next;
        }

        if (node)
            node.resolveYield(node.v);
    }

    #start() {
        this.#started = true;
        this.#asyncFunc = null;
        this.#args = null;
        this.#nextQueue = new Next(null);
        this.#nextQueueTail = this.#nextQueue;
        this.#lastReturn = Promise.resolve();
    }

    #end() {
        this.next = this.#nextDone;
        this.#done = true;
        this.#resolveNext = null;
        this.#yielded = true;
        this.#nextQueue = null;
        this.#nextQueueTail = null;
    }

    throw(e) {
        if (!this.#started) {
            this.#start();
            this.#end();
        }
        if (this.#done)
            return doReturn(Promise.reject(e));
    }

    return(v) {
        if (!this.#started) {
            this.#start();
            this.#end();
        }

        let resolveReturn;
        let returnPromise = new Promise(r => {
            resolveReturn = r;
        });

        if (this.#done)
            return doReturn(Promise.resolve(v));

    }
}

const doReturn = (p) => {

};


/**
 * Use it like "`v = nextInput(await _yield(value));`" .
 * @param yieldExpressionResult - The result of a "yield expression".
 * @return - The value of the "yield expression".
 * */
const nextInput = (yieldExpressionResult) => yieldExpressionResult[0].v;


module.exports = {
    AsyncGenerator,
    nextInput,
};
