const {
    nextInput,
    __star
} = require('../async_to_gen.js');

const a = __star(async function (_yield, n) {
    for (let i = 0; i < n; ++i) {
        let b = nextInput(await _yield(i));
        console.log(`next input ${i} =`, b);
    }
    return await n;
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
