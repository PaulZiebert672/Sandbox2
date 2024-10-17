'use strict';
var VoidCode = VoidCode || {};

/* ------------ */

VoidCode.EVector = {
    add: function (x, y) {
        if(x instanceof Array) {
            return x.map(function (value, idx) {
                return value + y[idx];
            });
        } else {
            return x + y;
        }
    },
    diff: function (x, y) {
        if(x instanceof Array) {
            return x.map(function (value, idx) {
                return value - y[idx];
            });
        } else {
            return x - y;
        }
    },
    scale: function (x, lambda) {
        if(x instanceof Array) {
            return x.map(function (value) {
                return value*lambda;
            });
        } else {
            return x*lambda;
        }
    },
    norm: function (x) {
        if(x instanceof Array) {
            return x.reduce(function (acc, value) {
                return Math.sqrt(acc*acc + value*value);
            });
        } else {
            return Math.abs(x);
        }
    },
};

if(typeof module === 'object') {
    module.exports = VoidCode.EVector;
}
