'use strict';
var VoidCode = VoidCode || {};

if(typeof require === 'function') {
    VoidCode.EVector = require('./evector.js');
}

/**
 * Position in phase space
 * 
 * @typedef {Object} Psi
 * @property {EVector} q
 * @property {EVector} p
 * 
 * @constructor
 * @param {EVector} q - coordinate
 * @param {EVector} p - momentum
 * @returns {Psi}
 */
VoidCode.Psi = function (q, p) {
    var Psi = VoidCode.Psi;
    if(!(this instanceof Psi)) {
        return new Psi(q, p);
    }
    if(arguments[0].qdot !== undefined && arguments[0].pdot !== undefined) {
        this.q = arguments[0].qdot;
        this.p = arguments[0].pdot;
    } else if(arguments.length === 1) {
        if(Array.isArray(arguments[0])) {
            this.q = arguments[0][0];
            this.p = arguments[0][1];
        } else {
            this.q = arguments[0].q;
            this.p = arguments[0].p;
        }
    } else {
        this.q = q;
        this.p = p;
    }
};

VoidCode.Psi.prototype._addQ = function (q) {
    return VoidCode.EVector.add(this.q, q);
};

VoidCode.Psi.prototype._addP = function (p) {
    return VoidCode.EVector.add(this.p, p);
};

VoidCode.Psi.prototype._scaleQ = function (lambda) {
    return VoidCode.EVector.scale(this.q, lambda);
};

VoidCode.Psi.prototype._scaleP = function (lambda) {
    return VoidCode.EVector.scale(this.p, lambda);
};

VoidCode.Psi.prototype.add = function (psi) {
    return new VoidCode.Psi(this._addQ(psi.q), this._addP(psi.p));
};

VoidCode.Psi.prototype.scale = function (lambda) {
    return new VoidCode.Psi(this._scaleQ(lambda), this._scaleP(lambda));
};

VoidCode.Psi.prototype.addTo = function (psi) {
    this.q = this._addQ(psi.q);
    this.p = this._addP(psi.p);
    return this;
};

VoidCode.Psi.prototype.scaleBy = function (lambda) {
    this.q = this._scaleQ(lambda);
    this.p = this._scaleP(lambda);
    return this;
};

VoidCode.Psi.prototype.toString = function () { return this.q + ' ' + this.p; };

/**
 * Difference of two vectors in phase space
 * 
 * @param {Psi} x
 * @param {Psi} y
 * @returns {Psi}
 */
VoidCode.Psi.diff = function (x, y) {
    return new VoidCode.Psi(
        VoidCode.EVector.diff(x.q, y.q),
        VoidCode.EVector.diff(x.p, y.p)
    );
};

/**
 * L_1 norm of vector in phase space
 * 
 * @param {Psi} x
 * @returns {Number}
 */
VoidCode.Psi.l1norm = function (x) {
    return VoidCode.EVector.norm(x.q) + VoidCode.EVector.norm(x.p);
};

/**
 * L_2 norm of vector in phase space
 * 
 * @param {Psi} x
 * @returns {Number}
 */
VoidCode.Psi.l2norm = function (x) {
    var normQ = VoidCode.EVector.norm(x.q);
    var normP = VoidCode.EVector.norm(x.p);
    return Math.sqrt(normQ*normQ + normP*normP);
};

/**
 * L_{\inf} norm of vector in phase space
 * 
 * @param {Psi} x
 * @returns {Number}
 */
VoidCode.Psi.l8norm = function (x) {
    return Math.max(VoidCode.EVector.norm(x.q), VoidCode.EVector.norm(x.p));
};

if(typeof module === 'object') {
    module.exports = VoidCode.Psi;
}
