/* run data filter as `node filter-orbit.js` */
var readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    terminal: false
});

var e0;
console.log("%s\t%s\t%s\t%s", 't', 'x', 'y', 'dE');
rl.on('line', function (line) {
    var a = line.split(" ");
    var t = a[0], coord = a[1], e = a[3];
    var q = coord.split(",");
    if(!e0) { e0 = e; }
    console.log("%s\t%s\t%s\t%s", t, q[0], q[1], e - e0);
});
