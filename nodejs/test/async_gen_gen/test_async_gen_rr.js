const {
    Awaited,
    Yielded,
    _await,
    _yield,
    __async_star
} = require('../../gen_to_async_gen.js');

const gen = __async_star(function* () {
    return 11;
});

var b = gen();
b.next().then(v => console.log(JSON.stringify(v)));
b.next().then(v => console.log(JSON.stringify(v)));
b.return(55).then(v => console.log(JSON.stringify(v)));
b.throw(3).then(v => console.log(v)).catch(e => console.log(e));
b.throw(2).catch(e => console.log(e));

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
b.return(6).then(v => console.log(`return=${JSON.stringify(v)}`));

b = genDelay();
b.next().then(v => {
    console.log('================');
    console.log(`delayed=${JSON.stringify(v)}`);
});
b.return(6).then(v => console.log(`return=${JSON.stringify(v)}`));
b.next().then(v => console.log(`next=${JSON.stringify(v)}`));
b.next().then(v => console.log(`next=${JSON.stringify(v)}`));

b = genDelay();
b.next().then(v => {
    console.log('================');
    console.log(`delayed=${JSON.stringify(v)}`);
});
b.next().then(v => console.log(`next=${JSON.stringify(v)}`));
b.next().then(v => console.log(`next=${JSON.stringify(v)}`));
b.return(7).then(v => console.log(`return=${JSON.stringify(v)}`));
b.return(new Promise((r, e) => {
    setTimeout(() => {
        r(8);
    }, 4000);
})).then(v => console.log(`return=${JSON.stringify(v)}`));
b.return(9).then(v => console.log(`return=${JSON.stringify(v)}`));

b = genDelay();
b.next().then(v => {
    console.log('================');
    console.log(`delayed=${JSON.stringify(v)}`);
});
b.next().then(v => console.log(`next=${JSON.stringify(v)}`));
b.next().then(v => console.log(`next=${JSON.stringify(v)}`));
b.throw(7).catch(v => console.log(`throw=${JSON.stringify(v)}`));
b.throw(new Promise((r, e) => {
    setTimeout(() => {
        e(8);
    }, 4000);
})).catch(v => console.log(`throw=${JSON.stringify(v)}`));
b.throw(9).catch(v => console.log(`throw=${JSON.stringify(v)}`));
b.throw(Promise.resolve(88)).catch(v => console.log(`throw=${JSON.stringify(v)}`));
