'use strict';
var VoidCode = VoidCode || {};
VoidCode.Problem = VoidCode.Problem || {};

if(typeof require === 'function') {
    VoidCode.Problem.MathematicalPendulum = require('./problem-mp.js');
    VoidCode.Problem.LotkaVolterra = require('./problem-lv.js');
    VoidCode.Problem.KeplerProblem = require('./problem-kepler.js');
    VoidCode.Problem.DoublePendulum = require('./problem-dpm.js');
    VoidCode.Problem.VanDerPohlOscillator = require('./problem-vdpo.js');
}

/* short aliases */
VoidCode.Problem.mp = VoidCode.Problem.MathematicalPendulum;
VoidCode.Problem.lv = VoidCode.Problem.LotkaVolterra;
VoidCode.Problem.kepler = VoidCode.Problem.KeplerProblem;
VoidCode.Problem.dpm = VoidCode.Problem.DoublePendulum;
VoidCode.Problem.vdpo = VoidCode.Problem.VanDerPohlOscillator;

if(typeof module === 'object') {
    module.exports = VoidCode.Problem;
}
