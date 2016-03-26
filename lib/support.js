/* jshint -W003 */
/* jshint -W016 */
'use strict';
//var curry = require('ramda').curry;
//
// https://www.gitbook.com/book/drboolean/mostly-adequate-guide/details
// https://www.youtube.com/watch?v=ZhuHCtR3xq8 Brian Beckman Don't Fear the Monad

// compositionality is THE way to control complexity.

// associativity of composition
// var associative = compose(f, compose(g, h)) == compose(compose(f, g), h);
// true

// identity function just returns the same value given
// compose(id, f) == compose(f, id) == f;

// Functor: a type that implements map and obeys some laws:
// identity law:
// map(id) === id;
// map's composition law:
// compose(map(f), map(g)) === map(compose(f, g));

// Monoid:
// a set of things (i.e. numbers on a clock)
// a rule for combining the things (i.e (x + y) % 12) == @ == combine )
// rule has to satisfy associativity (i.e. (x @ y) @ z == x @ (y @ z) )
// rule has to have a unit or zero member (i.e. x @ 12 == x)
// does NOT have to satisfy commutativity though a clock does (i.e. 12 @ x == x)

// Functions over the same types under the rule of composition are Monoids.

// Monad:
// a type constructor which creates a new type from another type (a -> M a)
// a bind operation (join, shove, >>= ) which allows the set of functions
// F : a -> M a to be Monoidal
// >>= : a -> M a
// associativity f @ (g @ h) == (f @ g) @ h for f : a -> M a, g: a -> M a, h: a -> M a
// unit/zero: and f @ a0 == f
// \a -> [ (f a) >>= \a -> (g a) ]
//          M a             M a
// when you define a monad M you have to design the bind operator >>= so the above rules work.
// you also have to design the unit so that it leaves the original alone.
// For g : a -> M b, f : b -> M c
// \a -> [ (g a) >>= \b -> (f b) ]
//  a --------------------> M c
// >>= : M b -> (b -> M c) -> M c

// map when returning a "normal" value and chain when we're returning another functor.

// Pointed Functor: a Functor with an of method to place a value into a default
// minimal context for the Functor

// Monads are Pointed Functors that can flatten.
// a monad implements .map() .of() and .join()
// join must follow the identity and associativity laws:
// associativity
// compose(join, map(join)) === compose(join, join)
// identity for all (M a)
// compose(join, of) === compose(join, map(of)) === id
// Monads form a category called the Kleisli category
// monad compose function:
// mcompose(f, g) returns compose(chain(f), chain(g))
// chain(f) == compose(join, map(f))

// Applicative Functors are Pointed Functors with an ap method.
// provide the ability to apply Functors to each other
// F.of(x).map(f) == F.of(f).ap(F.of(x))
// compose(map(f), F.of)(x) === compose(ap(F.of(x)), F.of(f))
// we can place x into our container and map(f) OR we can lift both f and x into
// our container and ap them. This allows us to write in a left-to-right fashion:
// Maybe.of(add).ap(Maybe.of(2)).ap(Maybe.of(3));
// liftA2(add, Maybe.of(2), Maybe.of(3));
// Maybe(5)
// If we can define a monad, we can define both the applicative and functor interfaces.
// Favour Applicatives over Monads:
// A good use case for applicatives is when one has multiple functor arguments.

function inspect (inspectee) {
    return (typeof inspectee === 'function') ? inspectFn(inspectee) : inspectArgs(inspectee);
}

function inspectFn (fnInspect) {
    return (fnInspect.name) ? fnInspect.name : fnInspect.toString();
}

function inspectArgs (argsInspect) {
    return argsInspect.reduce(function (accumulator, itemInspect) {
        return accumulator += inspect(itemInspect);
    }, '(') + ')';
}

function curry(fnCurryMe) {
    var arity = fnCurryMe.length;

    return function fnCurried() {
        var args = Array.prototype.slice.call(arguments, 0);
        if (args.length >= arity) {
            return fnCurryMe.apply(null, args);
        }
        else {
            var fnCurryPartial = function fnCurryPartial () {
                var argsPartial = Array.prototype.slice.call(arguments, 0);
                return fnCurried.apply(null, args.concat(argsPartial));
            };
            fnCurryPartial.toString = function toString () {
                return inspectFn(fnCurryMe) + inspectArgs(args);
            };
            return fnCurryPartial;
        }
    };
}

function compose () {
    var fnsToCompose = Array.prototype.slice.call(arguments),
        numFunctions = fnsToCompose.length;

    var fnComposed = function fnComposed () {
        var results;
        for (var idx = numFunctions; --idx >= 0; ) {
            var fnToCall = fnsToCompose[idx],
                argsForCall = fnToCall.length ?
                    Array.prototype.slice.call(arguments, 0, fnToCall.length) : arguments,
                argsRemaining = Array.prototype.slice.call(
                    arguments, (fnToCall.length || 1)); // not right with *argsForCall
            argsRemaining.unshift(fnToCall.apply(this, argsForCall));
            results = argsRemaining;
        }
        return results[0];
    };
    return fnComposed;
}

var id = function (identity) {
    return identity;
};

var add = curry(function add (x, y) {
    return x + y;
});

var match = curry(function match (regex, str) {
    return str.match(regex);
});

var replace = curry(function replace (regex, replacement, str) {
    return str.replace(regex, replacement);
});

var filter = curry(function filter (fnFilter, array) {
    return array.filter(fnFilter);
});

var map = curry(function map (fnMap, array) {
    return array.map(fnMap);
});

var reduce = curry(function reduce (fnReduceCallback, initialValue, array) {
    return array.reduce(fnReduceCallback, initialValue);
});

var split = curry(function split (regex, str) {
    return str.split(regex);
});

var join = curry(function join (joiner, str) {
    return str.join(joiner);
});

var toUpperCase = function toUpperCase (str) {
    return str.toUpperCase();
};

var toLowerCase = function toLowerCase (str) {
    return str.toLowerCase();
};

var trace = curry(function trace (tag, data) {
    console.log(tag, data);
    return data;
});

var nop = curry(function nop (tag, data) {
    void tag;
    return data;
});

var info = curry(function info (tag, data) {
    console.info(tag, data);
    return data;
});

var warn = curry(function warn (tag, data) {
    console.warn(tag, data);
    return data;
});

var error = curry(function error (tag, data) {
    console.error(tag, data);
    return data;
});

module.exports = {
    curry:   curry,
    compose: compose,

    id:      id,
    add:     add,
    match:   match,
    replace: replace, 
    filter:  filter,
    map:     map,
    reduce:  reduce,
    split:   split,
    join:    join,

    toUpperCase: toUpperCase,
    toLowerCase: toLowerCase,

    // to help debugging function compositions
    nop:   nop,
    info:  info,
    warn:  warn,
    error: error,
    trace: trace
};
