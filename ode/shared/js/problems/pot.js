'use strict';
var VoidCode = VoidCode || {};
VoidCode.Problem = VoidCode.Problem || {};

if(typeof require === 'function') {
    VoidCode.Roots = require('../roots.js');
    VoidCode.Quadrature = require('../quadrature.js');
}

VoidCode.Problem.PendulumOnTube = {
    title: "Mathematical pendulum hanging on the tube",
    hamilton: function (x, t) {
        var rho = this.params.rho;
        var nu = 1 + rho*x.q;
        return {
            qdot: x.p/(nu*nu),
            pdot: rho*x.p*x.p/Math.pow(nu, 3) - nu*Math.sin(x.q)
        };
    },
    invariant: function (x) {
        var rho = this.params.rho;
        var nu = 1 + rho*x.q;
        return 0.5*x.p*x.p/(nu*nu) + rho*Math.sin(x.q) + 1 - nu*Math.cos(x.q);
    },
    period: function (e0) {
        var Roots = VoidCode.Roots,
            Quadrature = VoidCode.Quadrature;
        var rho = this.params.rho;
        /* find limiting points */
        var energy = function (x) {
            var nu = 1 + rho*x.q;
            return 0.5*x.p*x.p/(nu*nu) + rho*Math.sin(x.q) + 1 - nu*Math.cos(x.q);
        };
        var amplitude = function (q) {
            return e0 - energy({ q: q, p: 0});
        };
        var alpha1 = Roots.secant(amplitude, [-2*Math.PI/3, 0]);
        var alpha2 = Roots.secant(amplitude, [2*Math.PI/3, 0]);
        /* avoid singularity */
        var kernel = function (q) {
            return Math.SQRT2*(1 + rho*q)/Math.sqrt(amplitude(q));
        };
        /* singular part is a power of a polynomial of order one */
        var singularKernel = function (alpha) {
            return function (q) {
                return Math.SQRT2*(1 + rho*q)/Math.sqrt(-(1 + rho*alpha)*Math.sin(alpha)*(q - alpha));
            };
        };
        /* calculated from singularKernel by analytical method */
        var singularValue = function (alpha) {
            return 2*Math.SQRT2*alpha*(2*rho*alpha + 3)/(3*Math.sqrt(alpha*(1 + rho*alpha)*Math.sin(alpha)))
        };
        var timeSingular1 = -singularValue(alpha1);
        var timeSingular2 = singularValue(alpha2);
        var regularKernel = function (alpha) {
            return function (q) {
                return kernel(q) - singularKernel(alpha)(q);
            };
        };
        var timeRegular1 = Quadrature.gauss(regularKernel(alpha1), [alpha1, 0], 96);
        var timeRegular2 = Quadrature.gauss(regularKernel(alpha2), [0, alpha2], 96);
        return timeRegular1 + timeSingular1 + timeRegular2 + timeSingular2;
    },
};

if(typeof module === 'object') {
    module.exports = VoidCode.Problem.PendulumOnTube;
}
