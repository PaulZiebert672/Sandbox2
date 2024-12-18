importScripts(
    '/euler-ode/js/roots.js',
    '/euler-ode/js/quadrature.js',
    '/euler-ode/js/evector.js',
    '/euler-ode/js/psi.js',
    '/euler-ode/js/problems/mp.js',
    '/euler-ode/js/problems/kepler.js',
    '/euler-ode/js/problems/lv.js',
    '/euler-ode/js/problems/dpm.js',
    '/euler-ode/js/problems/jacobi.js',
    '/euler-ode/js/problems/lorenz.js',
    '/euler-ode/js/problems/vdpo.js',
    '/euler-ode/js/problems/pot.js',
    '/euler-ode/js/problems/cr3bp.js',
    '/euler-ode/js/problems/index.js',
    '/euler-ode/js/integrator.js',
    '/euler-ode/js/point.js',
    '/euler-ode/js/limit.js',
);

onmessage = function (e) {
    const config = JSON.parse(e.data);
    var Problem = VoidCode.Problem,
        Point = VoidCode.Point,
        Psi = VoidCode.Psi,
        Limit = VoidCode.Limit;
    var t0 = config.time[0], t1 = config.time[1];
    var pt = Point.create({
        "t": t0,
        "psi": new Psi(config.psi0)
    }, config);
    var nMax = config.step[0], nSkip = config.step[1];
    var i = 0; /* index of current time instance, i=0..nMax-1 */
    var tau, h;
    var collection = [], dump = function (pt) {
        collection.push({
            time: pt.t,
            coordinate: pt.psi.q,
            momentum: pt.psi.p,
            invariant: pt.toValue()
        });
    };
    var limits = null;
    /* scale time if necessary */
    if(config.scale && Problem[config.id].hasOwnProperty('period')) {
        tau = Problem[config.id].period.call(pt, pt.toValue());
        if(!isNaN(tau - parseFloat(tau))) {
            t0 *= tau;
            t1 *= tau;
        }
    }
    pt.t = t0;
    h = (t1 - t0)/nMax;
    /* try to keep coordinates in prescribed limits */
    if(Problem[config.id].hasOwnProperty('limits')) {
        limits = function (q) {
            return Limit.normalizeQ(q, Problem[config.id].limits);
        };
    }
    dump(pt);
    do {
        pt.integrator(h);
        limits && (pt.psi.q = limits(pt.psi.q));
        if(++i%nSkip === 0) {
            dump(pt);
        }
        if(collection.length >= 12) { /* magic number */
            postMessage(collection);
            collection = [];
        }
    } while(i < nMax);
    if(collection.length > 0) {
        postMessage(collection);
    }
};
