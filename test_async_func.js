async function a(n, v) {
    console.log(`call=${n}`);
    v = await Promise.resolve(v);
    console.log(`value=${v}`);
    setTimeout(() => {
        console.log(`timeout=${v}`);
    }, 0);
    v = await Promise.resolve(v + 1);
    console.log(`value=${v}`);
}

a(1, 1);
a(2, 3);
console.log('after call');