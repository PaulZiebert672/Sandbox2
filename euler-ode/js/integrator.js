'use strict';
var VoidCode = VoidCode || {};

if(typeof require === 'function') {
    VoidCode.Problem = require('./problems');
    VoidCode.EVector = require('./evector.js');
    VoidCode.Psi = require('./psi.js');
}

/**
 * @callback ODE
 * @param {Psi} psi
 * @param {Number} t
 * @returns {Psi}
 * 
 * @callback Invariant
 * @param {Psi} psi
 * @returns {(Number|Number[])}
 *
 * @callback Integrator
 * @param {Number} h - time step
 * @returns {Point}
 *
 * @typedef {(Number|Number[])} EVector
 * 
 * @typedef {Object} Psi
 * @property {EVector} q
 * @property {EVector} p
 * 
 * @typedef {Object} Point
 * @property {Number} t - time
 * @property {Psi} psi - position in phase space
 * @property {ODE} ode - system of ODE
 * @property {Invariant} invariant
 * @property {Integrator} integrator
 */

/**
 * Creates integration method
 * 
 * @param {String} name - integration method name (may be a composition)
 * @throws {ReferenceError} method name or composition is not implemented
 * @returns {Integrator}
 */
VoidCode.Integrator = function (name) {
    var Integrator = VoidCode.Integrator,
        Problem = VoidCode.Problem;
    /* partitioned methods contain array with flag and two matrices */
    var registry = {
        euler10: [                  /* Euler explicit */
            [], [1]
        ],
        euler11: [                  /* Euler implicit */
            [1], [1]
        ],
        rk20: [                     /* explicit midpoint */
            [], [1/2], [0, 1]
        ],
        rk21: [                     /* explicit trapezoidal */
            [], [1], [1/2, 1/2]
        ],
        imp20: [                    /* implicit midpoint */
            [1/2], [1]
        ],
        imp21: [                    /* implicit trapezoidal */
            [], [1/2, 1/2], [1/2, 1/2]
        ],
        rk4: [                      /* classical Runge-Kutta */
            [], [1/2], [0, 1/2], [0, 0, 1],
            [1/6, 1/3, 1/3, 1/6]
        ],
        rk6: [                      /* 6-th order Runge-Kutta */
            [], [1/3], [0, 2/3], [1/12, 1/3, -1/12],
            [25/48, -55/24, 35/48, 15/8],
            [3/20, -11/24, -1/8, 1/2, 1/10],
            [-261/260, 33/13, 43/156, -118/39, 32/195, 80/39],
            [13/200, 0, 11/40, 11/40, 4/25, 4/25, 13/200]
        ],
        gauss4: [                   /* Gauss collocation */
            [1/4, 1/4 - Math.sqrt(3)/6],
            [1/4 + Math.sqrt(3)/6, 1/4],
            [1/2, 1/2]
        ],
        euler1a: ['p',              /* symplectic Euler A */
            [[], [1]],
            [[1], [1]]
        ],
        euler1b: ['p',              /* symplectic Euler B */
            [[1], [1]],
            [[], [1]]
        ],
        verlet2: ['p',              /* Stoermer-Verlet */
            [[], [1/2, 1/2], [1/2, 1/2]],
            [[1/2], [1/2], [1/2, 1/2]]
        ],
        lobatto4: ['p',             /* Lobatto IIIA-IIIB pair */
            [[], [5/24, 1/3, -1/24], [1/6, 2/3, 1/6], [1/6, 2/3, 1/6]],
            [[1/6, -1/6], [1/6, 1/3], [1/6, 5/6], [1/6, 2/3, 1/6]]
        ]
    };
    var composition = {
        _add: /^\[(.+)\+(.+)\]$/,
        _sub: /^\[(.+)\-(.+)\]$/,
        _3jump: /^3j\[(.+),([0-9])\]$/,
        _suzuki: /^su\[(.+),([0-9])\]$/,
    };

    /**
     * Determine if method is implicit by inspecting matrix properties
     * Works only for partitioned methods
     * 
     * @param {Object[])} matrixA - matrix of specific method
     * @returns {Boolean}
     */
    var isImplicitPart2 = function (matrixA) {
        var s = matrixA[1].length;
        var diag = [];
        /* scatter stones */
        for(var i = 0; i < s - 1; i++) {
            for(var j = i; j < s - 1; j++) {
                if(i === j && matrixA[1][i][j]) {
                    diag[i] = 1;
                }
                else if(matrixA[1][i][j]) {
                    return true;
                }
            }
        }
        /* collect stones */
        for(var i = 0; i < s - 1; i++) {
            for(var j = i; j < s - 1; j++) {
                if(i === j && matrixA[2][i][j]) {
                    if(diag[i]) {
                        return true;
                    }
                }
                else if(matrixA[2][i][j]) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Determine if method is implicit by inspecting matrix properties
     * Relays on similar function for partitioned methods
     * 
     * @param {(Object|Object[])} matrixA - matrix of specific method
     * @returns {Boolean}
     */
    var isImplicit = function (matrixA) {
        var s = matrixA.length;
        if(matrixA[0] === 'p') {
            // console.log('+-> %s', Problem.isProblemSeparable);
            if(Problem.isProblemSeparable) {
                return isImplicitPart2(matrixA);
            }
            return true;
        }
        /* fallback */
        for(var i = 0; i < s - 1; i++) {
            for(var j = i; j < s - 1; j++) {
                if(matrixA[i][j]) {
                    return true;
                }
            }
        }
        return false;
    };

    /* select method from registry */
    if(name in registry) {
        var matrixA = registry[name];
        matrixA.imp = isImplicit(matrixA);
        if(matrixA[0] === 'p') {
            return function (h) {
                Integrator.partitionedRK.call(this, matrixA, h);
            }
        }
        /* fallback */
        return function (h) {
            return Integrator.genericRK.call(this, matrixA, h);
        }
    }

    /* composition of methods */
    for(var operator in composition) {
        var result = composition[operator].exec(name);
        if(result) {
            var params = [];
            params[0] = Integrator(result[1]);
            if(!isNaN(+result[2] - parseInt(result[2]))) {
                params[1] = +result[2];
            }
            else {
                params[1] = Integrator(result[2]);
            }
            return function (h) {
                return Integrator[operator].call(this, params, h);
            };
        }
    }

    /* fallback */
    throw new ReferenceError([
        'integrator',
        JSON.stringify(name),
        'is not implemented',
    ].join(' '));
};

VoidCode.Integrator.EPSILON = 1e-15;
VoidCode.Integrator.MAXNUM = 1000;

/**
 * Generic Runge-Kutta integration method.
 * Calculates evolution of dynamical system in time for a given time step.
 * 
 * @param {Object} matrixA - matrix of specific method
 * @param {Number} h - time step
 * @returns {Point}
 */
VoidCode.Integrator.genericRK = function (matrixA, h) {
    var Psi = VoidCode.Psi,
        Integrator = VoidCode.Integrator;
    var s = matrixA.length;
    var vectorK = [], ptArray = [];
    var num = Integrator.MAXNUM;
    var getK = function (point) {
        var vectorK = [];

        /* shallow water */
        for(var i = 0; i < s - 1; i++) {
            vectorK[i] = ptArray.slice(-1)[0][i];
        }
        for(var i = 0; i < s - 1; i++) {
            var psi = new Psi(point.psi);
            var t = point.t;
            for(var j = 0; j < s - 1; j++) {
                if(matrixA[i][j]) {
                    psi.addTo(vectorK[j].scale(h * matrixA[i][j]));
                    t += h * matrixA[i][j];
                }
            }
            vectorK[i] = new Psi(point.ode(psi, t));
        }
        return vectorK;
    };
    var getError = function () {
        var n = ptArray.length;
        var err = 0;
        for(var i = 0; i < s - 1; i++) {
            err += Psi.l1norm(Psi.diff(ptArray[n - 1][i], ptArray[n - 2][i]));
        }
        return err;
    };
    var kstart = new Psi(this.ode(this.psi, this.t));

    /* shallow water */
    for(var i = 0; i < s - 1; i++) {
        vectorK[i] = kstart;
    }
    ptArray.push(vectorK);
    num *= (+matrixA.imp);
    do {
        vectorK = getK(this);
        ptArray.push(vectorK);
        // console.log('  ++>', JSON.stringify(ptArray));
        // console.log('  ==>', getError());
    } while(num-- > 0 && getError() > Integrator.EPSILON);
    for(var i = 0; i < s - 1; i++) {
        this.psi.addTo(vectorK[i].scale(h * matrixA[s - 1][i]));
    }
    this.t += h;
    return this;
};

/**
 * Generic partitioned Runge-Kutta method.
 * Calculates evolution of dynamical system in time for a given time step.
 * 
 * Direct translation of genericRK().
 * Implementation does not allow different dimensions
 *   for matrixA[1] and matrixA[2]
 * 
 * @param {Object[]} matrixA - array of matrices for specific method
 * @param {Number} h - time step
 * @returns {Point}
 */
VoidCode.Integrator.partitionedRK = function (matrixA, h) {
    var Psi = VoidCode.Psi,
        Integrator = VoidCode.Integrator,
        EVector = VoidCode.EVector;
    var s = matrixA[1].length;
    var vectorK = ['p', [], []], ptArray = [];
    var num = Integrator.MAXNUM;
    var getK = function (point) {
        var vectorK = ['p', [], []];

        /* shallow water */
        for(var i = 0; i < s - 1; i++) {
            vectorK[1][i] = ptArray.slice(-1)[0][1][i];
            vectorK[2][i] = ptArray.slice(-1)[0][2][i];
        }
        for(var i = 0; i < s - 1; i++) {
            var psi = new Psi(point.psi);
            for(var j = 0; j < s - 1; j++) {
                if(matrixA[1][i][j]) {
                    psi.q = psi._addQ(EVector.scale(vectorK[1][j], h * matrixA[1][i][j]));
                }
            }
            for(var j = 0; j < s - 1; j++) {
                if(matrixA[2][i][j]) {
                    psi.p = psi._addP(EVector.scale(vectorK[2][j], h * matrixA[2][i][j]));
                }
            }
            var xdot = point.ode(psi);
            vectorK[1][i] = xdot.qdot;
            vectorK[2][i] = xdot.pdot;
        }
        return vectorK;
    };
    var getError = function () {
        var n = ptArray.length;
        var diffQ = 0, diffP = 0;
        for(var i = 0; i < s - 1; i++) {
            diffQ += EVector.norm(
                EVector.diff(ptArray[n - 1][1][i], ptArray[n - 2][1][i])
            );
            diffP += EVector.norm(
                EVector.diff(ptArray[n - 1][2][i], ptArray[n - 2][2][i])
            );
        }
        return diffQ + diffP;
    };
    var kstart = new Psi(this.ode(this.psi));

    /* shallow water */
    for(var i = 0; i < s - 1; i++) {
        vectorK[1][i] = kstart.q;
        vectorK[2][i] = kstart.p;
    }
    ptArray.push(vectorK);

    /* for separable hamiltonians */
    if(!matrixA.imp) {
        num = s - 2;
    }
    do {
        vectorK = getK(this);
        ptArray.push(vectorK);
        // console.log('  ++>', JSON.stringify(ptArray));
        // console.log('  ==>', getError());
    } while(num-- > 0 && getError() > Integrator.EPSILON);
    for(var i = 0; i < s - 1; i++) {
        this.psi.q = this.psi._addQ(EVector.scale(vectorK[1][i], h * matrixA[1][s - 1][i]));
        this.psi.p = this.psi._addP(EVector.scale(vectorK[2][i], h * matrixA[2][s - 1][i]));
    }
    this.t += h;
    return this;
};

VoidCode.Integrator._add = function (params, h) {
    params[0].call(this, h/2);
    params[1].call(this, h/2);
    return this;
};

VoidCode.Integrator._sub = function (params, h) {
    params[0].call(this, h);
    params[1].call(this, -h);
    return this;
};

VoidCode.Integrator._3jump = function (params, h) {
    var p = params[1];
    var fwStep = 1 / (2 - Math.pow(2, 1 / (p + 1)));
    var bkStep = - fwStep * Math.pow(2, 1 / (p + 1));
    params[0].call(this, h * fwStep);
    params[0].call(this, h * bkStep);
    params[0].call(this, h * fwStep);
    return this;
};

VoidCode.Integrator._suzuki = function (params, h) {
    var p = params[1];
    var fwStep = 1 / (4 - Math.pow(4, 1 / (p + 1)));
    var bkStep = - fwStep * Math.pow(4, 1 / (p + 1));
    params[0].call(this, h * fwStep);
    params[0].call(this, h * fwStep);
    params[0].call(this, h * bkStep);
    params[0].call(this, h * fwStep);
    params[0].call(this, h * fwStep);
    return this;
};

if(typeof module === 'object') {
    module.exports = VoidCode.Integrator;
}
