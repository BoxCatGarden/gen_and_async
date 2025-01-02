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

class AsyncGenerator {
    constructor(genFunc, args) {
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
