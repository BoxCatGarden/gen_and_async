const {
    __async,
    _await
} = require('../../gen_to_async.js');

const a = __async(function* (n, v) {
    console.log(`call=${n}`);
    v = _await(yield v);
    console.log(`value=${v}`);
    setTimeout(() => {
        console.log(`timeout=${v}`);
    }, 0);
    v = _await(yield(v + 1));
    console.log(`value=${v}`);
    return 22;
});

Promise.resolve()
    .then().then()
    .then(v => console.log('then=3'))
    .then(v => console.log('then=4'));
a(1, 1).then(v => console.log('return =', v));
a(2, 3);
console.log('after call');