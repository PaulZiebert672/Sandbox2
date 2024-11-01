'use strict';
var VoidCode = VoidCode || {};

if(typeof require === 'function') {
    VoidCode.Problem = require('./problems');
    VoidCode.Integrator = require('./integrator.js');
}

/**
 * @callback ODE
 * @param {Psi} psi
 * @param {Number} t
 * @returns {Psi}
 * 
 * @callback Invariant
 * @param {Psi} psi
 * @returns {(Number|Number[])}
 *
 * @callback Integrator
 * @param {Number} h - time step
 * @returns {Point}
 *
 * @typedef {(Number|Number[])} EVector
 * 
 * @typedef {Object} Psi
 * @property {EVector} q
 * @property {EVector} p
 * 
 * @typedef {Object} Config
 * @property {String} id
 * @property {String} integrator
 */

/**
 * Evolution of a dynamical system in phase space
 * 
 * @typedef {Object} Point
 * @property {Number} t - time
 * @property {Psi} psi - position in phase space
 * @property {ODE} hamilton - system of ODE
 * @property {Invariant} invariant
 * @property {Integrator} integrator
 * 
 * @constructor
 * @param {Number} t - time
 * @param {Psi} psi - position in phase space
 * @returns {Point}
 */
VoidCode.Point = function (t, psi) {
    this.t = t;
    this.psi = psi;
    /* these props must be defined in factory method */
    // this.hamilton = function () {};
    // this.invariant = function () {};
    // this.integrator = function () {};
};

VoidCode.Point.prototype.toString = function () { return this.t + ' ' + this.psi; };
VoidCode.Point.prototype.toValue = function () { return this.invariant(this.psi); };

/**
 * Create evolution of dynamical system in phase space
 * 
 * @param {Point} init - initial time and position in phase space
 * @param {Config} cfg - configuration of dynamical system
 * @returns {Point}
 */
VoidCode.Point.create = function (init, cfg) {
    var point = new VoidCode.Point(init.t, init.psi);
    point.params = cfg.params;
    VoidCode.Problem.isProblemSeparable = !!(VoidCode.Problem[cfg.id].separable);
    VoidCode.Point.prototype.hamilton = VoidCode.Problem[cfg.id].hamilton;
    VoidCode.Point.prototype.invariant = VoidCode.Problem[cfg.id].invariant;
    VoidCode.Point.prototype.integrator = VoidCode.Integrator(cfg.integrator);
    return point;
};

if(typeof module === 'object') {
    module.exports = VoidCode.Point;
}
