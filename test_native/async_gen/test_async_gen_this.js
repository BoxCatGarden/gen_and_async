async function* gen() {
    console.log(this.value);
    yield this.value;
    yield this.value;
}

let a = {value: 2, gen};
let b = a.gen();
b.next().then(v => console.log('a.value =', v));
b.next().then(v => console.log('a.value =', v));
b.next().then(v => console.log('a.value =', v));
