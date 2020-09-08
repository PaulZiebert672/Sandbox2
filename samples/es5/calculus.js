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
    var bigA = UInt.def(x);
    var x0 = function (n) {
        var k = n >> 1;
        var m = (2*p - x.length()) >> 2;
        if(k > UInt.size) {
            return Calc.root(x.exp(2*(k - n + m)), k).exp(n - k - m);
        }
        return UInt.ONE.exp(n);
    }(p);
    var x1;
    do {
        x1 = UInt.def(x0);
        x0.add(UInt.quot(bigA, x0)).halve();
    } while(UInt.cmp(UInt.diff(x0, x1), UInt.ONE.exp(p >> 1)) > 0);
    return x0;
};

Calc.inv = function (x, p) { return UInt.quot(UInt.ONE.exp(2*p), x); };

Calc.inv.exp = function exp(callback, x, p) {
    var bigA = UInt.def(x);
    var x0 = function (n) {
        var k = n >> 1;
        if(k > UInt.size) {
            return exp(callback, x.exp(k - n), k).exp(n - k);
        }
        return UInt.ONE.exp(n);
    }(p);
    var x1;
    do {
        x1 = UInt.def(x0);
        x0.mult(UInt.sum(UInt.ONE.exp(p), bigA).sub(callback(x0, p))).exp(-p);
    } while(UInt.cmp(UInt.diff(x0, x1), UInt.ONE.exp((p >> 1) + 2)) > 0);
    return x0;
};

Calc.inv.tan = function tan(callback, x, p) {
    var bigA = UInt.def(x);
    var x0 = function (n) {
        var k = n >> 1;
        if(k > UInt.size) {
            return tan(callback, UInt.def(x).exp(k - n), k).exp(n - k);
        }
        return UInt.def(x);
    }(p);
    var x1, bigV, bigProd;
    do {
        x1 = UInt.def(x0);
        bigV = callback(x0, p);
        bigProd = UInt.prod(
            UInt.sum(UInt.ONE.exp(p), UInt.prod(x0, x0).exp(-p)),
            UInt.diff(bigA, bigV)
        ).exp(-p);
        (UInt.cmp(bigA, bigV) < 0)? x0.sub(bigProd): x0.add(bigProd);
    } while(UInt.cmp(UInt.diff(x0, x1), UInt.ONE.exp(p >> 1)) > 0);
    return x0;
};

Calc.Archimede = Calc.Archimede || {};

Calc.Archimede.iter = function (a0, g0, p) {
    var a = UInt.def(a0), g = UInt.def(g0), d = [[UInt.def(a0)]], n = 0;
    do {
        a = UInt.sum(a, g).halve();
        g = Calc.root(UInt.prod(a, g), p);
        d.unshift([UInt.def(a)]);
        n++; /* accelerate convergence */
        for(var fact = UInt.parse('1'), k = 1; k <= n; k++) {
            fact.scale(4);
            d[0][k] = UInt.quot(
                UInt.prod(d[0][k - 1], fact).sub(d[1][k - 1]),
                UInt.diff(fact, UInt.ONE)
            );
        }
    } while(UInt.cmp(UInt.diff(d[1][n - 1], d[0][n]), UInt.ONE.exp(2)) > 0);
    return d[0][n];
};

Calc.Archimede.PI = function (p) {
    var big3 = UInt.parse('3').exp(p);
    return Calc.inv(Calc.Archimede.iter(
        Calc.inv(Calc.root(UInt.def(big3).exp(p), p).scale(2), p),
        Calc.inv(big3, p),
        p
    ), p);
};

Calc.Archimede.log = function (x, p) {
    return UInt.quot(
        UInt.diff(x, UInt.ONE.exp(p)).exp(p),
        Calc.Archimede.iter(
            UInt.sum(x, UInt.ONE.exp(p)).halve(),
            Calc.root(UInt.def(x).exp(p), p),
            p
        )
    );
};

Calc.Archimede.atan = function (x, p) {
    return UInt.quot(
        UInt.def(x).exp(p),
        Calc.Archimede.iter(
            UInt.ONE.exp(p),
            Calc.root(UInt.sum(UInt.ONE.exp(2*p), UInt.prod(x, x)), p),
            p
        )
    );
};

Calc.Archimede.exp = function (x, p) { return Calc.inv.exp(Calc.Archimede.log, x, p); };
Calc.Archimede.tan = function (x, p) { return Calc.inv.tan(Calc.Archimede.atan, x, p); };

Calc.AGM = function (a0, g0, p) {
    var a = [a0], g = [g0];
    do {
        a.unshift(UInt.sum(a[0], g[0]).halve());
        g.unshift(Calc.root(UInt.prod(a[1], g[0]), p));
    } while(UInt.cmp(UInt.diff(a[0], a[1]), UInt.ONE.exp(p >> 2)) >= 0);
    return a[0];
};

Calc.AGM.PI = function (p) {
    var a = [Calc.root(UInt.TWO.exp(2*p), p)], g = [UInt.ONE.exp(p)];
    var s = UInt.ONE.exp(2*p), fact = UInt.parse('1');
    do {
        a.unshift(UInt.sum(a[0], g[0]).halve());
        g.unshift(Calc.root(UInt.prod(a[1], g[0]), p));
        s.sub(UInt.diff(a[0], g[0]).mult(UInt.sum(a[0], g[0])).mult(fact.scale(2)));
    } while (UInt.cmp(UInt.diff(a[0], a[1]), UInt.ONE.exp(p >> 1)) > 0);
    return UInt.quot(UInt.prod(a[0], a[0]), s.exp(-p)).scale(2);
};

Calc.AGM.LN2 = function (p) {
    var q = 3*p >> 1, n = (p/(2*Math.LN2*Math.LOG10E) + 1) | 0;
    return UInt.quot(
        Calc.AGM.PI(p).exp(q),
        Calc.AGM(
            UInt.ONE.exp(q),
            UInt.quot(UInt.parse('4').exp(q), UInt.pow(UInt.TWO, n)),
            q
        ).scale(2*n)
    );
};
