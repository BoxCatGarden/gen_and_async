async function* a(n) {
    for (let i = 0; i < n; ++i) {
        let b = yield i;
        console.log(`next input ${i} =`, b);
    }
    return n;
}

async function b() {
    let r = 10;
    let gen = a(r);
    let q = await gen.next(r);
    while (!q.done) {
        console.log(`value =`, q.value);
        q = await gen.next(q.value);
    }
    console.log(`done value =`, q.value);
}

b();
