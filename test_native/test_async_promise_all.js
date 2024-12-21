function a() {
    var a = Promise.resolve(11);
    var b = Promise.all([a]);
    var d = Promise.any([a]);
    var c = Promise.resolve(a);
    d.then(v => console.log(`d=${v}`));
    b.then(v => console.log(`b=${v}`));
    c.then(v => console.log(`c=${v}`));
    a.then(v => console.log(`a=${v}`));
    Promise.all([Promise.resolve(12), Promise.reject(22)])
        .then(v => console.log('then=', v), e => console.log('catch=', e));
    Promise.any([Promise.resolve(32), Promise.reject(42)])
        .then(v => console.log('then=', v), e => console.log('catch=', e));
}

a();
