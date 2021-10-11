const md5 = require('md5');
const nodersa = require('node-rsa');

var rsa = new nodersa({b: 512});
rsa.setOptions({encryptionScheme: 'pkcs1'});

rsa.Pub = rsa.exportKey("pkcs8-public-pem");
rsa.Md5 = md5(rsa.Pub);

module.exports = rsa;