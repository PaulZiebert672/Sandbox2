'use strict';
var VoidCode = VoidCode || {};
VoidCode.Problem = VoidCode.Problem || {};

VoidCode.Problem.CircularRestricted3_BodyProblem = {
    title: "Circular restricted 3-body problem",
    hamilton: function (x, t) {
        var mu = this.params.mu;
        var q1 = x.q[0] + mu;
        var q2 = x.q[0] + mu - 1;
        var r1 = Math.sqrt(q1*q1 + x.q[1]*x.q[1] + x.q[2]*x.q[2]);
        var r2 = Math.sqrt(q2*q2 + x.q[1]*x.q[1] + x.q[2]*x.q[2]);
        var r1By3 = Math.pow(r1, 3);
        var r2By3 = Math.pow(r2, 3);
        /* co-rotating frame */
        return {
            qdot: x.p,
            pdot: [
                2*x.p[1] + x.q[0] - (1 - mu)*q1/r1By3 - mu*q2/r2By3,
                -2*x.p[0] + x.q[1] - (1 - mu)*x.q[1]/r1By3 - mu*x.q[1]/r2By3,
                -(1 - mu)*x.q[2]/r1By3 - mu*x.q[2]/r2By3
            ]
        };
    },
    invariant: function (x) {
        var mu = this.params.mu;
        var q1 = x.q[0] + mu;
        var q2 = x.q[0] + mu - 1;
        var r1 = Math.sqrt(q1*q1 + x.q[1]*x.q[1] + x.q[2]*x.q[2]);
        var r2 = Math.sqrt(q2*q2 + x.q[1]*x.q[1] + x.q[2]*x.q[2]);
        /* Jacobi constant */
        return (x.p[0]*x.p[0] + x.p[1]*x.p[1] + x.p[2]*x.p[2])/2
            - (1 - mu)/r1 - mu/r2 - ((1 - mu)*r1*r1 + mu*r2*r2)/2;
    },
};

if(typeof module === 'object') {
    module.exports = VoidCode.Problem.CircularRestricted3_BodyProblem;
}
