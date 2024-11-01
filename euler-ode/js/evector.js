'use strict';
var VoidCode = VoidCode || {};

/**
 * Static methods for vectors in Euclidean space
 */
VoidCode.EVector = {
    /**
     * Sum of vectors
     * 
     * @param {(Number|Number[])} x
     * @param {(Number|Number[]))} y
     * @returns {(Number|Number[]))}
     */
    add: function (x, y) {
        if(x instanceof Array) {
            return x.map(function (value, idx) {
                return value + y[idx];
            });
        } else {
            return x + y;
        }
    },
    /**
     * Difference of vectors
     * 
     * @param {(Number|Number[])} x
     * @param {(Number|Number[]))} y
     * @returns {(Number|Number[]))}
     */
    diff: function (x, y) {
        if(x instanceof Array) {
            return x.map(function (value, idx) {
                return value - y[idx];
            });
        } else {
            return x - y;
        }
    },
    /**
     * Scale vector
     * 
     * @param {(Number|Number[])} x
     * @param {Number} lambda
     * @returns {(Number|Number[]))}
     */
    scale: function (x, lambda) {
        if(x instanceof Array) {
            return x.map(function (value) {
                return value*lambda;
            });
        } else {
            return x*lambda;
        }
    },
    /**
     * Euclidean norm
     * 
     * @param {(Number|Number[])} x
     * @returns {Number}
     */
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
