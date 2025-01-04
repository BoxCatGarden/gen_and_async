const {
    Awaited,
    Yielded,
    _await,
    _yield,
    __async_star
} = require('../../gen_to_async_gen.js');

const gen = __async_star(function* () {
    try {
        var a = _yield(yield Yielded(Promise.reject(55)));
    } catch (e) {
        console.log(`yield error=${e}`);
    }
    console.log(`a=`, a);
    var b = _yield(yield Yielded(Promise.resolve(66)));
    console.log(`b=`, b);
    var c = _yield(yield Yielded(90));
    console.log(`c=`, c);
    c.catch(() => undefined);
    try {
        return _await(yield Awaited(Promise.reject(3)));
    } catch (e) {
        console.log(`return error=${e}`);
        return _await(yield Awaited(7));
    }
});

Promise.resolve().then(() => console.log('##################'));
var b = gen();
b.next(Promise.resolve(1)).then(v => console.log('then=', v), e => console.log(`catch=${e}`));

setTimeout(() => {
    console.log('==================');
    b.next(Promise.resolve(2)).then(v => console.log('then=', v), e => console.log(`catch=${e}`));
    b.next(Promise.reject(3)).then(v => console.log('then=', v), e => console.log(`catch=${e}`));
    b.next(Promise.resolve(4)).then(v => console.log('then=', v), e => console.log(`catch=${e}`));
}, 2000);
