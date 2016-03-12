/* jshint -W003 */
/* jshint -W016 */
'use strict';
//var curry = require('ramda').curry;
//
//
//
//

function inspect(x) {
    return (typeof x === 'function') ? inspectFn(x) : inspectArgs(x);
}

function inspectFn(fn) {
    return (fn.name) ? fn.name : fn.toString();
}

function inspectArgs(args) {
    return args.reduce(function(acc, x){
        return acc += inspect(x);
    }, '(') + ')';
}

function curry(fx) {
    var arity = fx.length;

    return function f1() {
        var args = Array.prototype.slice.call(arguments, 0);
        if (args.length >= arity) {
            return fx.apply(null, args);
        }
        else {
            var f2 = function f2() {
                var args2 = Array.prototype.slice.call(arguments, 0);
                return f1.apply(null, args.concat(args2));
            };
            f2.toString = function() {
                return inspectFn(fx) + inspectArgs(args);
            };
            return f2;
        }
    };
}

function compose () {
    var fns = Array.prototype.slice.call(arguments),
        arglen = fns.length;

    return function () {
        var argz;
        for (var i = arglen; --i >= 0; ) {
            var fn = fns[i]
                , args = fn.length ?
                    Array.prototype.slice.call(arguments, 0, fn.length) : arguments
                , next_args = Array.prototype.slice.call(
                    arguments, (fn.length || 1)); // not right with *args
            next_args.unshift(fn.apply(this, args));
            argz = next_args;
        }
        return argz[0];
    };
}

var add = curry(function(x, y) {
    return x + y;
});

var match = curry(function(what, str) {
    return str.match(what);
});

var replace = curry(function(what, replacement, x) {
    return x.replace(what, replacement);
});

var filter = curry(function(fn, xs) {
    return xs.filter(fn);
});

var map = curry(function map(fn, xs) {
    return xs.map(fn);
});

var reduce = curry(function(fn, array, xs) {
    return xs.reduce(fn, array);
});

var split = curry(function(what, str) {
    return str.split(what);
});

var join = curry(function(what, str) {
    return str.join(what);
});

var toUpperCase = function(str) {
    return str.toUpperCase();
};

var toLowerCase = function(x) {
    return x.toLowerCase();
};

var trace = curry(function(tag, data) {
    console.log(tag, data);
    return data;
});

var info = curry(function(tag, data) {
    console.info(tag, data);
    return data;
});

var warn = curry(function(tag, data) {
    console.warn(tag, data);
    return data;
});

var error = curry(function(tag, data) {
    console.error(tag, data);
    return data;
});

module.exports = {
    curry: curry,
    compose: compose,

    add: add, 
    match: match, 
    replace: replace, 
    filter: filter, 
    map: map, 
    reduce: reduce, 
    split: split, 
    join: join,

    toUpperCase: toUpperCase,
    toLowerCase: toLowerCase,

    // to help debugging function compositions
    info: info,
    warn: warn,
    error: error,
    trace: trace
};
