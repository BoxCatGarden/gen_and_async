const {
    __star
} = require('../../async_to_gen.js');

const gen = __star(async function (_yield) {
    console.log(this.value);
    await _yield(this.value);
    await _yield(this.value);
});

let a = {value: 2, gen};
let b = a.gen();
b.next().then(v => console.log('a.value =', v));
b.next().then(v => console.log('a.value =', v));
b.next().then(v => console.log('a.value =', v));
