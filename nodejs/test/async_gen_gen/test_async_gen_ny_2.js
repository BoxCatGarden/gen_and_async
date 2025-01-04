const {
    Awaited,
    Yielded,
    _await,
    _yield,
    __async_star
} = require('../../gen_to_async_gen.js');

const gen = __async_star(function* () {
    var a = _yield(yield Yielded(Promise.reject(55)));
    console.log(a);
    var b = _yield(yield Yielded(Promise.resolve(66)));
    console.log(b);
    return Promise.reject(3);
});

Promise.resolve().then(() => console.log('##################'));
var b = gen();
b.next(1).then(v => console.log('then=', v), e => console.log(`catch=${e}`));

setTimeout(() => {
    console.log('==================');
    b.next(2).then(v => console.log('then=', v), e => console.log(`catch=${e}`));
    b.next(3).then(v => console.log('then=', v), e => console.log(`catch=${e}`));
    b.next(4).then(v => console.log('then=', v), e => console.log(`catch=${e}`));
}, 2000);
