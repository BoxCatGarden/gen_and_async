async function* gen() {
    yield 5;
    return 6;
}

let b;

b = gen();
b.next().then().then(v => console.log('next=2'));
b.return(1).then(v => console.log('return=1'));

b = gen();
b.next().then().then(v => console.log('next=2 - 1'));
b.next().then().then(v => console.log('next=2 - 2'));
b.return(1).then(v => console.log('return=1'));

b = gen();
b.return(1).then().then(v => console.log('return=2'));
b.next().then(v => console.log('next=1'));

b = gen();
b.next().then().then(v => console.log('next=2 - 1'));
b.next().then().then(v => console.log('next=2 - 2'));
b.return(1).then().then(v => console.log('return=2'));
b.return(1).then(v => console.log('return=1'));

b = gen();
b.return(1).then().then(v => console.log('return=2'));
b.return(1).then(v => console.log('return=1'));

b = gen();
b.next().then().then(v => console.log('next=2'));
b.throw(1).catch(v => console.log('throw=1'));

b = gen();
b.next().then().then(v => console.log('next=2 - 1'));
b.next().then().then(v => console.log('next=2 - 2'));
b.throw(1).catch(v => console.log('throw=1'));

b = gen();
b.throw(1).then().catch(v => console.log('throw=2'));
b.next().then(v => console.log('next=1'));

b = gen();
b.next().then().then(v => console.log('next=2 - 1'));
b.next().then().then(v => console.log('next=2 - 2'));
b.throw(1).then().catch(v => console.log('throw=2'));
b.throw(1).catch(v => console.log('throw=1'));

b = gen();
b.throw(1).then().catch(v => console.log('throw=2'));
b.throw(1).catch(v => console.log('throw=1'));

b = gen();
b.return(1).then().then(v => console.log('return=2'));
b.throw(1).catch(v => console.log('throw=1'));

b = gen();
b.throw(1).then().catch(v => console.log('throw=2'));
b.return(1).then(v => console.log('return=1'));

b = gen();
b.next().then().then(v => console.log('next=2'));
b.next().then(v => console.log('next=1'));

b = gen();
b.next().then().then(v => console.log('next=2 - 1'));
b.next().then().then(v => console.log('next=2 - 2'));
b.next().then(v => console.log('next=1'));

b = gen();
b.next().then().then(v => console.log('next=2 - 1'));
b.next().then().then(v => console.log('next=2 - 2'));
b.next().then().then(v => console.log('next=2 - 3'));
b.next().then(v => console.log('next=1'));



