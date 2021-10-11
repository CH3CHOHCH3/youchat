var rsa = require('./encrypt.js');
const express = require('express');
var cookieParser = require('cookie-parser');

function randStr(n){
    var str = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var res = "";
    for(var i = 0; i < n; i ++) {
        var id = Math.ceil(Math.random()*35);
        res += str[id];
    }
    return res;
}
const key = randStr(20);

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser(randStr(128)));


console.log(key);
console.log(rsa.Md5);

app.get('/', function(req, res){
    res.redirect('/html/index.html');
});

app.get('/getPub', function(req, res){
    res.send({
        pub: rsa.Pub,
        md5: rsa.Md5
    });
});

app.post('/submitKey', function(req, res){
    let check = req.body.key;
    let username = req.body.username;

    check = rsa.decrypt(check, 'utf8');
    username = rsa.decrypt(username, 'utf8');

    if(check === key){
        res.cookie('username', username, {path: '/chat', signed: true});
        res.redirect('/chat');
    }
    else res.redirect('/');
});

function auth(req, res, next){
    if(req.signedCookies.username == undefined){
        res.redirect('/');
    }
    else{
        next();
    }
}

app.get('/chat', auth, function(req, res){
    res.sendFile(__dirname + '/private/chat.html');
});

app.listen(8860);