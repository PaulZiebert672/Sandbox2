'use strict';
var VoidCode = VoidCode || {};

/* ------------ */

VoidCode.Problem = {

    /* Mathematical pendulum */
    mp: {
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
    },

    /* Lotka-Volterra model */
    lv: {
        title: "Lotka-Volterra model",
        hamilton: function (x, t) {
            return {
                qdot: Math.exp(x.p) - 1,
                pdot: 1 - Math.exp(x.q),
            };
        },
        invariant: function (x) {
            var exp2m = function (z) {
                return Math.exp(z) - z - 1;
            };
            return exp2m(x.q) + exp2m(x.p);
        },
        period: function (e0) {
            var pArray = [];
            var gstroke = function (u) {
                var gArray = [];
                var g0;
                var getG = function () {
                    var g0 = +gArray.slice(-1);
                    return g0 - 1 + (g0 + u*u / 2) / (Math.exp(g0) - 1);
                };
                var getError = function () {
                    var n = gArray.length;
                    return Math.abs(gArray[n - 1] - gArray[n - 2]);
                };
                if(Math.abs(u) < 1e-4) {
                    return 1 - (1/3)*u + (1/12)*u*u - (2/135)*u*u*u + (1/864)*u*u*u*u;
                }
                g0 = (u < 3)? u: Math.log(u*u / 2);
                gArray.push(g0);
                do {
                    gArray.push(getG());
                }
                while(getError() > 1e-14);
                return u / (+gArray.slice(-1) + u*u / 2);
            };
            var getP = function (k) {
                var sum = 0;
                var theta;
                var sq2e0 = Math.sqrt(2 * e0);
                for(var j = 0; j < k; j++) {
                    theta = 2*Math.PI * j / k;
                    sum += gstroke(sq2e0*Math.cos(theta)) * gstroke(sq2e0*Math.sin(theta));
                }
                return 2*Math.PI * sum / k;
            };
            var getError = function () {
                var n = pArray.length;
                return Math.abs(pArray[n - 1] - pArray[n - 2]);
            };
            var k = 5;
            pArray.push(getP(k));
            do {
                k *= 2;
                pArray.push(getP(k));
            }
            while(getError() > 1e-14);
            return pArray.slice(-1);
        },
        separable: true,
    },

    /* Kepler problem */
    kepler: {
        title: "Kepler problem",
        hamilton: function (x, t) {
            var r3by2 = Math.pow(x.q[0] * x.q[0] + x.q[1] * x.q[1], 3/2);
            return {
                qdot: x.p,
                pdot: [
                    -x.q[0] / r3by2,
                    -x.q[1] / r3by2,
                ],
            };
        },
        invariant: function (x) {
            return [
                /* energy */
                (x.p[0] * x.p[0] + x.p[1] * x.p[1]) / 2
                    - 1 / Math.sqrt(x.q[0] * x.q[0] + x.q[1] * x.q[1]),
                /* angular momentum */
                x.q[0] * x.p[1] - x.q[1] * x.p[0],
            ];
        },
        period: function (e) {
            var a = -1 / (2 * e[0]);
            return (a > 0 && a < 1e4)? 2 * Math.PI * Math.pow(a, 3/2): +Infinity;
        },
        separable: true,
    },

    /* Double pendulum (mathematical) */
    dpm: {
        title: "Double pendulum (mathematical)",
        hamilton: function (x, t) {
            var d1 = Math.cos(x.q[0] - x.q[1]);
            var d2 = 2 - d1 * d1;
            var w = (Math.sin(x.q[0] - x.q[1]) / (d2 * d2)) * (
                 (x.p[0] * x.p[0] + 2 * x.p[1] * x.p[1]) * d1 - x.p[0] * x.p[1] * (4 - d2)
            );
            return {
                qdot: [
                    (x.p[0] - x.p[1] * d1) / d2,
                    (2 * x.p[1] - x.p[0] * d1) / d2,
                ],
                pdot: [
                    -2 * Math.sin(x.q[0]) + w,
                    -Math.sin(x.q[1]) - w,
                ],
            };
        },
        invariant: function (x) {
            var d1 = Math.cos(x.q[0] - x.q[1]);
            return (x.p[0] * x.p[0]
                    + 2 * x.p[1] * x.p[1]
                    - 2 * x.p[0] * x.p[1] * d1
                ) / 2 / (2 - d1 * d1)
                + 3 - 2 * Math.cos(x.q[0]) - Math.cos(x.q[1]);
        },
        limits: [[-Math.PI, -Math.PI], [Math.PI, Math.PI]],
    },
};

if(typeof module === 'object') {
    module.exports = VoidCode.Problem;
}
