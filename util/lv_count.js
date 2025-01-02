const showLevel = (maxLevel, tag = 'Then') => {
    let p = Promise.resolve(1);
    const printLevel = (lv) => {
        if (lv <= maxLevel) {
            console.log(`${tag}=${lv}`);
            p = p.then(printLevel);
        }
        return lv + 1;
    };
    p = p.then(printLevel);
};

module.exports = {
    showLevel
};

/*
Promise.resolve()
    .then(v => console.log('..then=1'))
    .then(v => console.log('..then=2'))
    .then(v => console.log('..then=3'))
    .then(v => console.log('..then=4'))
    .then(v => console.log('..then=5'))
    .then(v => console.log('..then=6'))
    .then(v => console.log('..then=7'));
showLevel(6);
Promise.resolve()
    .then(v => console.log('.then=1'))
    .then(v => console.log('.then=2'))
    .then(v => console.log('.then=3'))
    .then(v => console.log('.then=4'))
    .then(v => console.log('.then=5'))
    .then(v => console.log('.then=6'))
    .then(v => console.log('.then=7'));
*/
