const {
    __async,
    _await
} = require('../../gen_to_async.js');

const f = __async(function* (c) {
    console.log('arg =', c);
    console.log('value =', this.value);
    let v = _await(yield this.value);
    console.log('await value =', v);
    v = _await(yield this.value);
    console.log('await value =', v);
    return this.value;
});

let a = {value: 2, f};
a.f(6).then(v => console.log('return =', v));
a = null;
