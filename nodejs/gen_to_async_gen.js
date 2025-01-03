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

    constructor(genFunc, args) {
        this.#generator = genFunc(...args);
    }

    #resolveYield(v) {
        let next = this.#nextQueue.next;
        this.#nextQueue = next;
        next.resolveYield(v);
    }

    #rejectYield(v) {
        let next = this.#nextQueue.next;
        this.#nextQueue = next;
        next.rejectYield(v);
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
            if (nextValue.then instanceof Function) {
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

    }

    [Symbol.asyncIterator]() {
        return this;
    }
}

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
    return (...args) => new AsyncGenerator(genFunc, args);
};


module.exports = {
    Yielded,
    Awaited,
    _yield,
    _await,
    __async_star,
};
