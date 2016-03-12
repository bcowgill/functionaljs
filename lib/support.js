/* jshint -W003 */
/* jshint -W016 */
'use strict';
//var curry = require('ramda').curry;
//
//
//
//

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

var add = curry(function(x, y) {
    return x + y;
});

var match = curry(function(regex, str) {
    return str.match(regex);
});

var replace = curry(function(regex, replacement, str) {
    return str.replace(regex, replacement);
});

var filter = curry(function(fnFilter, array) {
    return array.filter(fnFilter);
});

var map = curry(function map(fnMap, array) {
    return array.map(fnMap);
});

var reduce = curry(function(fnReduceCallback, initialValue, array) {
    return array.reduce(fnReduceCallback, initialValue);
});

var split = curry(function(regex, str) {
    return str.split(regex);
});

var join = curry(function(joiner, str) {
    return str.join(joiner);
});

var toUpperCase = function(str) {
    return str.toUpperCase();
};

var toLowerCase = function(str) {
    return str.toLowerCase();
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
    curry:   curry,
    compose: compose,

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
    info:  info,
    warn:  warn,
    error: error,
    trace: trace
};
