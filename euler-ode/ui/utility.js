'use strict';
var VoidCode = VoidCode || {};

/*
 * Tiny library of utility methods
 */
VoidCode.Util = (function () {
    var counter = 0;
    var extend = function(dst, src) {
        if(typeof src == 'object') {
            for(var key in src) {
                src.hasOwnProperty(key) && (dst[key] = src[key]);
            }
        }
        return dst;
    };
    var each = function(obj, method) {
        for(var key in obj) {
            obj.hasOwnProperty(key) && method(obj[key], key, obj);
        }
        return obj;
    };
    var uniqueId = function (str) {
        return (str || 'id') + (++counter);
    };
    var heredoc = function (fn) {
        return fn.toString().split('\n').slice(1, -1).join('\n');
    };
    var template = function (text) {
        var config = { interpolate: /<%=(.+?)%>/g, evaluate: /<%(.+?)%>/g };
        return new Function("data",
            "var output = " +
                JSON.stringify(text)
                    .replace(config.interpolate, '" + (data.$1) + "')
                    .replace(config.evaluate, '"; $1\noutput += "') +
                ";\nreturn output;"
        );
    };
    return {
        extend: extend,
        each: each,
        uniqueId: uniqueId,
        heredoc: heredoc,
        template: template,
    };
})();
