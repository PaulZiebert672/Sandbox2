/* run data filter as `node filter-orbit.js` */
var readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    terminal: false
});

console.log("%s\t%s\t%s", 't', 'x', 'z');
rl.on('line', function (line) {
    var a = line.split(" ");
    var t = a[0], coord = a[1];
    var q = coord.split(",");
    console.log("%s\t%s\t%s", t, q[0], q[2]);
});
