'use strict';
var VoidCode = VoidCode || {};

if(typeof require === 'function') {
    VoidCode.Config = require('./config.js');
    VoidCode.Problem = require('./problem.js');
    VoidCode.EVector = require('./evector.js');
    VoidCode.Psi = require('./psi.js');
}

VoidCode.Integrator = function (name) {
    var Integrator = VoidCode.Integrator,
        Problem = VoidCode.Problem,
        Config = VoidCode.Config;
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
        gauss4: [                   /* Gauss collocation */
            [1/4, 1/4 - Math.sqrt(3)/6],
            [1/4 + Math.sqrt(3)/6, 1/4],
            [1/2, 1/2]
        ],
        euler1a: ['p',              /* symplectic Euler */
            [[], [1]],
            [[1], [1]]
        ],
        euler1b: ['p',              /* symplectic Euler */
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
    var isImplicit = function (matrixA) {
        var s = matrixA.length;
        if(matrixA[0] === 'p') {
            if(Problem[Config.id].separable) {
                return isImplicitPart2(matrixA);
            }
            return true;
        }
        for(var i = 0; i < s - 1; i++) {    /* fallback */
            for(var j = i; j < s - 1; j++) {
                if(matrixA[i][j]) {
                    return true;
                }
            }
        }
        return false;
    };

    if(name in registry) {
        var matrixA = registry[name];
        matrixA.imp = isImplicit(matrixA);
        if(matrixA[0] === 'p') {
            return function (h) {
                Integrator.partitionedRK.call(this, matrixA, h);
            }
        }
        return function (h) { /* fallback */
            return Integrator.genericRK.call(this, matrixA, h);
        }
    }

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
            vectorK[i] = new Psi(point.hamilton(psi, t));
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
    var kstart = new Psi(this.hamilton(this.psi, this.t));

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

/*
 * direct translation of genericRK()
 *   implementation does not allow different dimensions
 *   for matrixA[1] and matrixA[2]
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
            var xdot = point.hamilton(psi);
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
    var kstart = new Psi(this.hamilton(this.psi));

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
