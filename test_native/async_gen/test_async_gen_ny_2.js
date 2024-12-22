async function* gen() {
    var a = yield Promise.reject(55);
    console.log(a);
    var b = yield Promise.resolve(66);
    console.log(b);
    return Promise.reject(3);
}

Promise.resolve().then(() => console.log('##################'));
var b = gen();
b.next(1).then(v => console.log('then=', v), e => console.log(`catch=${e}`));

setTimeout(() => {
    console.log('==================');
    b.next(2).then(v => console.log('then=', v), e => console.log(`catch=${e}`));
    b.next(3).then(v => console.log('then=', v), e => console.log(`catch=${e}`));
    b.next(4).then(v => console.log('then=', v), e => console.log(`catch=${e}`));
}, 2000);
