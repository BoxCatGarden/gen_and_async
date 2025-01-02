const {
    __star
} = require('../../async_to_gen.js');

const gen = __star(async function (_yield) {
    for (let i = 0; i < 5; ++i)
        await _yield(i);
});

async function a() {
    for await (var b of gen())
        console.log(b);
    return b;
}

a().then(v => console.log('return =', v));
