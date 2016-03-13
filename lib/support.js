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
