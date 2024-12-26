async function* gen() {
    for (let i = 0; i < 5; ++i)
        yield i;
}

async function a() {
    for await (var b of gen())
        console.log(b);
    return b;
}

a().then(v => console.log('return =', v));
