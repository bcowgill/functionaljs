/* jshint maxparams: 4, -W003 */

'use strict';

require('./support');

var _ = require('ramda'),
    Task = require('data.task'),
    curry = _.curry;

var inspect = function(x) {
    return (x && x.inspect) ? x.inspect() : x;
};

var toUpperCase = function(x) {
    return x.toUpperCase();
};

// Identity
var Identity = function(x) {
    this.__value = x;
};

Identity.of = function(x) { return new Identity(x); };

Identity.prototype.map = function(f) {
    return Identity.of(f(this.__value));
};

Identity.prototype.inspect = function() {
    return 'Identity('+inspect(this.__value)+')';
};

// Maybe
var Maybe = function(x) {
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
    return 'Maybe('+inspect(this.__value)+')';
};


// Either
var Either = function() {};
Either.of = function(x) {
    return new Right(x);
};

var Left = function(x) {
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
    return 'Left('+inspect(this.__value)+')';
};


var Right = function(x) {
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

Right.prototype.join = function() {
    return this.__value;
};

Right.prototype.chain = function(f) {
    return f(this.__value);
};

Right.prototype.inspect = function() {
    return 'Right('+inspect(this.__value)+')';
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
    return 'IO('+inspect(this.unsafePerformIO)+')';
};

var unsafePerformIO = function(x) { return x.unsafePerformIO(); };

var either = curry(function(f, g, e) {
    switch(e.constructor) {
        case Left: return f(e.__value);
        case Right: return g(e.__value);
    }
});

// overwriting join from pt 1
var join = function(m){ return m.join(); };

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

module.exports = {
    Identity: Identity,
    Maybe: Maybe,
    Either: Either,
    Left: Left,
    Right: Right,

    chain: chain,
    join: join,
    either: either,
    unsafePerformIO: unsafePerformIO,
    toUpperCase: toUpperCase
};