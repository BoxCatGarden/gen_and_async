const {showLevel} = require('../../../util/lv_count.js');
const {
    __async,
    _await,
} = require('../../gen_to_async.js');

const a = __async(function* (id, throwError) {
    console.log(id, 'start');
    try {
        _await(yield Promise.reject(2));
    } catch (e) {
        console.log(id, 'catch =', e);
    }
    if (throwError)
        throw 5;
    else
        return Promise.reject(7);
});

showLevel(6);
a(1, false).catch(e => console.log('1 return =', e));
a(2, true).catch(e => console.log('2 throw =', e));

