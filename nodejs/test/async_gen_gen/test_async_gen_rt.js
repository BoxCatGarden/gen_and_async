const {__star} = require("../../async_to_gen.js");

const gen = __star(async function (_yield) {
    await _yield(11);
    return 22;
});

async function a(ret) {
    const _return = ret ? 'return' : 'throw';
    const _then = ret ? 'then' : 'catch';
    let b;
    let idx = 0;

    console.log(`$${++idx}: ==============`);
    b = gen();
    b.next().then(v => console.log('value =', v));
    b.next().then(v => console.log('value =', v));
    b.next().then(v => console.log('value =', v));
    await b[_return](idx)[_then](v => console.log(`${_return} =`, v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    b.next().then(v => console.log('value =', v));
    b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));
    await b[_return](idx)[_then](v => console.log(`${_return} =`, v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));
    b.next().then(v => console.log('value =', v));
    await b[_return](idx)[_then](v => console.log(`${_return} =`, v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    await b.next().then(v => console.log('value =', v));
    b.next().then(v => console.log('value =', v));
    b.next().then(v => console.log('value =', v));
    await b[_return](idx)[_then](v => console.log(`${_return} =`, v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    b.next().then(v => console.log('value =', v));
    b.next().then(v => console.log('value =', v));
    b[_return](idx)[_then](v => console.log(`${_return} =`, v));
    await b.next().then(v => console.log('value =', v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    b.next().then(v => console.log('value =', v));
    b.next().then(v => console.log('value =', v));
    await b[_return](idx)[_then](v => console.log(`${_return} =`, v));
    await b.next().then(v => console.log('value =', v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));
    b[_return](idx)[_then](v => console.log(`${_return} =`, v));
    await b.next().then(v => console.log('value =', v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    await b.next().then(v => console.log('value =', v));
    b.next().then(v => console.log('value =', v));
    b[_return](idx)[_then](v => console.log(`${_return} =`, v));
    await b.next().then(v => console.log('value =', v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    b.next().then(v => console.log('value =', v));
    b[_return](idx)[_then](v => console.log(`${_return} =`, v));
    b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    b.next().then(v => console.log('value =', v));
    b[_return](idx)[_then](v => console.log(`${_return} =`, v));
    await b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    b.next().then(v => console.log('value =', v));
    await b[_return](idx)[_then](v => console.log(`${_return} =`, v));
    b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    await b.next().then(v => console.log('value =', v));
    b[_return](idx)[_then](v => console.log(`${_return} =`, v));
    b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    b[_return](idx)[_then](v => console.log(`${_return} =`, v));
    b.next().then(v => console.log('value =', v));
    b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    b[_return](idx)[_then](v => console.log(`${_return} =`, v));
    b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    b[_return](idx)[_then](v => console.log(`${_return} =`, v));
    await b.next().then(v => console.log('value =', v));
    b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    await b[_return](idx)[_then](v => console.log(`${_return} =`, v));
    b.next().then(v => console.log('value =', v));
    b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    await b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));
    await b[_return](idx)[_then](v => console.log(`${_return} =`, v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    await b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));
    await b[_return](idx)[_then](v => console.log(`${_return} =`, v));
    await b.next().then(v => console.log('value =', v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    await b.next().then(v => console.log('value =', v));
    await b[_return](idx)[_then](v => console.log(`${_return} =`, v));
    await b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));

    console.log(`$${++idx}: ==============`);
    b = gen();
    await b[_return](idx)[_then](v => console.log(`${_return} =`, v));
    await b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));
    await b.next().then(v => console.log('value =', v));
}

async function run() {
    console.log('return: =======================');
    await a(true);
    console.log('throw: ========================');
    await a(false);
}

run();
