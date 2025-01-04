async function f(c) {
    console.log('arg =', c);
    console.log('value =', this.value);
    let v = await this.value;
    console.log('await value =', v);
    v = await this.value;
    console.log('await value =', v);
    return this.value;
}

let a = {value: 2, f};
a.f(6).then(v => console.log('return =', v));
a = null;
