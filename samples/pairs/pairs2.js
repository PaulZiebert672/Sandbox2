/* Run as `node pairs2.js` */

const NLIMIT = 1000000;

//console.log(NLIMIT.toString().length);
const s = new Array(NLIMIT.toString().length - 1).fill("0").join("");
const m = new Map;
for(var i = 0; i < NLIMIT; i++) {
    var r0 = i.toString();
    var r1 = s.substring(r0.length) + r0;
    var sum = r1.split("").map(x => Number(x)).reduce((a, v) => a + v);
    //console.log(r1, sum);
    if(m.has(sum)) {
        m.set(sum, m.get(sum) + 1);
    } else {
        m.set(sum, 1);
    }
}
console.log(m);
var total = Array.from(m.values()).reduce((a, v) => a + v);
var variants = Array.from(m.values()).map(x => x*x).reduce((a, v) => a + v);
console.log("total: %s, variants: %s", total, variants);
