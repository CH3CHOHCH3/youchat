function encrypt(value){
    let encrypt = new JSEncrypt();
    let pub = sessionStorage.getItem('pub');
    encrypt.setPublicKey(pub);
    return encrypt.encrypt(value);
}

function getPub(){
    fetch('/getPub')
    .then(res=>res.json())
    .then(data=>{
        sessionStorage.setItem('pub', ''+data.pub);
        return data.md5;
    })
    .then(md5=>{
        var app = new Vue({
            el: '#md5',
            data: {
              md5: md5
            }
        });
    })
}

function submitKey(){
    fetch('/submitKey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({key: encrypt(document.getElementById('key').value)})
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.success === true)alert("Success.");
        else alert("Failed.")
    })
}
