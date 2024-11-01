'use strict';
var VoidCode = VoidCode || {};

/**
 * Static methods to normalize coordinates
 */
VoidCode.Limit = {
    /**
     * @param {EVector} q - coordinate
     * @param {(Number[]|Number[][])} limits
     * @returns {EVector}
     */
    normalizeQ: function (q, limits) {
        var high = limits[1], low = limits[0];
        if(q instanceof Array) {
            for(var i = 0; i < q.length; i++) {
                if(q[i] > high[i]) {
                    q[i] -= high[i] - low[i];
                }
                else if(q[i] < low[i]) {
                    q[i] += high[i] - low[i];
                }
            }
        }
        else {
            if(q > high) {
                return (q - high + low);
            }
            else if(q < low) {
                return (q + high - low);
            }
        }
        return q;
    },
};

if(typeof module === 'object') {
    module.exports = VoidCode.Limit;
}
