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

    constructor(asyncFunc, args) {
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

    next(v) {
        if (this.#done)
            return this.#returnValue.then(() => ({
                value: undefined,
                done: true
            }));

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

        if (!this.#returnValue) {
            this.#yielded = false;
            let returnValue = this.#asyncFunc((value) => {
                return this.#YIELD(value);
            }, ...this.#args);
            this.#asyncFunc = null;
            this.#args = null;
            this.#returnValue = returnValue;
            returnValue.then(
                v => {
                    this.#nextQueue.next.resolveYield({
                        value: v,
                        done: true
                    });
                    this.#clearQueue();
                },
                e => {
                    this.#nextQueue.next.rejectYield(e);
                    this.#clearQueue();
                }
            );
        }

        return yieldPromise;
    }

    #clearQueue() {
        this.#done = true;
        let node = this.#nextQueue.next.next;
        while (node) {
            node.resolveYield({
                value: undefined,
                done: true
            });
            node = node.next;
        }
        this.#nextQueue = null;
        this.#nextQueueTail = null;
        this.#returnValue = Promise.resolve();
        this.#resolveNext = null;
    }

    throw(e) {
        if (this.#done)
            return this.#lastYield;
    }

    return(v) {
        if (this.#done)
            return this.#lastYield;
    }
}

function createAsyncGenerator(asyncFunc, ...args) {
    return new AsyncGenerator(asyncFunc, args);
}

module.exports = {
    createAsyncGenerator
};
