const {
    Awaited,
    Yielded,
    _await,
    _yield,
    __async_star
} = require('../../gen_to_async_gen.js');

const a = __async_star(function* (n) {
    for (let i = 0; i < n; ++i) {
        let b = _yield(yield Yielded(i));
        console.log(`next input ${i} =`, b);
    }
    return _await(yield Awaited(n));
});

async function b() {
    let r = 10;
    let gen = a(r);
    let q = await gen.next(r);
    while (!q.done) {
        console.log(`value =`, q.value);
        q = await gen.next(q.value);
    }
    console.log(`done value =`, q.value);
}

b();
