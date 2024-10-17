'use strict';
var VoidCode = VoidCode || {};

if(typeof require === 'function') {
    VoidCode.Config = require('./config.js');
    VoidCode.Problem = require('./problem.js');
    VoidCode.Integrator = require('./integrator.js');
}

VoidCode.Point = function (t, psi) {
    this.t = t;
    this.psi = psi;
};

VoidCode.Point.prototype.hamilton = VoidCode.Problem[VoidCode.Config.id].hamilton;
VoidCode.Point.prototype.invariant = VoidCode.Problem[VoidCode.Config.id].invariant;
VoidCode.Point.prototype.integrator = VoidCode.Integrator(VoidCode.Config.integrator);

VoidCode.Point.prototype.toString = function () { return this.t + ' ' + this.psi; };
VoidCode.Point.prototype.toValue = function () { return this.invariant(this.psi); };

if(typeof module === 'object') {
    module.exports = VoidCode.Point;
}
