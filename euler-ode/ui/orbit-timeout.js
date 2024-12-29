'use strict';
var VoidCode = VoidCode || {};

VoidCode.Orbit = function (config) {
    var _util = VoidCode.Util;
    this.id = _util.uniqueId('orbit');
    this.config = config;
    this.collection = [];
    this.instant = new Date().getTime();
};

VoidCode.Orbit.prototype.LIMIT = 600;
VoidCode.Orbit.prototype.TIMEOUT = 180;

VoidCode.Orbit.prototype.dump = function (pt) {
    this.collection.push({
        time: pt.t,
        coordinate: pt.psi.q,
        momentum: pt.psi.p,
        invariant: pt.toValue()
    });
    var current = new Date().getTime();
    if(this.collection.length >= this.LIMIT || current >= this.instant + this.TIMEOUT) {
        // postMessage(this.collection);
        this.collection = [];
        this.instant = current;
    }
};

VoidCode.Orbit.prototype.flush = function () {
    // postMessage(this.collection);
    this.collection = [];
};

VoidCode.Util.extend(
    VoidCode.Orbit.prototype,
    VoidCode.Event
);

VoidCode.Orbit.prototype.evolve = function () {
    var Config = this.config;
    var Problem = VoidCode.Problem,
        Point = VoidCode.Point,
        Psi = VoidCode.Psi,
        Limit = VoidCode.Limit;
    var t0 = Config.time[0], t1 = Config.time[1];
    var pt = Point.create({
        "t": t0,
        "psi": new Psi(Config.psi0)
    }, Config);
    var nMax = Config.step[0], nSkip = Config.step[1];
    var tau, h;
    var collection = [], dump = function (pt) {
        console.log(pt);
        collection.push({
            time: pt.t,
            coordinate: pt.psi.q,
            momentum: pt.psi.p,
            invariant: pt.toValue()
        });
    };
    /* scale time if necessary */
    if(Config.scale && Problem[Config.id].hasOwnProperty('period')) {
        tau = Problem[Config.id].period.call(pt, pt.toValue());
        if(!isNaN(tau - parseFloat(tau))) {
            t0 *= tau;
            t1 *= tau;
        }
    }
    pt.t = t0;
    h = (t1 - t0)/nMax;
    /* try to hold coordinates in prescribed limits */
    var limits = null;
    if(Problem[Config.id].hasOwnProperty('limits')) {
        limits = function (q) {
            return Limit.normalizeQ(q, Problem[Config.id].limits);
        };
    }

    var i = 0; /* index of current time instance, i=0..nMax-1 */
    var chunk = function () {
        var k = 0; /* chunk counter */
        do {
            pt.integrator(h);
            limits && (pt.psi.q = limits(pt.psi.q));
            i++; /* index of current time instance, i=0..nMax-1 */
            k++; /* chunk counter */
            if(i % nSkip === 0) {
                dump(pt);
            }
        } while(i < nMax && k < 12); /* magic number */
        if(collection.length >= 12) {  /* magic number */
            this.trigger('task/partial', collection);
            collection = [];
        }
        if(i < nMax) {
            console.log('  ::>', 'internal call');
            setTimeout(chunk.bind(this), 0);
        } else {
            if(collection.length > 0) {
                this.trigger('task/partial', collection);
            }
            this.trigger('task/complete');
        }
    };
    dump(pt);
    this.trigger('task/start', collection);
    collection = [];
    setTimeout(chunk.bind(this), 0);
};
