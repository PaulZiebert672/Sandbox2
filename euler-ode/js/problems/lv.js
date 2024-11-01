'use strict';
var VoidCode = VoidCode || {};
VoidCode.Problem = VoidCode.Problem || {};

VoidCode.Problem.LotkaVolterra = {
    title: "Lotka-Volterra model",
    ode: function (x, t) {
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
};

if(typeof module === 'object') {
    module.exports = VoidCode.Problem.LotkaVolterra;
}
