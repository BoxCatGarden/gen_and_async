async function* gen() {
    return 11;
}

var b = gen();
b.next().then(v => console.log(JSON.stringify(v)));
b.next().then(v => console.log(JSON.stringify(v)));
b.return(55).then(v => console.log(JSON.stringify(v)));
b.throw(3).then(v => console.log(v)).catch(e => console.log(e));
b.throw(2).catch(e => console.log(e));

