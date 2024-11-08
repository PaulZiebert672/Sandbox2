'use strict';
var VoidCode = VoidCode || {};

if(typeof require === 'function') {
    VoidCode.Roots = require('./roots.js');
}

/**
 * @callback Func
 * @param {Number} x
 * @returns {Number}
 * 
 * @callback LegendrePoly
 * @param {Number} n
 * @param {Number} theta
 * @returns {Number}
 */
VoidCode.Quadrature = {
    EPS: 5e-11,
    NMAX: 200,
    /**
     * Find integral of a scalar function by the Simpson rule.
     * Less effective than adaptive Simpson rule.
     * 
     * @param {Func} fn - function
     * @param {Number[]} segment - segment of integration
     * @returns {Number}
     */
    simpson: function (fn, segment) {
        var EPS = VoidCode.Quadrature.EPS, NMAX = VoidCode.Quadrature.NMAX;
        var n = 0, steps = 5;
        var quad = function (steps) {
            var k = 0, sum = 0;
            var h = (segment[1] - segment[0])/steps;
            sum += fn(segment[0]);
            for(var k = 1; k < 2*steps; k++) {
                sum += 2*(k%2 + 1)*fn(segment[0] + k*h/2);
            }
            sum += fn(segment[1]);
            return sum*h/6;
        };
        var result = [quad(steps)];
        do {
            result.push(quad(steps *= 2));
        } while(Math.abs(result[1] - result.shift()) > EPS && ++n < NMAX);
        return result.shift();
    },
};

/**
 * Create Legendre polynomial
 * 
 * @param {Number} n - order
 * @param {Number} theta - angle
 * @returns {LegendrePoly}
 */
VoidCode.Quadrature.LegendreP = function (n, theta) {
    /** @type {LegendrePoly[]} */
    var memo = { "0": 1, "1": Math.cos(theta) };
    /** @type {LegendrePoly} */
    var poly = function (n, theta) {
        if(!(n in memo)) {
            memo[n] = ((2*n - 1)*Math.cos(theta)*poly(n - 1, theta) - (n - 1)*poly(n - 2, theta))/n;
        }
        return memo[n];
    };
    return poly(n, theta);
};

/**
 * Create derivative of Legendre polynomial
 * 
 * @param {Number} n - order
 * @param {Number} theta - angle
 * @returns {LegendrePoly}
 */
VoidCode.Quadrature.LegendrePstroke = function (n, theta) {
    /** @type {LegendrePoly} */
    var LegendreP = VoidCode.Quadrature.LegendreP;
    return n*(Math.cos(theta)*LegendreP(n, theta) - LegendreP(n - 1, theta))/Math.sin(theta);
};

/**
 * Calculate roots of Legendre polynomial
 * 
 * @param {Number} n - order
 * @returns {Number[]}
 */
VoidCode.Quadrature.LegendreRoots = function (n) {
    var newton = VoidCode.Roots.newton,
        LegendreP = VoidCode.Quadrature.LegendreP,
        LegendrePstroke = VoidCode.Quadrature.LegendrePstroke;
    var self = VoidCode.Quadrature.LegendreRoots;
    if(!(n in self.memo)) {
        self.memo[n] = [];
        for(var i = 0; i < n; i++) {
            self.memo[n].push(newton(
                [
                    function (theta) { return LegendreP(n, theta); },
                    function (theta) { return LegendrePstroke(n, theta); }
                ],
                Math.PI*(i + 3/4)/(n + 1/2)
            ));
        }
    }
    return self.memo[n];
};
VoidCode.Quadrature.LegendreRoots.memo = {};

/**
 * Calculate weights for Gauss-Legendre quadrature
 * 
 * @param {Number} n - order
 * @returns {Number[]}
 */
VoidCode.Quadrature.GaussWeights = function (n) {
    var LegendreRoots = VoidCode.Quadrature.LegendreRoots,
        LegendrePstroke = VoidCode.Quadrature.LegendrePstroke;
    var self = VoidCode.Quadrature.GaussWeights;
    if(!(n in self.memo)) {
        self.memo[n] = LegendreRoots(n).map(function (theta) {
            var dP = LegendrePstroke(n, theta);
            return 2/(dP*dP);
        });
    }
    return self.memo[n];
};
VoidCode.Quadrature.GaussWeights.memo = {};

/**
 * Find integral by Gauss-Legendre quadrature
 * 
 * @param {Func} fn - kernel
 * @param {Number[]} segment of integration
 * @param {Number} n - order
 * @returns {Number}
 */
VoidCode.Quadrature.gauss = function (fn, segment, n) {
    var GaussWeights = VoidCode.Quadrature.GaussWeights,
        LegendreRoots = VoidCode.Quadrature.LegendreRoots;
    var b = segment[0], a = segment[1];
    n = n || 12; /* default value */
    return ((a - b)/2)*GaussWeights(n).reduce(function (sum, w, k) {
        return sum + w*fn(Math.cos(LegendreRoots(n)[k])*((a - b)/2) + ((a + b)/2));
    }, 0);
};

if(typeof module === 'object') {
    module.exports = VoidCode.Quadrature;
}
