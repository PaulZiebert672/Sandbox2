'use strict';
var VoidCode = VoidCode || {};
VoidCode.Problem = VoidCode.Problem || {};

VoidCode.Problem.VanDerPohlOscillator = {
    title: "Van der Pohl oscillator",
    ode: function (x, t) {
        var mu = this.params.mu;
        return {
            qdot: x.p,
            pdot: mu*(1 - x.q*x.q)*x.p - x.q
        };
    },
    /* not a real invariant for arbitrary parameter mu */
    invariant: function (x) {
        return x.p*x.p/2 + x.q*x.q/2;
    },
};

if(typeof module === 'object') {
    module.exports = VoidCode.Problem.VanDerPohlOscillator;
}
