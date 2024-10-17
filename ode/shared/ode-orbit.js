'use strict';
var VoidCode = VoidCode || {};

if(typeof require === 'function') { /* we are in Node.js */

    VoidCode.Config = require('./conf/config.json');

    VoidCode.Problem = require('./js/problem.js');
    VoidCode.Point = require('./js/point.js');
    VoidCode.Psi = require('./js/psi.js');
    VoidCode.Limit = require('./js/limit.js');
}

void function (Config, Problem, Point, Psi, Limit) {
    var t0 = Config.time[0], t1 = Config.time[1];
    var pt = Point.create({
        "t": t0,
        "psi": new Psi(Config.psi0)
    }, Config);
    var nMax = Config.step[0], nSkip = Config.step[1];
    var i = 0; /* index of current time instance, i=0..nMax-1 */
    var tau, h;
    var dump = function (pt) {
        var print = print || console.log;
        print(pt.toString(), pt.toValue())
    };
    var limits = null;
    /* scale time if necessary */
    if(Config.scale && Problem[Config.id].hasOwnProperty('period')) {
        tau = Problem[Config.id].period(pt.toValue());
        if(!isNaN(tau - parseFloat(tau))) {
            t0 *= tau;
            t1 *= tau;
        }
    }
    pt.t = t0;
    h = (t1 - t0) / nMax;
    /* try to keep coordinates in prescribed limits */
    if(Problem[Config.id].hasOwnProperty('limits')) {
        limits = function (q) {
            return Limit.normalizeQ(q, Problem[Config.id].limits);
        };
    }
    dump(pt);
    do {
        pt.integrator(h);
        limits && (pt.psi.q = limits(pt.psi.q));
        i++;
        if(i % nSkip === 0) {
            dump(pt);
        }
    } while(i < nMax);
}(
    VoidCode.Config,
    VoidCode.Problem,
    VoidCode.Point,
    VoidCode.Psi,
    VoidCode.Limit
);
