function a() {
    var b = Promise.resolve();
    b.finally(()=>{console.log('finally=1.1')});
    b.then(()=>console.log('then=1.2'));
    b=Promise.reject();
    b.finally(()=>console.log('finally=2.1')).catch(()=>{});
    b.catch(()=>console.log('catch=2.2'));
    b.then(()=>{},()=>console.log('then=2.3'));
    b = Promise.resolve();
    b.then(()=>console.log('then=3.1'));
    b.finally(()=>{console.log('finally=3.2')});
    b=Promise.reject();
    b.catch(()=>console.log('catch=4.1'));
    b.finally(()=>console.log('finally=4.2')).catch(()=>{});
    b.then(()=>{},()=>console.log('then=4.3'));
    b=Promise.reject();
    b.then(()=>{},()=>console.log('then=5.1'));
    b.catch(()=>console.log('catch=5.2'));
    b.finally(()=>console.log('finally=5.3')).catch(()=>{});
}

a();