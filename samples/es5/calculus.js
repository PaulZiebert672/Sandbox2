/** elementary functions with fixed precision */
'use strict';

var Calc = Calc || {};

Calc.std = Calc.std || {};

Calc.std.iter = function (a0, g0) {
    var a = [a0], g = [g0], d = [[a0]], n = 0, eps = 5e-14;
    do {
        a.unshift((a[0] + g[0])/2);
        g.unshift(Math.sqrt(a[0]*g[0]));
        d.unshift([a[0]]);
        n++; /* accelerate convergence */
        for(var k = 1, s = 1; k <= n; k++) {
            s *= 4;
            d[0][k] = (d[0][k - 1] - d[1][k - 1]/s)/(1 - 1/s);
        }
    } while(Math.abs(d[1][n - 1] - d[0][n]) > eps);
    return d[0][n];
};

Calc.std.log = function (x) { return (x - 1)/Calc.iter((x + 1)/2, Math.sqrt(x)); };
Calc.std.atan = function (x) { return x/Calc.iter(1, Math.sqrt(1 + x*x)); };

Calc.root = function root(x, p) {
    var bigA = BigInt.def(x);
    var x0 = function (n) {
        var k = n >> 1;
        var m = (2*p - x.length()) >> 2;
        if(k > BigInt.size) {
            return Calc.root(x.exp(2*(k - n + m)), k).exp(n - k - m);
        }
        return BigInt.ONE.exp(n);
    }(p);
    var x1;
    do {
        x1 = BigInt.def(x0);
        x0.add(BigInt.quot(bigA, x0)).halve();
    } while(BigInt.cmp(BigInt.diff(x0, x1), BigInt.ONE.exp(p >> 1)) > 0);
    return x0;
};

Calc.inv = function (x, p) { return BigInt.quot(BigInt.ONE.exp(2*p), x); };

Calc.inv.exp = function exp(callback, x, p) {
    var bigA = BigInt.def(x);
    var x0 = function (n) {
        var k = n >> 1;
        if(k > BigInt.size) {
            return exp(callback, x.exp(k - n), k).exp(n - k);
        }
        return BigInt.ONE.exp(n);
    }(p);
    var x1;
    do {
        x1 = BigInt.def(x0);
        x0.mult(BigInt.sum(BigInt.ONE.exp(p), bigA).sub(callback(x0, p))).exp(-p);
    } while(BigInt.cmp(BigInt.diff(x0, x1), BigInt.ONE.exp((p >> 1) + 2)) > 0);
    return x0;
};

Calc.inv.tan = function tan(callback, x, p) {
    var bigA = BigInt.def(x);
    var x0 = function (n) {
        var k = n >> 1;
        if(k > BigInt.size) {
            return tan(callback, BigInt.def(x).exp(k - n), k).exp(n - k);
        }
        return BigInt.def(x);
    }(p);
    var x1, bigV, bigProd;
    do {
        x1 = BigInt.def(x0);
        bigV = callback(x0, p);
        bigProd = BigInt.prod(
            BigInt.sum(BigInt.ONE.exp(p), BigInt.prod(x0, x0).exp(-p)),
            BigInt.diff(bigA, bigV)
        ).exp(-p);
        (BigInt.cmp(bigA, bigV) < 0)? x0.sub(bigProd): x0.add(bigProd);
    } while(BigInt.cmp(BigInt.diff(x0, x1), BigInt.ONE.exp(p >> 1)) > 0);
    return x0;
};

Calc.Archimede = Calc.Archimede || {};

Calc.Archimede.iter = function (a0, g0, p) {
    var a = BigInt.def(a0), g = BigInt.def(g0), d = [[BigInt.def(a0)]], n = 0;
    do {
        a = BigInt.sum(a, g).halve();
        g = Calc.root(BigInt.prod(a, g), p);
        d.unshift([BigInt.def(a)]);
        n++; /* accelerate convergence */
        for(var fact = BigInt.parse('1'), k = 1; k <= n; k++) {
            fact.scale(4);
            d[0][k] = BigInt.quot(
                BigInt.prod(d[0][k - 1], fact).sub(d[1][k - 1]),
                BigInt.diff(fact, BigInt.ONE)
            );
        }
    } while(BigInt.cmp(BigInt.diff(d[1][n - 1], d[0][n]), BigInt.ONE.exp(2)) > 0);
    return d[0][n];
};

Calc.Archimede.PI = function (p) {
    var big3 = BigInt.parse('3').exp(p);
    return Calc.inv(Calc.Archimede.iter(
        Calc.inv(Calc.root(BigInt.def(big3).exp(p), p).scale(2), p),
        Calc.inv(big3, p),
        p
    ), p);
};

Calc.Archimede.log = function (x, p) {
    return BigInt.quot(
        BigInt.diff(x, BigInt.ONE.exp(p)).exp(p),
        Calc.Archimede.iter(
            BigInt.sum(x, BigInt.ONE.exp(p)).halve(),
            Calc.root(BigInt.def(x).exp(p), p),
            p
        )
    );
};

Calc.Archimede.atan = function (x, p) {
    return BigInt.quot(
        BigInt.def(x).exp(p),
        Calc.Archimede.iter(
            BigInt.ONE.exp(p),
            Calc.root(BigInt.sum(BigInt.ONE.exp(2*p), BigInt.prod(x, x)), p),
            p
        )
    );
};

Calc.Archimede.exp = function (x, p) { return Calc.inv.exp(Calc.Archimede.log, x, p); };
Calc.Archimede.tan = function (x, p) { return Calc.inv.tan(Calc.Archimede.atan, x, p); };

Calc.AGM = function (a0, g0, p) {
    var a = [a0], g = [g0];
    do {
        a.unshift(BigInt.sum(a[0], g[0]).halve());
        g.unshift(Calc.root(BigInt.prod(a[1], g[0]), p));
    } while(BigInt.cmp(BigInt.diff(a[0], a[1]), BigInt.ONE.exp(p >> 2)) >= 0);
    return a[0];
};

Calc.AGM.PI = function (p) {
    var a = [Calc.root(BigInt.TWO.exp(2*p), p)], g = [BigInt.ONE.exp(p)];
    var s = BigInt.ONE.exp(2*p), fact = BigInt.parse('1');
    do {
        a.unshift(BigInt.sum(a[0], g[0]).halve());
        g.unshift(Calc.root(BigInt.prod(a[1], g[0]), p));
        s.sub(BigInt.diff(a[0], g[0]).mult(BigInt.sum(a[0], g[0])).mult(fact.scale(2)));
    } while (BigInt.cmp(BigInt.diff(a[0], a[1]), BigInt.ONE.exp(p >> 1)) > 0);
    return BigInt.quot(BigInt.prod(a[0], a[0]), s.exp(-p)).scale(2);
};

Calc.AGM.LN2 = function (p) {
    var q = 3*p >> 1, n = (p/(2*Math.LN2*Math.LOG10E) + 1) | 0;
    return BigInt.quot(
        Calc.AGM.PI(p).exp(q),
        Calc.AGM(
            BigInt.ONE.exp(q),
            BigInt.quot(BigInt.parse('4').exp(q), BigInt.pow(BigInt.TWO, n)),
            q
        ).scale(2*n)
    );
};
