/** unsigned integer arithmetic */
'use strict';

var UInt = function (s) {
    var src = s.toString();
    var start = src.length, stop;
    this.part = [];
    do {
        stop = start, start -= UInt.size;
        (start < 0) && (start = 0);
        this.part.push(+src.substring(start, stop));
    } while(start > 0);
};
UInt.LIMIT = 1000000;
UInt.size = UInt.LIMIT.toString().length - 1;
UInt.def = function (x) { return UInt.sum(x); };
UInt.parse = function (s) { return new UInt(s); };

Object.defineProperties(UInt, {
    ZERO: { get: function () { return new UInt('0'); }, configurable: false },
    ONE: { get: function () { return new UInt('1'); }, configurable: false },
    TWO: { get: function () { return new UInt('2'); }, configurable: false },
});

UInt.cmp = function (x, y) {
    var n = Math.max(x.part.length, y.part.length);
    for(var i = n - 1; i >= 0; i--) {
        if((x.part[i] || 0) > (y.part[i] || 0)) { return 1; }
        if((x.part[i] || 0) < (y.part[i] || 0)) { return -1; }
    }
    return 0;
};

UInt.isZero = function (x) { return (x.part.length === 1) && (x.part[0] === 0); };

UInt.sum = function (x, y) {
    var result = new UInt('0'), i = 0;
    while(i < arguments.length) { result.add(arguments[i++]); }
    return result;
};

UInt.scale = function (x, lambda /* < UInt.LIMIT */) {
    var result = new UInt('0');
    for(var sum, carry = 0, n = x.part.length, i = 0; i < n; i++) {
        sum = lambda*x.part[i] + carry;
        if(sum >= UInt.LIMIT) {
            result.part[i] = sum%UInt.LIMIT;
            carry = (sum - result.part[i])/UInt.LIMIT;
        } else {
            result.part[i] = sum;
            carry = 0;
        }
    }
    (carry !== 0) && result.part.push(carry);
    return result;
};

UInt.prod = function (x, y) {
    var result = new UInt('0'), i = 1;
    result.part = x.part;
    while(i < arguments.length) { result.mult(arguments[i++]); }
    return result;
};

UInt.pow = function (x, n) {
    var result = new UInt('1'), element = UInt.def(x);
    while(n > 0) {
        (n%2) && result.mult(element);
        (n >>= 1) && element.mult(element);
    }
    return result;
};

UInt.diff = function (x, y) {
    return (UInt.cmp(x, y) > 0)? UInt.def(x).sub(y): UInt.def(y).sub(x);
};

UInt.mod = function(x, y, quot) {
    var n = y.part.length, k = x.part.length - n;
    var remain = new UInt('0'), lambda, mult;
    var collect = function (x, m) {
        var result = 0;
        for(var j = x.part.length, i = 0; (i < m) && (j - i > 0); i++) {
            result = result*UInt.LIMIT + x.part[j - i - 1];
        }
        return result;
    };
    var shortD = collect(y, 2);
    var guess = function (r) {
        var shortR = (n === 1)?
            collect(r, r.part.length):
            collect(r, r.part.length - n + 2);
        return ~~(shortR/shortD);
    };
    remain.part = x.part.slice(-n);
    while(k >= 0) {
        lambda = guess(remain);
        mult = UInt.scale(y, lambda);
        if(UInt.cmp(remain, mult) < 0) {
            mult.sub(y); /* correction up */
            lambda--;
        }
        (lambda > 0) && remain.sub(mult);
        (--k >= 0) && remain.part.unshift(x.part[k]);
        quot && Array.isArray(quot.part) && quot.part.unshift(lambda);
    }
    return remain.trim();
};

UInt.quot = function (x, y) {
    var result = new UInt('0');
    UInt.mod(x, y, result);
    return result.trim();
};

UInt.prototype.add = function (x) {
    var n = x.part.length;
    for(var sum, carry = 0, i = 0; i < n; i++) {
        sum = (this.part[i] || 0) + x.part[i] + carry;
        if(sum >= UInt.LIMIT) {
            carry = 1;
            this.part[i] = sum - UInt.LIMIT;
        } else {
            carry = 0;
            this.part[i] = sum;
        }
    }
    (carry !== 0) && (this.part[n] = (this.part[n] || 0) + carry);
    return this;
};

UInt.prototype.scale = function (lambda /* < UInt.LIMIT */) {
    for(var sum, carry = 0, n = this.part.length, i = 0; i < n; i++) {
        sum = lambda*this.part[i] + carry;
        if(sum >= UInt.LIMIT) {
            this.part[i] = sum%UInt.LIMIT;
            carry = (sum - this.part[i])/UInt.LIMIT;
        } else {
            this.part[i] = sum;
            carry = 0;
        }
    }
    (carry !== 0) && this.part.push(carry);
    return this;
};

UInt.prototype.mult = function (x) {
    var n = this.part.length, k = x.part.length;
    var result = new UInt('0');
    for(var carry, i = 0; i < k; i++) {
        carry = 0;
        for(var j = 0; j < n; j++) {
            result.part[i + j] = (result.part[i + j] || 0) + x.part[i]*this.part[j] + carry;
            carry = (result.part[i + j]/UInt.LIMIT)|0;
            result.part[i + j] = result.part[i + j]%UInt.LIMIT;
        }
        (carry) && (result.part[i + n] = (result.part[i + n] || 0) + carry);
    }
    this.part = result.part;
    return this;
};

UInt.prototype.sub = function (x /* <= this.valueOf() */) {
    for(var i = 0, n = this.part.length; i < n; i++) {
        this.part[i] -= (x.part[i] || 0);
        if(this.part[i] < 0) {
            this.part[i] += UInt.LIMIT;
            this.part[i + 1]--;
        }
    }
    return this.trim();
};

UInt.prototype.trim = function () {
    var n = this.part.length;
    if(n > 1 && this.part[n - 1] === 0) {
        this.part.pop();
        this.trim();
    }
    return this;
};

UInt.prototype.exp = function (n) {
    if(n > 0) {
        for(var i = n; i >= UInt.size; i -= UInt.size) { this.part.unshift(0); }
        if(i !== 0) { this.scale(Math.pow(10, i)); }
    } else if (n < 0) {
        if(n + this.length() <= 0) { return new UInt('0'); }
        for(var i = n; i <= -UInt.size; i += UInt.size) { this.part.shift(); }
        if(i !== 0) {
            this.scale(Math.pow(10, UInt.size + i));
            this.part.shift();
        }
    }
    return this;
};

UInt.prototype.halve = function () { return this.scale(5).exp(-1); };

UInt.prototype.length = function () {
    return (this.part.length - 1)*UInt.size + this.part.slice(-1)[0].toString().length;
};

UInt.prototype.toString = function () {
    var dst = '' + this.part.slice(-1);
    for(var i = this.part.length - 2; i >= 0; i--) {
        dst = dst + (UInt.LIMIT.toString() + this.part[i]).slice(-UInt.size);
    }
    return dst;
};

UInt.prototype.toSource = function () {
    var dst = ' ' + this.part.slice(-1);
    for(var i = this.part.length - 2; i >= 0; i--) {
        dst = dst + ' ' + (UInt.LIMIT.toString() + this.part[i]).slice(-UInt.size);
    }
    return dst;
};

UInt.prototype.valueOf = function () {
    var s = this.toString();
    return (s.length < 17)?
        parseInt(s):
        parseInt(s.substring(0, 16))*Math.pow(10, s.length - 16);
};

UInt.gcd = function (x, y) {
    return (UInt.isZero(y))? x: UInt.gcd(y, UInt.mod(x, y));
};

UInt.fibo = function (n) {
    var memo = { "0": UInt.ZERO, "1": UInt.ONE };
    var fb = function (n) {
        return (n in memo)? memo[n]: (memo[n] = UInt.sum(fb(n - 1), fb(n - 2)));
    };
    return fb(n);
};

UInt.ffb = function (n) {
    var MatrixFb = function (a, b) {
        this.part = [];
        this.part[0] = UInt.def(a);
        this.part[1] = UInt.def(b);
    };
    MatrixFb.prototype.dot = function (matrix) {
        var p00 = UInt.prod(this.part[0], matrix.part[0]);
        this.part[0] = UInt.sum(
            p00,
            UInt.prod(this.part[0], matrix.part[1]),
            UInt.prod(this.part[1], matrix.part[0])
        );
        this.part[1] = UInt.sum(p00, UInt.prod(this.part[1], matrix.part[1]));
    };
    var element = new MatrixFb(UInt.ONE, UInt.ZERO),
        result = new MatrixFb(UInt.ZERO, UInt.ONE);
    while(n > 0) {
        (n%2) && result.dot(element);
        (n >>= 1) && element.dot(element);
    }
    return result.part[0];
};
