const {
    Awaited,
    Yielded,
    _await,
    _yield,
    __async_star
} = require('../../gen_to_async_gen.js');

const gen = __async_star(function* (n) {
    while (n) {
        let v = yield await n;
        console.log('next =', v);
        --n;
    }
});

async function test() {
    let n = 5;
    let b = gen(n);
    do {
        let v = await b.next(n);
        if (v.done)
            break;
        console.log('yield =', v.value);
        n = v.value;
    } while (true);
}

test();
