// @flow
/* jshint maxparams: 4, -W003 */

'use strict';

var s = require('./support');

var _ = require('ramda'),
    Task = require('data.task'),
    curry = _.curry;

var inspect = function(x /* : mixed */) /* : string */ {
    return (x && x.inspect) ? x.inspect() : (typeof x) + '(' + String(x) + ')';
};

var inspector = function (n, x) {
    return n + '(' + inspect(x) + ')';
};

var toUpperCase = function(x /* : string */) /* : string */ {
    return x.toUpperCase();
};

// Identity
var Identity = function(x /* : mixed */) {
    this.__value = x;
};

Identity.of = function(x) { return new Identity(x); };

Identity.prototype.map = function(f) {
    return Identity.of(f(this.__value));
};

Identity.prototype.inspect = function() {
    return inspector('Identity', this.__value);
};

// Maybe
var Maybe = function(x /* : ?mixed */) {
    this.__value = x;
};

Maybe.of = function(x) {
    return new Maybe(x);
};

Maybe.prototype.isNothing = function(f) {
    void f;
    return (this.__value === null || this.__value === undefined);
};

Maybe.prototype.map = function(f) {
    return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
};

Maybe.prototype.chain = function(f) {
    return this.map(f).join();
};

Maybe.prototype.ap = function(other) {
    return this.isNothing() ? Maybe.of(null) : other.map(this.__value);
};

Maybe.prototype.join = function() {
    return this.isNothing() ? Maybe.of(null) : this.__value;
};

Maybe.prototype.inspect = function() {
    return inspector('Maybe', this.__value);
};


// Either
var Either = function() {};
Either.of = function(x) {
    return new Right(x);
};

var Left = function(x /* : mixed */) {
    this.__value = x;
};

// TODO: remove this nonsense
Left.of = function(x) {
    return new Left(x);
};

Left.prototype.map = function(f) { void f; return this; };
Left.prototype.ap = function(other) { void other; return this; };
Left.prototype.join = function() { return this; };
Left.prototype.chain = function() { return this; };
Left.prototype.inspect = function() {
    return inspector('Left', this.__value);
};


var Right = function(x /* : mixed */) {
    this.__value = x;
};

// TODO: remove in favor of Either.of
Right.of = function(x) {
    return new Right(x);
};

Right.prototype.map = function(f) {
    return Right.of(f(this.__value));
};

Right.prototype.join = function() {
    return this.__value;
};

Right.prototype.chain = function(f) {
    return f(this.__value);
};

Right.prototype.ap = function(other) {
    return this.chain(function(f) {
        return other.map(f);
    });
};

Right.prototype.inspect = function() {
    return inspector('Right', this.__value);
};

// IO
var IO = function(f) {
    this.unsafePerformIO = f;
};

IO.of = function(x) {
    return new IO(function() {
        return x;
    });
};

IO.prototype.map = function(f) {
    return new IO(_.compose(f, this.unsafePerformIO));
};

IO.prototype.join = function() {
    return this.unsafePerformIO();
};

IO.prototype.chain = function(f) {
    return this.map(f).join();
};

IO.prototype.ap = function(a) {
    return this.chain(function(f) {
        return a.map(f);
    });
};

IO.prototype.inspect = function() {
    return inspector('IO', this.unsafePerformIO);
};

var unsafePerformIO = function(x /* : IO */) /* : mixed */ { return x.unsafePerformIO(); };

var either = curry(function(f, g, e) {
    switch(e.constructor) {
        case Left: return f(e.__value);
        case Right: return g(e.__value);
    }
});

// overwriting join from pt 1
var join = function(m /* : { join: () => mixed } */) /* : mixed */ { return m.join(); };

var chain = curry(function(f, m){
    return m.map(f).join(); // or compose(join, map(f))(m)
});

var liftA2 = curry(function(f, a1, a2){
    return a1.map(f).ap(a2);
});

var liftA3 = curry(function(f, a1, a2, a3){
    return a1.map(f).ap(a2).ap(a3);
});

void liftA2;
void liftA3;

Task.prototype.join = function(){ return this.chain(_.identity); };

var breakPt = _.curry(function (tag, x)  {
    s.trace(tag, inspect(x));
    /* jshint -W087 */ // MUSTDO forgotten debugger statement?
    debugger;
    /* jshint +W087 */
    return x;
});

var trace = _.curry(function (tag, x)  {
    s.trace(tag, inspect(x));
    return x;
});

var traceFn = _.curry(function (tag, f) {
    return _.compose(trace(tag), f);
});

var notrace = _.curry(function (tag, x)  {
    void tag;
    return x;
});

module.exports = {
    breakPt: breakPt,
    nobreakPt: notrace,
    trace: trace,
    notrace: notrace,
    traceFn: traceFn,
    notraceFn: notrace,
    inspect: inspect,
    Identity: Identity,
    Maybe: Maybe,
    Either: Either,
    Left: Left,
    Right: Right,
    IO: IO,

    either: either,
    chain: chain,
    join: join,
    liftA2: liftA2,
    unsafePerformIO: unsafePerformIO,
    toUpperCase: toUpperCase
};
