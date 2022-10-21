/* Run as `node combo1.js` */

const KSIZE = 6;
const N_MAX = 15;

const m = new Map;
for(var i = 0; i < N_MAX; i++) {
    var combo = 1;
    for(var k = 1; k < KSIZE; k++) {
        combo = combo*(i + k)/(k);
    }
    m.set(i, combo);
}
console.log(m);
