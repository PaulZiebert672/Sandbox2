load([
    '/euler-ode/js/problems/mp.js',
    '/euler-ode/js/problems/index.js',
    '/euler-ode/js/evector.js',
    '/euler-ode/js/psi.js',
    '/euler-ode/js/point.js',
    '/euler-ode/js/limit.js',
    '/euler-ode/js/integrator.js',
    '/euler-ode/ui/utility.js',
    '/euler-ode/ui/orbit-timeout.js'
], function () {

var Orbit = VoidCode.Orbit;
var orb = new Orbit({
    id: "mp",
    integrator: "rk4",
    psi0: [ 0, 1 ],
    time: [ 0, 1 ],
    scale: true,
    step: [ 36, 1 ]
});
orb.evolve();

print(JSON.stringify(orb));

}); /* load */
