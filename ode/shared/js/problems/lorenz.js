'use strict';
var VoidCode = VoidCode || {};
VoidCode.Problem = VoidCode.Problem || {};

VoidCode.Problem.LorenzAttractor = {
    title: "Lorenz attractor",
    /* no phase space concept */
    hamilton: function (x, t) {
        var params = this.params;
        var rho = params.rho, sigma = params.sigma, beta = params.beta;
        return {
            qdot: [
                sigma*(x.q[1] - x.q[0]),
                x.q[0]*(rho - x.q[2]) - x.q[1],
                x.q[0]*x.q[1] - beta*x.q[2]
            ],
            pdot: [0, 0, 0]
        };
    },
    invariant: function (x) {
        /* stub */
        return 0;
    },
};

if(typeof module === 'object') {
    module.exports = VoidCode.Problem.LorenzAttractor;
}
