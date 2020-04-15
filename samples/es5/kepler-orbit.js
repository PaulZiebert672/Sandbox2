/* Elliptic Kepler orbit determined by eccentricity */
'use strict';

var KeplerOrbit = function (eps) {
  this.eps = eps;
};

KeplerOrbit.prototype.coord = function (t) {
  var eps = this.eps;
  var psi = (function (t) {
    var EPSILON = 5e-14;
    var theta0 = 0, theta1 = t;
    while(Math.abs(theta0 - theta1) > EPSILON) {
      theta0 = theta1, theta1 = t + eps*Math.sin(theta0);
    }
    return theta1;
  })(t);
  var u0 = 1 - eps*Math.cos(psi);
  var u1 = Math.sqrt(1 - eps*eps);
  return {
    q: [Math.cos(psi) - eps, u1*Math.sin(psi)],
    p: [-Math.sin(psi)/u0, u1*Math.cos(psi)/u0]
  };
};
