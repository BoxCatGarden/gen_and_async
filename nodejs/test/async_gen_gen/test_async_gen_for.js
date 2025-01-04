const {
    Awaited,
    Yielded,
    _await,
    _yield,
    __async_star
} = require('../../gen_to_async_gen.js');

const gen = __async_star(function* () {
    for (let i = 0; i < 5; ++i)
        _yield(yield Yielded(i));
});

async function a() {
    for await (var b of gen())
        console.log(b);
    return b;
}

a().then(v => console.log('return =', v));
