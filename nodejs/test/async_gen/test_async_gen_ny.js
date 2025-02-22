const {
    AsyncGenerator,
    nextInput
} = require('../../async_to_gen.js');

async function genInner(_yield, va) {
    console.log('va=', va);
    try {
        var a = nextInput(await _yield(Promise.reject(55)));
    } catch (e) {
        console.log(`yield error=${e}`);
    }
    console.log(`a=`, a);
    var b = nextInput(await _yield(Promise.resolve(66)));
    console.log(`b=`, b);
    var c = nextInput(await _yield(90));
    console.log(`c=`, c);
    c.catch(() => undefined);
    try {
        /**
         * In async generator function, "`return`" is similar with "`yield`",
         * which is like a variant of "`yield`".
         * Both of them will await their following value.
         * But in async function, all values should be awaited explicitly
         * and "`return`" will not await its following value.
         * */
        return await Promise.reject(3);
    } catch (e) {
        console.log(`return error=${e}`);
        return 7;
    }
}

function gen() {
    return new AsyncGenerator(genInner, this, [25]);
}

Promise.resolve().then(() => console.log('##################'));
var b = gen();
b.next(Promise.resolve(1)).then(v => console.log('then=', v), e => console.log(`catch=${e}`));

setTimeout(() => {
    console.log('==================');
    b.next(Promise.resolve(2)).then(v => console.log('then=', v), e => console.log(`catch=${e}`));
    b.next(Promise.reject(3)).then(v => console.log('then=', v), e => console.log(`catch=${e}`));
    b.next(Promise.resolve(4)).then(v => console.log('then=', v), e => console.log(`catch=${e}`));
}, 2000);
