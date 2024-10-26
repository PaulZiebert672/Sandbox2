'use strict';
var VoidCode = VoidCode || {};
VoidCode.Problem = VoidCode.Problem || {};

VoidCode.Problem.DoublePendulum = {
    title: "Double pendulum (mathematical)",
    hamilton: function (x, t) {
        var d1 = Math.cos(x.q[0] - x.q[1]);
        var d2 = 2 - d1*d1;
        var w = (Math.sin(x.q[0] - x.q[1])/(d2*d2))*(
            (x.p[0]*x.p[0] + 2*x.p[1]*x.p[1])*d1 - x.p[0]*x.p[1]*(4 - d2)
        );
        return {
            qdot: [
                (x.p[0] - x.p[1]*d1)/d2,
                (2*x.p[1] - x.p[0]*d1)/d2,
            ],
            pdot: [
                -2*Math.sin(x.q[0]) + w,
                -Math.sin(x.q[1]) - w,
            ],
        };
    },
    invariant: function (x) {
        var d1 = Math.cos(x.q[0] - x.q[1]);
        return (x.p[0]*x.p[0]
                + 2*x.p[1]*x.p[1]
                - 2*x.p[0]*x.p[1]*d1
            )/2/(2 - d1 * d1)
            + 3 - 2*Math.cos(x.q[0]) - Math.cos(x.q[1]);
    },
    limits: [[-Math.PI, -Math.PI], [Math.PI, Math.PI]],
};

if(typeof module === 'object') {
    module.exports = VoidCode.Problem.DoublePendulum;
}
