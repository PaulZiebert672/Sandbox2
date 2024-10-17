'use strict';
var VoidCode = VoidCode || {};

if(typeof require === 'function') {
    VoidCode.Problem = require('./problem.js');
    VoidCode.Integrator = require('./integrator.js');
}

VoidCode.Point = function (t, psi) {
    this.t = t;
    this.psi = psi;
};

VoidCode.Point.prototype.toString = function () { return this.t + ' ' + this.psi; };
VoidCode.Point.prototype.toValue = function () { return this.invariant(this.psi); };

VoidCode.Point.create = function (init, cfg) {
    var point = new VoidCode.Point(init.t, init.psi);
    VoidCode.Point.prototype.hamilton = VoidCode.Problem[cfg.id].hamilton;
    VoidCode.Point.prototype.invariant = VoidCode.Problem[cfg.id].invariant;
    VoidCode.Point.prototype.integrator = VoidCode.Integrator(cfg.integrator, VoidCode.Problem[cfg.id].separable);
    return point;
};

if(typeof module === 'object') {
    module.exports = VoidCode.Point;
}
