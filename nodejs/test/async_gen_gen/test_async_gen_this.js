const {
    Awaited,
    Yielded,
    _await,
    _yield,
    __async_star
} = require('../../gen_to_async_gen.js');

const gen = __async_star(function* () {
    console.log(this.value);
    _yield(yield Yielded(this.value));
    _yield(yield Yielded(this.value));
});

let a = {value: 2, gen};
let b = a.gen();
b.next().then(v => console.log('a.value =', v));
b.next().then(v => console.log('a.value =', v));
b.next().then(v => console.log('a.value =', v));
