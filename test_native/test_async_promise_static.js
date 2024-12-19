var b = Promise.resolve(Promise.resolve(2)).then(v => console.log(v));
var a = Promise.resolve(1).then(v => console.log(v));