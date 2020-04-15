'use strict';
var Iter = Iter || {};

Iter.EPSILON = 5e-13;
Iter.NMAX = 500;

Iter.newtonSolve = function (x0, f, fstroke) {
    var n = 0, x1;
    do {
        x1 = x0 - f(x0)/fstroke(x0);
        x1 = x0 + (x0 = x1, 0);
    } while(Math.abs(x1 - x0) > Iter.EPSILON && ++n < Iter.NMAX);
    return x0;
};

Iter.agm = function (a, b) {
    var am = Math.max(a, b), gm = Math.min(a, b);
    while(am - gm > Iter.EPSILON) {
        am = [(am + gm)/2, gm = Math.sqrt(am*gm)][0];
    };
    return am;
};
