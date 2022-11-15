const BASE = 10;
const NSIZE = 6;

/** Representation of a polynomial as an array */
const p1 = new Array(BASE).fill(1);

/** Product of two polynomials */
const product = function (mult1, mult2) {
    let result = new Array(mult1.length + mult2.length - 1).fill(0);
    for(let i in mult1) {
        for(let j in mult2) {
            result[Number(i) + Number(j)] += mult1[i]*mult2[j];
        }
    }
    return result;
};

let poly = [1];
for(let k = 0; k < NSIZE; k++) {
    poly = product(poly, p1);
}
print("array:", poly);
poly.map(x => x*x).reduce((a, v) => a + v);
