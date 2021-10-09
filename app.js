const md5 = require('md5');
const express = require('express');
const nodersa = require('node-rsa');

var rsa = new nodersa({b: 512});
rsa.setOptions({encryptionScheme: 'pkcs1'});
const rsaPub = rsa.exportKey("pkcs8-public-pem");
const rsaMd5 = md5(rsaPub);

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

function keygen(){
    var str = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var res = "";
    for(var i = 0; i < 15; i ++) {
        var id = Math.ceil(Math.random()*35);
        res += str[id];
    }
    return res;
}

const key = keygen();
console.log(key);
console.log(rsaMd5);

app.get('/', function(req, res){
    res.redirect('/html/index.html');
});

app.post('/submitKey', function(req, res){
    let check = req.body.key;
    check = rsa.decrypt(check, 'utf8');
    if(check === key)res.send({success: true});
    else res.send({success: false});
})

app.get('/getPub', function(req, res){
    res.send({
        pub: rsaPub,
        md5: rsaMd5
    });
})

app.listen(8860);