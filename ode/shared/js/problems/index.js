'use strict';
var VoidCode = VoidCode || {};
VoidCode.Problem = VoidCode.Problem || {};

if(typeof require === 'function') {
    VoidCode.Problem.MathematicalPendulum = require('./mp.js');
    VoidCode.Problem.LotkaVolterra = require('./lv.js');
    VoidCode.Problem.KeplerProblem = require('./kepler.js');
    VoidCode.Problem.DoublePendulum = require('./dpm.js');
    VoidCode.Problem.VanDerPohlOscillator = require('./vdpo.js');
    VoidCode.Problem.CircularRestricted3_BodyProblem = require('./cr3bp.js');
}

/* short aliases */
VoidCode.Problem.mp = VoidCode.Problem.MathematicalPendulum;
VoidCode.Problem.lv = VoidCode.Problem.LotkaVolterra;
VoidCode.Problem.kepler = VoidCode.Problem.KeplerProblem;
VoidCode.Problem.dpm = VoidCode.Problem.DoublePendulum;
VoidCode.Problem.vdpo = VoidCode.Problem.VanDerPohlOscillator;
VoidCode.Problem.cr3bp = VoidCode.Problem.CircularRestricted3_BodyProblem;

if(typeof module === 'object') {
    module.exports = VoidCode.Problem;
}
