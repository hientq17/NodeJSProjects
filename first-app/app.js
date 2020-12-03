const hello = require('./hello');;
hello.sayHello();
const path = require('path');
var pathObj = path.parse(__filename);
console.log(pathObj);
