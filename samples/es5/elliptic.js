'use strict';
var Jacobi = Jacobi || {};

Jacobi.ellipticK = function (k) {
    var a = 1, g = Math.sqrt(1 - k*k), eps = 5e-14;
    do {
        a = (a + g)/2 + (g = Math.sqrt(a*g), 0);
    } while(a - g > eps);
    return Math.PI/2/a;
};

Jacobi.ellipticAm = function (t, k) {
    var a = [1], g = [Math.sqrt(1 - k*k)], d = [k], eps = 5e-14;
    do {
        a.unshift((a[0] + g[0])/2);
        g.unshift(Math.sqrt(a[1]*g[0]));
        d.unshift((a[1] - g[1])/2);
    } while(Math.abs(d[0]) > eps);
    for(var i = 0, n = a.length - 1, phi = [Math.exp(n*Math.LN2)*a[0]*t]; i < n; i++) {
        phi[i + 1] = (phi[i] + Math.asin((d[i]/a[i])*Math.sin(phi[i])))/2;
    }
    return phi[n];
};
