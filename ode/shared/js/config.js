'use strict';
var VoidCode = VoidCode || {};
var _00; /* default config values for CLI */

if(typeof process === 'object') {
    if(process.argv.length > 2) {
        try {
            _00 = (new Function("", "return {" + process.argv[2] + "};"))();
        } catch(ex) {
            console.log("Invalid config argument");
            console.log("Valid arguments are:");
            console.log("\t%s: %s: %s", "t", "Number", "stop time, (start time is set to 0)");
            console.log("\t%s: %s: %s", "scale", "Boolean", "scale time with the problem's period");
            console.log("\t%s: %s: %s", "N", "Number", "number of points per unit of time");
            console.log("\t%s: %s: %s", "S", "Number", "number of skips");
            console.log("\t%s: %s: %s", "m", "String", "integration method");
            console.log("\t%s: %s: %s", "id", "String", "problem id");
            console.log("\t%s: %s: %s", "q", "Number|Array", "coordinate at t = 0");
            console.log("\t%s: %s: %s", "p", "Number|Array", "momentum at t = 0");
            console.log("Examples:");
            console.log("\t%s", "N: 12");
            console.log("\t%s", "q: [1, 0], p: [0, 1], m: 'rk4', id: 'kepler'");
            console.log("\t%s", "t: 3, N: 36, S: 36, m: 'verlet2', id: 'kepler'");
            process.exit(1);
        }
    };
}

_00  = _00 || {};

_00.t = _00.t || 1;
_00.scale = _00.scale || true;
_00.N = _00.N || 36;
_00.S = _00.S || 1;
_00.m = _00.m || 'gauss4';
_00.id = _00.id || 'mp';

/* initial coordinates for various problems */
_00.init = _00.init || {
    mp: {q0: 0, p0: 1},
    lv: {q0: 1, p0: 0},
    kepler: {q0: [1, 0], p0: [0, 1]},
    dpm: {q0: [0, 1], p0: [0, 0]},
};

if(_00.q === undefined || _00.p === undefined) {
    _00.q = _00.init[_00.id].q0;
    _00.p = _00.init[_00.id].p0;
}

VoidCode.Config = {
    psi0: [_00.q, _00.p],
    time: [0, _00.t],
    scale: _00.scale,
    step: [_00.N*_00.t, _00.S],
    integrator: _00.m,
    id: _00.id
};

if(typeof module === 'object') {
    module.exports = VoidCode.Config;
}
