async function* gen() {
    yield 5;
    return 6;
}

async function a() {
    let b;
    let q;

    console.log('=================');

    b = gen(); q = [];
    q.push(b.next().then().then(v => console.log('next=2')));
    q.push(b.return(1).then(v => console.log('return=1')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.next().then().then(v => console.log('next=2 - 1')));
    q.push(b.next().then().then(v => console.log('next=2 - 2')));
    q.push(b.return(1).then(v => console.log('return=1')));
    
    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.return(1).then().then(v => console.log('return=2')));
    q.push(b.next().then(v => console.log('next=1')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.return(1).then(v => console.log('return=1 - 1')));
    q.push(b.next().then(v => console.log('next=1 - 2')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.next().then().then(v => console.log('next=2')));
    q.push(b.return(1).then().then(v => console.log('return=2')));
    q.push(b.next().then(v => console.log('next=1')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.next().then().then(v => console.log('next=2')));
    q.push(b.return(1).then(v => console.log('return=1 - 1')));
    q.push(b.next().then(v => console.log('next=1 - 2')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.next().then().then(v => console.log('next=2 - 1')));
    q.push(b.next().then().then(v => console.log('next=2 - 2')));
    q.push(b.return(1).then().then(v => console.log('return=2')));
    q.push(b.return(1).then(v => console.log('return=1')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.return(1).then().then(v => console.log('return=2')));
    q.push(b.return(1).then(v => console.log('return=1')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.next().then().then(v => console.log('next=2')));
    q.push(b.throw(1).catch(v => console.log('throw=1')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.next().then().then(v => console.log('next=2 - 1')));
    q.push(b.next().then().then(v => console.log('next=2 - 2')));
    q.push(b.throw(1).catch(v => console.log('throw=1')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.throw(1).then().catch(v => console.log('throw=2')));
    q.push(b.next().then(v => console.log('next=1')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.next().then().then(v => console.log('next=2 - 1')));
    q.push(b.next().then().then(v => console.log('next=2 - 2')));
    q.push(b.throw(1).then().catch(v => console.log('throw=2')));
    q.push(b.throw(1).catch(v => console.log('throw=1')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.throw(1).then().catch(v => console.log('throw=2')));
    q.push(b.throw(1).catch(v => console.log('throw=1')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.return(1).then().then(v => console.log('return=2')));
    q.push(b.throw(1).catch(v => console.log('throw=1')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.throw(1).then().catch(v => console.log('throw=2')));
    q.push(b.return(1).then(v => console.log('return=1')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.next().then().then(v => console.log('next=2')));
    q.push(b.next().then(v => console.log('next=1')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.next().then().then(v => console.log('next=2 - 1')));
    q.push(b.next().then().then(v => console.log('next=2 - 2')));
    q.push(b.next().then(v => console.log('next=1')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.next().then().then(v => console.log('next=2 - 1')));
    q.push(b.next().then().then(v => console.log('next=2 - 2')));
    q.push(b.next().then().then(v => console.log('next=2 - 3')));
    q.push(b.next().then(v => console.log('next=1')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(b.next().then().then(v => console.log('next=2')));
    q.push(Promise.resolve().then(v => console.log('then=1')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(Promise.resolve().then().then(v => console.log('then=2')));
    q.push(b.next().then(v => console.log('next=1')));

    await Promise.all(q);
    console.log('=================');

    b = gen(); q = [];
    q.push(Promise.resolve().then().then().then(v => console.log('then=3')));
    q.push(b.next().then(v => console.log('next=1')));
}

a();


