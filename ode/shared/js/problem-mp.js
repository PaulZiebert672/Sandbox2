'use strict';
var VoidCode = VoidCode || {};
VoidCode.Problem = VoidCode.Problem || {};

VoidCode.Problem.MathematicalPendulum = {
    title: "Mathematical pendulum",
    hamilton: function (x, t) {
        return {
            qdot: x.p,
            pdot: -Math.sin(x.q)
        };
    },
    invariant: function (x) {
        return x.p*x.p/2 + 1 - Math.cos(x.q);
    },
    period: function (e0) {
        var DELTAE = 1e-6, EPSILON = 5e-14;
        var agm = function (a, b) {
            var am = (a + b)/2, gm = Math.sqrt(a*b);
            while(am - gm > EPSILON) {
                am = [(am + gm)/2, gm = Math.sqrt(am*gm)][0];
            };
            return am;
        };
        if(e0 < 2 - DELTAE) {
            return 2*Math.PI / agm(1, Math.sqrt((2 - e0)/2));
        }
        else if (e0 > 2 + DELTAE) {
            return Math.PI*Math.sqrt(2/e0) / agm(1, Math.sqrt((e0 - 2)/e0));
        }
        else {
            return +Infinity;
        }
    },
    separable: true,
    limits: [-Math.PI, Math.PI],
};

if(typeof module === 'object') {
    module.exports = VoidCode.Problem.MathematicalPendulum;
}
