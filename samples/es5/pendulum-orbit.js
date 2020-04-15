/* Mathematical pendulum orbit in phase space */
'use strict';

var PendulumOrbit = function (e0) {
  this.e0 = e0;  /* energy */
  this.k = (e0 > 2)? Math.sqrt(2/e0): Math.sqrt(e0/2);
};

PendulumOrbit.prototype.period = function () {
  var ellipticK = Jacobi.ellipticK;
  var k = this.k;
  return (this.e0 > 2)? 2*k*ellipticK(k): 4*ellipticK(k);
};

PendulumOrbit.prototype.coord = function (t) {
  var ellipticAm = Jacobi.ellipticAm;
  var e0 = this.e0, k = this.k;
  return {
    q: function (t) {
      return (e0 > 2)?
        2*Math.atan(Math.tan(ellipticAm(t/k, k))):
        2*Math.asin(k*Math.sin(ellipticAm(t, k)));
    }(t),
    p: function (t) {
      return (e0 > 2)?
        (2/k)*Math.sqrt(1 - Math.pow(k*Math.sin(ellipticAm(t/k, k)), 2)):
        2*k*Math.cos(ellipticAm(t, k));
    }(t),
  };
};
