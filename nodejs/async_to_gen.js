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
    #yielded = true;
    #setYieldedFalse = null;
    #setResolveNext = null;
    #nextQueue = null;
    #nextQueueTail = null;
    #resolveNext = null;
    #lastReturn = null;

    /**
     * @param asyncFunc - The async function (including async arrow function) on which this generator is based.
     * @param args - An Array containing the arguments without `@_yield` for calling `@asyncFunc`.
     * @description -
     * The signature of `@asyncFunc` should be in the format like the following.
     * ```
     * asyncFunc(_yield[, para1[, para2[, ...[, paraN]]]])
     * ```
     * For example, "`baseFunc(_yield, a, b, c)`".
     * The first parameter `@_yield` is required, but the name of it
     * can be customized (e.g., "`abc`"). The `@_yield` argument will
     * be constructed and passed to `@asyncFunc` by
     * this generator automatically. <br/>
     * `@_yield` is a function with one parameter:
     * ```
     * function _yield(value) {...}
     * ```
     * Use it to yield `@value` through "`await`":
     * ```
     * await _yield(value)
     * ```
     * To get the value of the "yield expression", use "`nextInput()`":
     * ```
     * nextInput(await _yield(value))
     * ```
     * <b>----- Be Careful -----</b><br/>
     * In async generator function, "`return`" and "`yield`" are very similar
     * and can be thought as a variant of each other. "`return`" and "`yield`"
     * both will await their following value if the value is a Promise, and
     * will throw an error inside the function body if the Promise is rejected.<br/>
     * However, in async function, all values should be awaited explicitly.
     * If the awaited value is a rejected Promise, it will throw an error
     * inside the function body. So, when "`return`"ing a value, if it is
     * expected to perform like that in an async generator function,
     * "`await`" the value manually.
     * ```
     * async function foo() {
     *     let a = Promise.reject();
     *     try {
     *         return await a;
     *     } catch (e) {
     *         console.log('Caught the rejection reason.');
     *     }
     * }
     * ```
     * If the rejected Promise is not awaited, the value will be
     * returned without throwing an error, and the Promise of
     * the async function call will be rejected by it. Then,
     * the Promise returned by the corresponding "`next()`"
     * will be rejected with the same rejection reason as that
     * of the Promise returned inside the function body.<br/>
     * However, from the above, if it is not expected to catch the rejection reason
     * inside the function body, returning the Promise without an "`await`"
     * can also get the same "`next()`" result as that of async generator
     * function, but the "`await`" behaviour may have some differences
     * (i.e., losing a level of "`then()`").
     * @see nextInput
     * */
    constructor(asyncFunc, args) {
        this.#asyncFunc = asyncFunc;
        this.#args = args;
    }

    async #YIELD(value) {
        if (this.#yielded)
            throw new SyntaxError(
                'Yielded without "await". Try "await _yield(<value>)".');
        this.#yielded = true;

        let valueReal;
        try {
            valueReal = await value;
        } catch (e) {
            this.#yielded = false;
            throw e;
        }

        let next = this.#nextQueue.next;
        next.resolveYield({
            value: valueReal,
            done: false
        });

        let nNext = next.next;
        let nextPromise;

        if (nNext) {
            if (nNext.rejectYield) {
                nextPromise = Promise.resolve(nNext.v);
                nextPromise.then(this.#setYieldedFalse);
            } else {
                this.#clearQueue();
                return new Promise(emptyResolver);
            }
        } else
            nextPromise = new Promise(this.#setResolveNext);

        this.#nextQueue = next;

        /**
         * A problem is that the inner async function is not
         * awaiting `@valuePromise` but awaiting the wrapper
         * "`Promise.all()`". There is a level of "`then()`"
         * between `@valuePromise` and the wrapper. So, if there
         * are some chains of "`then()`"s of `@value` inside the
         * function body before this "`yield`", they will have
         * one level of "`then()`" less than the function execution
         * after this "`yield`". It is different from the original
         * async generator function, where the function is awaiting
         * on the "`@valuePromise`" level and does not have that
         * one more level.
         * */
        return nextPromise;
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

        returnValue.then(value => {
            this.#nextQueue.next.resolveYield({
                value: value,
                done: true
            });
            this.#clearQueue();
        }, error => {
            this.#nextQueue.next.rejectYield(error);
            this.#clearQueue();
        });

        return yieldPromise;
    }

    next(v) {
        return this.#nextInner(v);
    }

    #nextInner = this.#nextInit;

    #clearQueue() {
        if (!this.#lastReturn) {
            this.#lastReturn = Promise.resolve();
            this.#nextInner = this.#nextDone;
        }
        let node = this.#nextQueue.next.next;
        this.#end();
        while (node) {
            node.resolveYield({
                value: undefined,
                done: true
            });
            node = node.next;
        }
    }

    #start() {
        this.#asyncFunc = null;
        this.#args = null;
        this.#nextQueue = new Next(null);
        this.#nextQueueTail = this.#nextQueue;
        this.#setYieldedFalse = () => {
            this.#yielded = false;
        };
        this.#setResolveNext = (r, e) => {
            this.#resolveNext = r;
        };
    }

    #startNoQueue() {
        this.#asyncFunc = null;
        this.#args = null;
    }

    #end() {
        this.#resolveNext = null;
        this.#yielded = true;
        this.#setYieldedFalse = null;
        this.#setResolveNext = null;
        this.#nextQueue = null;
        this.#nextQueueTail = null;
    }

    throw(e) {
        let rejectValue;
        let valuePromise = new Promise((r, h) => {
            rejectValue = h;
        });

        this.#doReturn(e, rejectValue);

        return valuePromise;
    }

    return(v) {
        let resolveValue;
        let valuePromise = new Promise(r => {
            resolveValue = r;
        });

        this.#bindDeref(valuePromise);
        this.#doReturn(v, resolveValue);
        this.#lastReturn = valuePromise;
        this.#nextInner = this.#nextDone;

        return valuePromise.then(doneValueArrow);
    }

    #doReturn(v, resolveValue) {
        let wrappedResolveValue = () => {
            resolveValue(v);
        };

        if (this.#lastReturn) {
            this.#lastReturn.then(wrappedResolveValue, wrappedResolveValue);
            return;
        }

        if (this.#nextQueue === this.#nextQueueTail) {
            this.#returnNoWait(wrappedResolveValue);
            return;
        }

        this.#returnNext(wrappedResolveValue);
    }

    #bindDeref(promise) {
        let deref = () => {
            // Dereference the object referenced in Promise `promise`.
            if (this.#lastReturn === promise)
                this.#lastReturn = Promise.resolve();
        };
        promise.then(deref, deref);
    }

    #returnNoWait(wrappedResolveValue) {
        if (!this.#nextQueue)
            this.#startNoQueue();
        this.#lastReturn = Promise.resolve();
        this.#nextInner = this.#nextDone;
        this.#end();
        this.#lastReturn.then(wrappedResolveValue);
    }

    #returnNext(wrappedResolveValue) {
        this.#resolveNext = null;
        let next = new Next(
            null,
            null,
            wrappedResolveValue,
            null);
        this.#nextQueueTail.next = next;
        this.#nextQueueTail = next;
    }
}

const doneArrow = () => ({
    value: undefined,
    done: true
});
const doneValueArrow = (value) => ({
    value,
    done: true
});
const undoneValueArrow = (value) => ({
    value,
    done: false
});
const emptyArrow = () => {
};
const emptyResolver = () => {
};

/**
 * Use it like "`v = nextInput(await _yield(value));`" .
 * @param yieldExpressionResult - The result of a "yield expression".
 * @return - The value of the "yield expression".
 * */
const nextInput = (yieldExpressionResult) => yieldExpressionResult.v;

/**
 * Wrap the `@asyncFunc` as an async generator function.
 * @param asyncFunc - The async function required by AsyncGenerator.
 * @return - The async generator function.
 * @see AsyncGenerator
 * */
const __star = (asyncFunc) => {
    return (...args) => new AsyncGenerator(asyncFunc, args);
};


module.exports = {
    AsyncGenerator,
    nextInput,
    __star,
};
