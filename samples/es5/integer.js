/** unsigned integer arithmetic */
'use strict';

var BigInt = function (s) {
    var src = s.toString();
    var start = src.length, stop;
    this.part = [];
    do {
        stop = start, start -= BigInt.size;
        (start < 0) && (start = 0);
        this.part.push(+src.substring(start, stop));
    } while(start > 0);
};
BigInt.LIMIT = 1000000;
BigInt.size = BigInt.LIMIT.toString().length - 1;
BigInt.def = function (x) { return BigInt.sum(x); };
BigInt.parse = function (s) { return new BigInt(s); };

Object.defineProperties(BigInt, {
    ZERO: { get: function () { return new BigInt('0'); }, configurable: false },
    ONE: { get: function () { return new BigInt('1'); }, configurable: false },
    TWO: { get: function () { return new BigInt('2'); }, configurable: false },
});

BigInt.cmp = function (x, y) {
    var n = Math.max(x.part.length, y.part.length);
    for(var i = n - 1; i >= 0; i--) {
        if((x.part[i] || 0) > (y.part[i] || 0)) { return 1; }
        if((x.part[i] || 0) < (y.part[i] || 0)) { return -1; }
    }
    return 0;
};

BigInt.isZero = function (x) { return (x.part.length === 1) && (x.part[0] === 0); };

BigInt.sum = function (x, y) {
    var result = new BigInt('0'), i = 0;
    while(i < arguments.length) { result.add(arguments[i++]); }
    return result;
};

BigInt.scale = function (x, lambda /* < BigInt.LIMIT */) {
    var result = new BigInt('0');
    for(var sum, carry = 0, n = x.part.length, i = 0; i < n; i++) {
        sum = lambda*x.part[i] + carry;
        if(sum >= BigInt.LIMIT) {
            result.part[i] = sum%BigInt.LIMIT;
            carry = (sum - result.part[i])/BigInt.LIMIT;
        } else {
            result.part[i] = sum;
            carry = 0;
        }
    }
    (carry !== 0) && result.part.push(carry);
    return result;
};

BigInt.prod = function (x, y) {
    var result = new BigInt('0'), i = 1;
    result.part = x.part;
    while(i < arguments.length) { result.mult(arguments[i++]); }
    return result;
};

BigInt.pow = function (x, n) {
    var result = new BigInt('1'), element = BigInt.def(x);
    while(n > 0) {
        (n%2) && result.mult(element);
        (n >>= 1) && element.mult(element);
    }
    return result;
};

BigInt.diff = function (x, y) {
    return (BigInt.cmp(x, y) > 0)? BigInt.def(x).sub(y): BigInt.def(y).sub(x);
};

BigInt.mod = function(x, y, quot) {
    var n = y.part.length, k = x.part.length - n;
    var remain = new BigInt('0'), lambda, mult;
    var collect = function (x, m) {
        var result = 0;
        for(var j = x.part.length, i = 0; (i < m) && (j - i > 0); i++) {
            result = result*BigInt.LIMIT + x.part[j - i - 1];
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
        mult = BigInt.scale(y, lambda);
        if(BigInt.cmp(remain, mult) < 0) {
            mult.sub(y); /* correction up */
            lambda--;
        }
        (lambda > 0) && remain.sub(mult);
        (--k >= 0) && remain.part.unshift(x.part[k]);
        quot && Array.isArray(quot.part) && quot.part.unshift(lambda);
    }
    return remain.trim();
};

BigInt.quot = function (x, y) {
    var result = new BigInt('0');
    BigInt.mod(x, y, result);
    return result.trim();
};

BigInt.prototype.add = function (x) {
    var n = x.part.length;
    for(var sum, carry = 0, i = 0; i < n; i++) {
        sum = (this.part[i] || 0) + x.part[i] + carry;
        if(sum >= BigInt.LIMIT) {
            carry = 1;
            this.part[i] = sum - BigInt.LIMIT;
        } else {
            carry = 0;
            this.part[i] = sum;
        }
    }
    (carry !== 0) && (this.part[n] = (this.part[n] || 0) + carry);
    return this;
};

BigInt.prototype.scale = function (lambda /* < BigInt.LIMIT */) {
    for(var sum, carry = 0, n = this.part.length, i = 0; i < n; i++) {
        sum = lambda*this.part[i] + carry;
        if(sum >= BigInt.LIMIT) {
            this.part[i] = sum%BigInt.LIMIT;
            carry = (sum - this.part[i])/BigInt.LIMIT;
        } else {
            this.part[i] = sum;
            carry = 0;
        }
    }
    (carry !== 0) && this.part.push(carry);
    return this;
};

BigInt.prototype.mult = function (x) {
    var n = this.part.length, k = x.part.length;
    var result = new BigInt('0');
    for(var carry, i = 0; i < k; i++) {
        carry = 0;
        for(var j = 0; j < n; j++) {
            result.part[i + j] = (result.part[i + j] || 0) + x.part[i]*this.part[j] + carry;
            carry = (result.part[i + j]/BigInt.LIMIT)|0;
            result.part[i + j] = result.part[i + j]%BigInt.LIMIT;
        }
        (carry) && (result.part[i + n] = (result.part[i + n] || 0) + carry);
    }
    this.part = result.part;
    return this;
};

BigInt.prototype.sub = function (x /* <= this.valueOf() */) {
    for(var i = 0, n = this.part.length; i < n; i++) {
        this.part[i] -= (x.part[i] || 0);
        if(this.part[i] < 0) {
            this.part[i] += BigInt.LIMIT;
            this.part[i + 1]--;
        }
    }
    return this.trim();
};

BigInt.prototype.trim = function () {
    var n = this.part.length;
    if(n > 1 && this.part[n - 1] === 0) {
        this.part.pop();
        this.trim();
    }
    return this;
};

BigInt.prototype.exp = function (n) {
    if(n > 0) {
        for(var i = n; i >= BigInt.size; i -= BigInt.size) { this.part.unshift(0); }
        if(i !== 0) { this.scale(Math.pow(10, i)); }
    } else if (n < 0) {
        if(n + this.length() <= 0) { return new BigInt('0'); }
        for(var i = n; i <= -BigInt.size; i += BigInt.size) { this.part.shift(); }
        if(i !== 0) {
            this.scale(Math.pow(10, BigInt.size + i));
            this.part.shift();
        }
    }
    return this;
};

BigInt.prototype.halve = function () { return this.scale(5).exp(-1); };

BigInt.prototype.length = function () {
    return (this.part.length - 1)*BigInt.size + this.part.slice(-1)[0].toString().length;
};

BigInt.prototype.toString = function () {
    var dst = '' + this.part.slice(-1);
    for(var i = this.part.length - 2; i >= 0; i--) {
        dst = dst + (BigInt.LIMIT.toString() + this.part[i]).slice(-BigInt.size);
    }
    return dst;
};

BigInt.prototype.toSource = function () {
    var dst = ' ' + this.part.slice(-1);
    for(var i = this.part.length - 2; i >= 0; i--) {
        dst = dst + ' ' + (BigInt.LIMIT.toString() + this.part[i]).slice(-BigInt.size);
    }
    return dst;
};

BigInt.prototype.valueOf = function () {
    var s = this.toString();
    return (s.length < 17)?
        parseInt(s):
        parseInt(s.substring(0, 16))*Math.pow(10, s.length - 16);
};

BigInt.gcd = function (x, y) {
    return (BigInt.isZero(y))? x: BigInt.gcd(y, BigInt.mod(x, y));
};

BigInt.fibo = function (n) {
    var memo = { "0": BigInt.ZERO, "1": BigInt.ONE };
    var fb = function (n) {
        return (n in memo)? memo[n]: (memo[n] = BigInt.sum(fb(n - 1), fb(n - 2)));
    };
    return fb(n);
};

BigInt.ffb = function (n) {
    var MatrixFb = function (a, b) {
        this.part = [];
        this.part[0] = BigInt.def(a);
        this.part[1] = BigInt.def(b);
    };
    MatrixFb.prototype.dot = function (matrix) {
        var p00 = BigInt.prod(this.part[0], matrix.part[0]);
        this.part[0] = BigInt.sum(
            p00,
            BigInt.prod(this.part[0], matrix.part[1]),
            BigInt.prod(this.part[1], matrix.part[0])
        );
        this.part[1] = BigInt.sum(p00, BigInt.prod(this.part[1], matrix.part[1]));
    };
    var element = new MatrixFb(BigInt.ONE, BigInt.ZERO),
        result = new MatrixFb(BigInt.ZERO, BigInt.ONE);
    while(n > 0) {
        (n%2) && result.dot(element);
        (n >>= 1) && element.dot(element);
    }
    return result.part[0];
};
