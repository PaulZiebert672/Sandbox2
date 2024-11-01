'use strict';
var VoidCode = VoidCode || {};
VoidCode.Problem = VoidCode.Problem || {};

VoidCode.Problem.KeplerProblem = {
    title: "Kepler problem",
    hamilton: function (x, t) {
        var r3by2 = Math.pow(x.q[0]*x.q[0] + x.q[1]*x.q[1], 3/2);
        return {
            qdot: x.p,
            pdot: [
                -x.q[0]/r3by2,
                -x.q[1]/r3by2,
            ],
        };
    },
    invariant: function (x) {
        return [
            /* energy */
            (x.p[0]*x.p[0] + x.p[1]*x.p[1])/2
                - 1/Math.sqrt(x.q[0]*x.q[0] + x.q[1]*x.q[1]),
            /* angular momentum */
            x.q[0]*x.p[1] - x.q[1]*x.p[0],
        ];
    },
    period: function (e) {
        var a = -1/(2*e[0]);
        return (a > 0 && a < 1e4)? 2*Math.PI*Math.pow(a, 3/2): +Infinity;
    },
    separable: true,
};

if(typeof module === 'object') {
    module.exports = VoidCode.Problem.KeplerProblem;
}
