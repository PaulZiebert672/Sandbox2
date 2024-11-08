'use strict';
var VoidCode = VoidCode || {};
VoidCode.Problem = VoidCode.Problem || {};

VoidCode.Problem.JacobiElliptic = {
    title: "Jacobi elliptic functions",
    ode: function (x, t) {
        var k = this.params.k;
        return {
            /* initial conditions [0, 1, 1] */
            qdot: [
                x.q[1]*x.q[2],
                -x.q[0]*x.q[2],
                -k*k*x.q[0]*x.q[1]
            ],
            pdot: [0, 0, 0]
        };
    },
    invariant: function (x) {
        var k = this.params.k;
        return [
            x.q[0]*x.q[0] + x.q[1]*x.q[1],
            k*k*x.q[0]*x.q[0] + x.q[2]*x.q[2],
        ];
    },
    period: function () {
        var k = this.params.k;
        var agm = function (a, b) {
            var EPSILON = 5e-14;
            var am = (a + b)/2, gm = Math.sqrt(a*b);
            while(am - gm > EPSILON) {
                am = [(am + gm)/2, gm = Math.sqrt(am*gm)][0];
            };
            return am;
        };
        return 2*Math.PI/agm(1, Math.sqrt(1 - k*k));
    },
};

if(typeof module === 'object') {
    module.exports = VoidCode.Problem.JacobiElliptic;
}
