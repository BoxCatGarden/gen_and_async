const {
    __star,
    nextInput
} = require('../../async_to_gen.js');

const gen = __star(async function (_yield, n) {
    while (n) {
        let v = nextInput(await _yield(n));
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
