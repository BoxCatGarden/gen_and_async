async function a(n, v, resolve, awaitRet) {
    console.log(`call=${n}`);
    v = await Promise.resolve(v);
    console.log(`value=${v}`);
    setTimeout(() => {
        console.log(`timeout=${v}`);
    }, 0);
    v = await Promise.resolve(v + 1);
    console.log(`value=${v}`);
    if (awaitRet)
        return await Promise[resolve ? 'resolve' : 'reject'](n + 0.1);
    else
        return Promise[resolve ? 'resolve' : 'reject'](n + 0.2);
}

Promise.resolve()
    .then(v => console.log('then=1'))
    .then(v => console.log('then=2'))
    .then(v => console.log('then=3'))
    .then(v => console.log('then=4'))
    .then(v => console.log('then=5'))
    .then(v => console.log('then=6'));
a(1, 1, true, false).then(v => console.log('return =', v), e => console.log('err catch =', e));
a(1, 1, true, true).then(v => console.log('await return =', v), e => console.log('err catch =', e));
a(2, 3, false, false).then(v => console.log('err return =', v), e => console.log('catch =', e));
a(2, 3, false, true).then(v => console.log('err return =', v), e => console.log('await catch =', e));
console.log('after call');
