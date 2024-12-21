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
    #setYieldedFalse = null;
    #onResolveValueYielded = null;
    #nextQueue = null;
    #nextQueueTail = null;
    #resolveNext = null;
    #lastReturn = null;
    #lastYield = null;

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
                'Yielded without "await". Try "await _yield(<value>)".');
        this.#yielded = true;

        let valuePromise = Promise.resolve(value);

        valuePromise.then(this.#onResolveValueYielded, emptyArrow);

        let nNext = this.#nextQueue.next.next;
        let nextPromise;

        if (nNext) {
            if (nNext.rejectYield) {
                nextPromise = Promise.resolve(nNext.v);
                nextPromise.then(this.#setYieldedFalse);
            } else {
                nextPromise = new Promise(() => {
                });
                valuePromise.then(() => {
                    this.#clearQueue();
                }, emptyArrow);
            }
        } else
            nextPromise = new Promise(r => {
                this.#resolveNext = r;
            });

        return Promise.all([nextPromise, valuePromise]);
    }

    #nextDone(v) {
        return this.#lastReturn.then(doneArrow, doneArrow);
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
            Promise.resolve().then(this.#setYieldedFalse);
            this.#resolveNext(v);
            this.#resolveNext = null;
        }

        return yieldPromise;
    }

    #nextInit(v) {
        this.#nextInner = this.#nextEnqueue;

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

    next(v) {
        return this.#nextInner(v);
    }

    #nextInner = this.#nextInit;

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
            node.resolveYield();
        else
            this.#lastReturn = Promise.resolve();
    }

    #start() {
        this.#asyncFunc = null;
        this.#args = null;
        this.#nextQueue = new Next(null);
        this.#nextQueueTail = this.#nextQueue;
        this.#setYieldedFalse = () => {
            this.#yielded = false;
        };
        this.#onResolveValueYielded = (v) => {
            let next = this.#nextQueue.next;
            this.#nextQueue = next;
            next.resolveYield({
                value: v,
                done: false
            });
        };
    }

    #startNoQueue() {
        this.#asyncFunc = null;
        this.#args = null;
    }

    #end() {
        this.#nextInner = this.#nextDone;
        this.#done = true;
        this.#resolveNext = null;
        this.#yielded = true;
        this.#setYieldedFalse = null;
        this.#onResolveValueYielded = null;
        this.#nextQueue = null;
        this.#nextQueueTail = null;
    }

    throw(e) {
        let rejectValue;
        let valuePromise = new Promise((r, e) => {
            rejectValue = e;
        });

        this.#doReturn(e, rejectValue, valuePromise);

        return valuePromise.then();
    }

    return(v) {
        let resolveValue;
        let valuePromise = new Promise(r => {
            resolveValue = r;
        });

        this.#doReturn(v, resolveValue, valuePromise);

        return valuePromise.then(value => ({
            value,
            done: true
        }));
    }

    #doReturn(v, resolveValue, valuePromise) {
        let wrappedResolveValue = this.#wrapResolveValueReturned(
            resolveValue, v, valuePromise);

        if (this.#done) {
            this.#lastReturn.then(wrappedResolveValue, wrappedResolveValue);
            this.#lastReturn = valuePromise;
            return;
        }

        this.#lastReturn = valuePromise;

        if (this.#nextQueue) {
            if (this.#resolveNext) {

            }
            return;
        }

        this.#startNoQueue();
        this.#end();
        wrappedResolveValue();
    }

    #wrapResolveValueReturned(resolve, value, promise) {
        return () => {
            // Dereference the object referenced in Promise `promise`.
            if (this.#lastReturn === promise)
                this.#lastReturn = Promise.resolve();
            resolve(value);
        };
    }
}

const doneArrow = () => ({
    value: undefined,
    done: true
});
const emptyArrow = () => {
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
