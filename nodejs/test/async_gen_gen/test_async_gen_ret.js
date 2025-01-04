const {
    Awaited,
    Yielded,
    _await,
    _yield,
    __async_star
} = require('../../gen_to_async_gen.js');

const gen = __async_star(function* () {

});

var b = gen();
b.return(new Promise(r => {
    setTimeout(() => {
        console.log('delayed return');
        r(1);
    }, 2000);
}))
    .then(v => console.log(`r1=${JSON.stringify(v)}`))
    .then(v => console.log(`r1=${JSON.stringify(v)}`));
b.return(2)
    .then(v => console.log(`r2=${JSON.stringify(v)}`))
    .then(v => console.log(`r2=${JSON.stringify(v)}`));
b.return(3)
    .then(v => console.log(`r3=${JSON.stringify(v)}`))
    .then(v => console.log(`r3=${JSON.stringify(v)}`));

/**
 * r1" -> f.r1, f.r2"
 * f.r1 -> r1=
 * f.r2" -> f.r2, f.r3"
 * r1= -> r1=
 * f.r2 -> r2=
 * f.r3" -> f.r3
 * r1=
 * r2= -> r2=
 * f.r3 -> r3=
 * r2=
 * r3= -> r3=
 * r3=
 * */

b = gen();
var c = b.return(Promise.reject(5)).finally(() => {
    console.log('unhandled');
    return 7;
}).then(
    v => (console.log(`finally=${JSON.stringify(v)}`), 8),
    e => (console.log(`error after finally=${e}`), 9)
).then(v => console.log(`finally.then=${JSON.stringify(v)}`));
b.return(6).then(v => console.log(v));
c.catch(e => console.log(`return rejected=${e}`));