/**
 * Wrap `@value` as a yielded value.
 * @see _yield
 * */
const Yielded = (value) => ({
    awaited: false,
    value
});

/**
 * Wrap `@value` as an awaited value.
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
 * let val = _yield(yield Yielded(value));
 * ```
 * @see Yielded
 * */
const _yield = _await;


class AsyncGenerator {

}
