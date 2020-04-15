'use strict';
var Quad = Quad || {};

Quad.legendreP = function (n, theta) {
    var memo = { "0": 1, "1": Math.cos(theta) };
    var poly = function (n, theta) {
        if(!(n in memo)) {
            memo[n] = ((2*n - 1)*Math.cos(theta)*poly(n - 1, theta) - (n - 1)*poly(n - 2, theta))/n;
        }
        return memo[n];
    };
    return poly(n, theta);
};

Quad.legendrePstroke = function (n, theta) {
    var legendreP = Quad.legendreP;
    return n*(Math.cos(theta)*legendreP(n, theta) - legendreP(n - 1, theta))/Math.sin(theta);
};

Quad.legendreRoots = function (n) {
    var newtonSolve = Iter.newtonSolve,
        legendreP = Quad.legendreP,
        legendrePstroke = Quad.legendrePstroke;
    var self = Quad.legendreRoots;
    if(!(n in self.memo)) {
        self.memo[n] = [];
        for(var i = 0; i < n; i++) {
            self.memo[n].push(newtonSolve(
                Math.PI*(i + 3/4)/(n + 1/2),
                function (theta) { return legendreP(n, theta); },
                function (theta) { return legendrePstroke(n, theta); }
            ));
        }
    }
    return self.memo[n];
};
Quad.legendreRoots.memo = {};

Quad.gaussWeights = function (n) {
    var legendreRoots = Quad.legendreRoots,
        legendrePstroke = Quad.legendrePstroke;
    var self = Quad.gaussWeights;
    if(!(n in self.memo)) {
        self.memo[n] = legendreRoots(n).map(function (theta) {
            var dP = legendrePstroke(n, theta);
            return 2/(dP*dP);
        });
    }
    return self.memo[n];
};
Quad.gaussWeights.memo = {};

Quad.gaussQuad = function (n, f, a, b) {
    var gaussWeights = Quad.gaussWeights,
        legendreRoots = Quad.legendreRoots;
    return ((a - b)/2)*gaussWeights(n).reduce(function (sum, w, k) {
        return sum + w*f(Math.cos(legendreRoots(n)[k])*((a - b)/2) + ((a + b)/2));
    }, 0);
};
