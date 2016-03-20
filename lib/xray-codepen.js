/* jshint maxparams: 7, -W003, -W030, -W110, -W101 */
/* global R, chai, describe, it, mocha, document, window */

'use strict';

var expect = chai.expect,
    F = {};

// could not try out jscheck here, need a proper cdn
// https://raw.githubusercontent.com/douglascrockford/JSCheck/master/jscheck.js

function start () {
    mocha.setup('bdd');
    defineCode();
    defineSuite();
    mocha.run();
}

function defineSuite() {
    describe('xrayScan summarize inheritance for an object', function () {
        describe('xrayDepth :: a → Number', function () {

            // Cool, curry a test case so we can cut out a lot of noise when testing
            var xrayDepth = R.curry(function (testIt, depth, name, value) {
                testIt('should be ' + depth + ' for ' + name, function () {
                    expect(F.xrayDepth(value)).to.be.equal(depth);
                });
            });

            describe('zero', function () {
                var check = xrayDepth(it, 0);

                check('null', null);
                check('undefined', void 0);
            });
            describe('one', function () {
                var check = xrayDepth(it, 1);

                check('Object.prototype', Object.prototype);
            });
            describe('two', function () {
                var check = xrayDepth(it, 2);

                check('{}', {});

                check('Boolean.prototype', Boolean.prototype);
                check('Number.prototype', Number.prototype);
                check('String.prototype', String.prototype);
                check('Function.prototype', Function.prototype);
                check('Array.prototype', Array.prototype);
                check('RegExp.prototype', RegExp.prototype);
                check('Error.prototype', Error.prototype);

            });
            describe('three', function () {
                var check = xrayDepth(it, 3),
                    obj = {name: 'fred', ref: ['referenced']};

                Object.setPrototypeOf(obj, { girth: 'huge' });

                check('[]', []);
                check('true', true);
                check('42', 42);
                check('NaN', NaN);
                check('Infinity', Infinity);
                check('string', 'string');
                check('/match/', /match/);
                check('function', function () {});

                check('Boolean(true)', Boolean(true));
                check('Number(12)', Number(12));
                check('String(string)', String('string'));
                check('RegExp(regex)', new RegExp('regex'));

                check('obj ---> obj', obj);

                check('[].constructor', [].constructor);
                check('{}.constructor', {}.constructor);

                check('Boolean.constructor', Boolean.constructor);
                check('Number.constructor', Number.constructor);
                check('String.constructor', String.constructor);
                check('Function.constructor', Function.constructor);
                check('Array.constructor', Array.constructor);
                check('RegExp.constructor', RegExp.constructor);
                check('Error.constructor', Error.constructor);
                check('Object.constructor', Object.constructor);
            });
            describe('four', function () {
                var check = xrayDepth(it, 4),
                    obj = {name: 'fred', ref: ['referenced']},
                    obj2 = { girth: 'huge'};

                Object.setPrototypeOf(obj, obj2);
                Object.setPrototypeOf(obj2, { top: 'daddy'});

                check('obj ---> obj', obj);
            });
        });

        describe('xray :: a → [String]', function () {
            var xray = R.curry(function (testIt, expected, explain, value) {
                    testIt('should ' + explain + ' for ' + value, function () {
                        expect(F.xray(value)).to.deep.equal(expected);
                    });
                }),
                check = xray(it),
                checkNumber = xray(it,['Number', 'Number.prototype', 'Object.prototype']),
                checkBoolean = xray(it,['Boolean', 'Boolean.prototype', 'Object.prototype']),
                checkString = xray(it,['String', 'String.prototype', 'Object.prototype']),
                checkRegExp = xray(it,['RegExp', 'RegExp.prototype', 'Object.prototype']),
                obj = {name: 'fred', ref: ['referenced']},
                obj2 = { girth: 'huge'};

            Object.setPrototypeOf(obj, obj2);
            Object.setPrototypeOf(obj2, { top: 'daddy'});

            check(
                ['Mouse', 'Mammal', 'Object.prototype'],
                'answer with _inherits property if present',
                {_inherits: ['Mouse', 'Mammal']}
            );
            check(
                [],
                'handle undefined',
                void 0
            );
            check(
                ['Object'],
                'identify the null object',
                null
            );

            checkNumber('identify as Number', NaN);
            checkNumber('identify as Number', Infinity);
            checkNumber('identify as Number', -Infinity);

            checkBoolean('identify as Boolean', false);
            checkBoolean('identify as Boolean', true);

            checkNumber('identify as Number', 0);
            checkNumber('identify as Number', 12);
            checkString('identify as String', '');
            checkString('identify as String', 'a');

            checkRegExp('identify as RegExp', /this/);
            checkBoolean('identify as Boolean object Boolean(true)', Boolean(true));
            checkNumber('identify as Number Number(2)', Number(2));
            checkString('identify as String String(3)', String('3'));
            checkRegExp('identify as RegExp object', new RegExp('this', 'g'));

            it('should identify an anonymous function', function () {
                expect(F.xray(function () {}))
                    .to.deep.equal(['Function', 'Function', 'Object']);
            });
            it('should identify a named function', function () {
                expect(F.xray(function namedFn () {}))
                    .to.deep.equal(['Function namedFn', 'Function', 'Object']);
            });
            it('should identify an array', function () {
                expect(F.xray([])).to.deep.equal(['Array', 'Object']);
            });
            it('should identify an object', function () {
                expect(F.xray({})).to.deep.equal(['Object']);
            });
            it('should identify an inherited object', function () {
                expect(F.xray(obj2)).to.deep.equal(['Object', 'Object']);
            });
            it('should identify the Window object', function () {
                expect(F.xray(window)).to.deep.equal(['Window', 'EventTarget', 'Object']);
            });
            it.only('should identify the document object', function () {
                expect(F.xray(document))
                    .to.deep.equal(["HTMLDocument", "HTMLDocument", "Document", "Node", "EventTarget", "Object.prototype"]);
            });
            it('should identify the Boolean prototype', function () {
                expect(F.xray(Boolean.prototype))
                    .to.deep.equal(['Boolean.prototype', 'Object.prototype']);
            });
            it('should identify the Boolean constructor', function () {
                expect(F.xray(Boolean))
                    .to.deep.equal(['Function Boolean', 'Function.prototype', 'Object.prototype']);
            });
        });

    }); // describe
} // defineSuite

function defineCode() {

    // impure trace :: String → a → a
    F.trace = R.curry(function (message, thing) {
        console.log(message, thing);
        return thing;
    });

    // xrayDepth :: a → Number
    // report how long the prototype chain is.
    F.xrayDepth = function (obj) {
        var depth = 0;
        while (obj !== null && typeof obj !== 'undefined') {
            depth += 1;
            obj = Object.getPrototypeOf(obj);
        }
        return depth;
    };

    // xray :: a → [String]
    // return the inherits chain from an xrayScan
    F.xray = function (obj) {
        return F.xrayScan(obj)._inherits;
    };

    // xrayScan :: a → b → b
    // identify what an object is and what it inherits from
    // if _inherits array exists, that is used, otherwise tries to be smart
    F.xrayScan = function (obj, ancestry) {
        /* jshint maxcomplexity: 12, maxdepth: 4 */
        ancestry = ancestry || { _inherits: [], path: '', objects: [], found: {} };

        var proto,
            typeOf = typeof obj,
            nameProperties = ['nodeName', 'id', 'cid', 'name', 'title'],
            outIf = function (check, obj, type) {
                if (check) {
                    if (type) {
                        type = type[0].toUpperCase() + type.slice(1);
                        inherit(type, obj);
                    }
                    throw new Error(type);
                }
            },
            inheritIfMatch = function (obj, type, regex, prefix) {
                prefix = prefix || '';
                var match = type.match(regex);
                if (match) {
                    type = prefix + match[1];
                    inherit(type, obj);
                    throw new Error(type);
                }
            },
            inherit = function (type, obj) {
                var typeName = type;
                /*
                 if ((type === 'Boolean' && obj !== Boolean) ||
                 (type === 'Number' && obj !== Number) ||
                 (type === 'String' && obj !== String) ||
                 (type === 'RegExp' && obj !== RegExp) ||
                 (type === 'Function' && obj !== Function) ||
                 (type === 'Array' && obj !== Array) ||
                 (type === 'Object' && obj !== Object)
                 ) {
                 typeName = 'a ' + typeName;
                 }
                 */
                if ((type === 'Boolean' && obj === Boolean.prototype) ||
                    (type === 'Number' && obj === Number.prototype) ||
                    (type === 'String' && obj === String.prototype) ||
                    (type === 'RegExp' && obj === RegExp.prototype) ||
                    (type === 'Function' && obj === Function.prototype) ||
                    (type === 'Array' && obj === Array.prototype) ||
                    (type === 'Object' && obj === Object.prototype)
                ) {
                    typeName = type + '.prototype';
                }

                if (obj) {
                    for (var idx = 0; idx < nameProperties.length; idx += 1) {
                        var prop = nameProperties[idx];
                        try {
                            if (obj[prop] &&
                                typeof obj[prop] !== 'function' &&
                                typeof obj[prop] !== 'object') {

                                typeName += ' ' + obj[prop];
                                idx = nameProperties.length;
                            }
                        }
                        catch (err) {
                            void err;
                        }
                    }
                }

                ancestry.found[typeName] = true;
                ancestry._inherits.push(typeName);
                ancestry.objects.push(obj);
            };

        try {
            outIf(obj === undefined, obj);
            outIf(obj === null, obj, 'Object');
            proto = Object.getPrototypeOf && Object.getPrototypeOf(obj);

            outIf(!/^(object|function)$/.test(typeOf), obj, typeOf);
            if (typeOf === 'function') {
                inheritIfMatch(obj, obj.toString(), /^function ([^\(]+)\(/, 'Function ');
                outIf(true, obj, 'Function');
            }
            if ('_inherits' in obj) {
                for (var idx = 0; idx < obj._inherits.length; idx += 1) {
                    ancestry._inherits.push(obj._inherits[idx]);
                }
                throw new Error('_inherits');
            }
            if (obj.constructor && obj.constructor.toString) {
                inheritIfMatch(obj, obj.constructor.toString(), /^function ([^\(]+)\(/);
            }
            if ('toString' in obj) {
                inheritIfMatch(obj, obj.toString(), /\[object (.+)\]/);
            }
        }
        catch (error) {
            if (proto) {
                F.xrayScan(proto, ancestry);
            }
        }
        finally {
            ancestry.path = ancestry._inherits.join(' → ');
            console.log(ancestry.path, ancestry);
            return ancestry;
        }
    }; // xrayScan
} // defineCode

start();