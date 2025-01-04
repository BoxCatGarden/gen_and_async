async function* gen(n) {
    while (n) {
        let v = yield await n;
        console.log('next =', v);
        --n;
    }
}

async function test() {
    let n = 5;
    let b = gen(n);
    do {
        let v = await b.next(n);
        if (v.done)
            break;
        console.log('yield =', v.value);
        n = v.value;
    } while (true);
}

test();
