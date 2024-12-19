function a() {
    new Promise((r) => {
        console.log(': in promise: 1');
        r(1);
    })
        .then((v) => {
            console.log(`value=${v}`);
            setTimeout(()=>{
                console.log(`timeout=${v}`);
            }, 0);
            return 2;
        })
        .then((v) => {
            console.log(`value=${v}`);
            return 3;
        });
    new Promise((r) => {
        console.log(': in promise: 2');
        r(3);
    })
        .then((v) => {
            console.log(`value=${v}`);
            setTimeout(()=>{
                console.log(`timeout=${v}`);
            }, 0);
            return 2;
        });
    console.log(': after promise');
}

a();