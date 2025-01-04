const {
    Awaited,
    Yielded,
    _await,
    _yield,
    __async_star
} = require('../../gen_to_async_gen.js');

const a = __async_star(function* () {
    console.log('run 1st .next()');
    _yield(yield Yielded(505));
    console.log('run 2nd .next()');
    console.log('after 1st yield');
    var p = Promise.resolve(77);
    p.then((v) => {console.log(`p=${v}`)})
        .then(() => {console.log('after p')})
        .then(() => {console.log('after after p')});
    /** Equivalence:
     * The action queue since `p` is [
     *      2nd next: p=... >>>> @ after p,
     *      2nd yield: fulfill output Promise >>>> @ 2nd=...,
     *      2nd yield: 3rd next: run 3rd... after 2nd...,
     *      after p >>>> @ after after p,
     *      2nd=...,
     *      after after p
     * ]. */
    _yield(yield Yielded(p));
    console.log('run 3rd .next()');
    console.log('after 2nd yield');
    _yield(yield Yielded(new Promise(r => {
        setTimeout(()=>{r(33)}, 2000);
    })));
    console.log('run 4th .next()');
    console.log('after 3rd yield');
    _yield(yield Yielded(11));
    console.log('@@@@ fin');
});

Promise.resolve().then(() => {
    console.log('##################');
});
var b = a();
console.log('after construct');
b.next().then((v) => {console.log(`1st=${JSON.stringify(v)}`)});
console.log('after 1st next');
b.next().then((v) => {console.log(`2nd=${JSON.stringify(v)}`)});
console.log('after 2nd next');
var c = b.next();
console.log('after 3rd next');
var d = b.return(new Promise(r => {setTimeout(() => {
    console.log(`delayed return`);
    r(55);
}, 4000)}));


/** Equivalence:
 * `e` and `e2` are both linked to `"d`, a Promise to which `d` links.
 * `e2` is not linked to `"e` because otherwise the output
 * should be "e=... e e2=... e2". */
var e = b.next();
e.then((v) => {console.log(`e=${JSON.stringify(v)}`)})
    .then(() => {console.log('e')});
var e2 = b.next();
e2.then((v) => {console.log(`e2=${JSON.stringify(v)}`)})
    .then(() => {console.log('e2')});

d.then((v) => {console.log(`d=${JSON.stringify(v)}`)});
d.then((v) => new Promise(r => {setTimeout(() => {
    console.log(`delayed d=${JSON.stringify(v)}`);
    r(66);
}, 2000)}))
    .then((v) => {console.log(`delayed d.then=${v}`)});
c.then((v) => {console.log(`c=${JSON.stringify(v)}`)});

console.log('setup done');
setTimeout(() => {
    console.log('==================');
}, 0);
