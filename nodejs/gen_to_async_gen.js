/**
 * Wrap `@value` as a yielded value.
 * @param value - The value to be wrapped.
 * @return - Wrapped value.
 * @see _yield
 * */
const Yielded = (value) => ({
    awaited: false,
    value
});

/**
 * Wrap `@value` as an awaited value.
 * @param value - The value to be wrapped.
 * @return - Wrapped value.
 * @see _await
 * */
const Awaited = (value) => ({
    awaited: true,
    value
});

/**
 * To await a value, use it like the following:
 * ```
 * let val = _await(yield Awaited(value));
 * ```
 * @see Awaited
 * */
const _await = (expResult) => {
    if (expResult.ok)
        return expResult.value;
    else
        throw expResult.value;
};

/**
 * To yield a value, use it like the following:
 * ```
 * let nextInput = _yield(yield Yielded(value));
 * ```
 * @see Yielded
 * */
const _yield = _await;

const Next = (next, v, resolveYield, rejectYield) =>
    ({next, v, resolveYield, rejectYield});

class AsyncGenerator {
    #generator;
    #nextQueue = null;
    #nextQueueTail = null;
    #onResolveValueYielded = null;
    #onResolveValueYieldedDone = null;
    #onRejectValueYielded = null;
    #onStepOk = null;
    #onStepFail = null;
    #lastReturn = null;

    constructor(genFunc, thisObj, args) {
        this.#generator = genFunc.apply(thisObj, args);
    }

    #step(v) {
        let nextResult;
        try {
            nextResult = this.#generator.next(v);
        } catch (e) {
            Promise.reject(e).catch(this.#onRejectValueYielded);
            return;
        }
        let nextValue = nextResult.value;
        if (!nextResult.done) {
            if (nextValue.awaited) {
                Promise.resolve(nextValue.value)
                    .then(this.#onStepOk, this.#onStepFail);
            } else {
                Promise.resolve(nextValue.value)
                    .then(this.#onResolveValueYielded,
                        this.#onStepFail);
            }
        } else {
            if (nextValue && (nextValue.then instanceof Function)) {
                nextValue.then(
                    this.#onResolveValueYieldedDone,
                    this.#onRejectValueYielded);
            } else
                this.#onResolveValueYieldedDone(nextValue);
        }
    }

    #start() {
        this.#onResolveValueYielded = (value) => {
            let next = this.#nextQueue.next;
            next.resolveYield({
                value,
                done: false
            });
            if (next.next) {
                if (next.next.rejectYield) {
                    this.#nextQueue = next;
                    this.#step({value: next.next.v, ok: true});
                } else
                    this.#clearQueue();
            } else
                this.#nextQueue = next;
        };
        this.#onResolveValueYieldedDone = (value) => {
            this.#nextQueue.next.resolveYield({
                value,
                done: true
            });
            this.#clearQueue();
        };
        this.#onRejectValueYielded = (error) => {
            this.#nextQueue.next.rejectYield(error);
            this.#clearQueue();
        };
        this.#onStepOk = (value) => {
            this.#step({value, ok: true});
        };
        this.#onStepFail = (value) => {
            this.#step({value, ok: false});
        };
        this.#nextQueue = Next(null);
        this.#nextQueueTail = this.#nextQueue;
    }

    #end() {
        this.#generator = null;
        this.#onResolveValueYielded = null;
        this.#onResolveValueYieldedDone = null;
        this.#onRejectValueYielded = null;
        this.#onStepOk = null;
        this.#onStepFail = null;
        this.#nextQueue = null;
        this.#nextQueueTail = null;
    }

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

    #nextDone(v) {
        return this.#lastReturn.then(doneArrow, doneArrow);
    }

    #nextEnqueue(v) {
        let next;
        let yieldPromise = new Promise((r, h) => {
            next = Next(null, v, r, h);
        });
        this.#nextQueueTail.next = next;
        this.#nextQueueTail = next;

        if (this.#nextQueue.next === this.#nextQueueTail)
            this.#step({value: v, ok: true});

        return yieldPromise;
    }

    #nextInit(v) {
        this.#nextInner = this.#nextEnqueue;
        this.#start();
        return this.#nextEnqueue(v);
    }

    #nextInner = this.#nextInit;

    next(v) {
        return this.#nextInner(v);
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
        this.#lastReturn = Promise.resolve();
        this.#nextInner = this.#nextDone;
        this.#end();
        this.#lastReturn.then(wrappedResolveValue);
    }

    #returnNext(wrappedResolveValue) {
        let next = Next(
            null,
            null,
            wrappedResolveValue,
            null);
        this.#nextQueueTail.next = next;
        this.#nextQueueTail = next;
    }

    [Symbol.asyncIterator]() {
        return this;
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

/**
 * Wrap a generator function as an async generator function.<br/>
 * <b>-----Recommended-----</b><br/>
 * To get a similar behave as the original async generator function,
 * await the value before return it:
 * ```
 * return _await(yield Awaited(value));
 * ```
 * @param genFunc - The generator function.
 * @return - The async generator function.
 * @see _await
 * @see _yield
 * @see Awaited
 * @see Yielded
 * */
const __async_star = (genFunc) => {
    return (function (...args) {
        return new AsyncGenerator(genFunc, this, args);
    });
};


module.exports = {
    Yielded,
    Awaited,
    _yield,
    _await,
    __async_star,
};
