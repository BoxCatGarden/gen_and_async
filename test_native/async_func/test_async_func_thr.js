const {showLevel} = require('../../util/lv_count.js');

async function a(id, throwError) {
    console.log(id, 'start');
    try {
        await Promise.reject(2);
    } catch (e) {
        console.log(id, 'catch =', e);
    }
    if (throwError)
        throw 5;
    else
        return Promise.reject(7);
}

showLevel(6);
a(1, false).catch(e => console.log('1 return =', e));
a(2, true).catch(e => console.log('2 throw =', e));

