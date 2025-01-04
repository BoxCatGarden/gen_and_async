const {
    Awaited,
    Yielded,
    _await,
    _yield,
    __async_star
} = require('../../gen_to_async_gen.js');

const genDelay = __async_star(function* () {
    yield new Promise(r => {
        setTimeout(() => {
            r(33);
        }, 2000);
    });
    return 22;
});

b = genDelay();
b.next().then(v => {
    console.log('================');
    console.log(`delayed=${JSON.stringify(v)}`);
});
b.next().then(v => console.log(`next=${JSON.stringify(v)}`));
b.next().then(v => console.log(`next=${JSON.stringify(v)}`));
b.throw(7).catch(v => console.log(`throw=${JSON.stringify(v)}`));

b = genDelay();
b.next().then(v => {
    console.log('================');
    console.log(`delayed=${JSON.stringify(v)}`);
});
b.throw(8).catch(v => console.log(`throw=${JSON.stringify(v)}`));
b.next().then(v => console.log(`next=${JSON.stringify(v)}`));
b.next().then(v => console.log(`next=${JSON.stringify(v)}`));

b = genDelay();
b.throw(9).catch(v => console.log(`throw=${JSON.stringify(v)}`));
b.next().then(v => {
    console.log('================');
    console.log(`delayed=${JSON.stringify(v)}`);
});
b.next().then(v => console.log(`next=${JSON.stringify(v)}`));
b.next().then(v => console.log(`next=${JSON.stringify(v)}`));

