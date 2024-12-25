Promise.resolve()
    .then(v => console.log('then=1'))
    .then(v => console.log('then=2'))
    .then(v => console.log('then=3'))
    .then(v => console.log('then=4'))
    .then(v => console.log('then=5'))
    .then(v => console.log('then=6'));
Promise.resolve()
    .then(v => {
        console.log('return Promise(value)');
        return Promise.resolve(22);
    })
    .then(v => console.log('promised value =', v));
Promise.resolve()
    .then(v => {
        console.log('return value');
        return 11;
    })
    .then(v => console.log('value =', v));
Promise.all([
    Promise.resolve(33),
    Promise.resolve(46),
    Promise.resolve(57)
]).then(v => console.log('all([value]) =', v));
