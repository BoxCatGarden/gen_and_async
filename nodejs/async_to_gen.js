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
    #onResolveValueYielded = null;
    #setResolveNext = null;
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
                'Yielded without "await". Try "await _yield(<value>)".');
        this.#yielded = true;

        let valuePromise = Promise.resolve(value);

        valuePromise.then(
            this.#onResolveValueYielded,
            this.#setYieldedFalse);

        let nNext = this.#nextQueue.next.next;
        let nextPromise;

        if (nNext) {
            nextPromise = Promise.resolve(nNext.v);
            nextPromise.then(this.#setYieldedFalse);
        } else
            nextPromise = new Promise(this.#setResolveNext);

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
        }).then();

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
            if (this.#nextQueue)
                this.#clearQueue();
        }, error => {
            this.#nextQueue.next.rejectYield(error);
            if (this.#nextQueue)
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
        this.#onResolveValueYielded = (v) => {
            let next = this.#nextQueue.next;
            this.#nextQueue = next;
            next.resolveYield({
                value: v,
                done: false
            });
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
        this.#onResolveValueYielded = null;
        this.#setResolveNext = null;
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

        return valuePromise.then(doneValueArrow);
    }

    #doReturn(v, resolveValue, valuePromise) {
        let wrappedResolveValue = this.#wrapResolveValueReturned(
            resolveValue, v, valuePromise);

        if (this.#lastReturn) {
            this.#lastReturn.then(wrappedResolveValue, wrappedResolveValue);
            this.#lastReturn = valuePromise;
            return;
        }

        this.#lastReturn = valuePromise;
        this.#nextInner = this.#nextDone;

        if (this.#nextQueue === this.#nextQueueTail) {
            if (!this.#nextQueue)
                this.#startNoQueue();
            this.#end();
            wrappedResolveValue();
            return;
        }

        this.#wrapLastResolveYield(wrappedResolveValue);
    }

    #wrapResolveValueReturned(resolve, value, promise) {
        return () => {
            // Dereference the object referenced in Promise `promise`.
            if (this.#lastReturn === promise)
                this.#lastReturn = Promise.resolve();
            resolve(value);
        };
    }

    #wrapLastResolveYield(resolveValue) {
        let next = this.#nextQueueTail;
        let resolveYield = next.resolveYield;
        let rejectYield = next.rejectYield;
        next.resolveYield = (v) => {
            resolveYield(v);
            if (this.#nextQueue)
                this.#end();
            resolveValue();
        };
        next.rejectYield = (e) => {
            rejectYield(e);
            if (this.#nextQueue)
                this.#end();
            resolveValue();
        };
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
