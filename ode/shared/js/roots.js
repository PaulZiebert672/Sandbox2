'use strict';
var VoidCode = VoidCode || {};

/**
 * @callback Func
 * @param {Number} x
 * @returns {Number}
 */
VoidCode.Roots = {
    EPS: 5e-11,
    NMAX: 200,
    /**
     * Find root of a scalar function by the secant method
     * 
     * @param {Func} fn - function
     * @param {Number[]} segment - initial segment of function arguments
     * @returns {Number}
     */
    secant: function (fn, segment) {
        var EPS = VoidCode.Roots.EPS, NMAX = VoidCode.Roots.NMAX;
        var n = 0, diff = segment[1] - segment[0];
        var values = [fn(segment[0]), fn(segment[1])];
        var xm, diff;
        do {
            xm = segment[1] - values[1]*diff/(values[1] - values[0]);
            segment.push(xm), segment.shift();
            values.push(fn(xm)), values.shift();
        } while(Math.abs(diff = segment[1] - segment[0]) > EPS && ++n < NMAX);
        return xm;
    },
    /**
     * Find root of a scalar function by the Newton method
     * 
     * @param {Func[]} fn - array of function and its derivative
     * @param {Number} x0 - initial value of function argument
     * @returns {Number}
     */
    newton: function (fnarray, x0) {
        var EPS = VoidCode.Roots.EPS, NMAX = VoidCode.Roots.NMAX;
        var n = 0, x1;
        do {
            x1 = x0 - fnarray[0](x0)/fnarray[1](x0);
            x1 = x0 + (x0 = x1, 0);
        } while(Math.abs(x1 - x0) > EPS && ++n < NMAX);
        return x0;
    },
};

if(typeof module === 'object') {
    module.exports = VoidCode.Roots;
}
