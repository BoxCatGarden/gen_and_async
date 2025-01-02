async function a(n, v) {
    console.log(`call=${n}`);
    v = await v;
    console.log(`value=${v}`);
    setTimeout(() => {
        console.log(`timeout=${v}`);
    }, 0);
    v = await (v + 1);
    console.log(`value=${v}`);
    return 22;
}

Promise.resolve()
    .then().then()
    .then(v => console.log('then=3'))
    .then(v => console.log('then=4'));
a(1, 1).then(v => console.log('return =', v));
a(2, 3);
console.log('after call');