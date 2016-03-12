'use strict';

describe('play with functional programming', function () {

    it('should do something functional with ramda library', function () {
        /* jshint maxstatements: 25 */
        var R = require('ramda');

        expect(R.empty()).to.be.a('function');

        expect(R.empty(void 0)).to.be.undefined;
        expect(R.empty(null)).to.be.undefined;


        expect(R.empty(true)).to.be.undefined;
        expect(R.empty(false)).to.be.undefined;
        expect(R.empty(Boolean(true))).to.be.undefined;

        expect(R.empty(NaN)).to.be.undefined;
        expect(R.empty(Infinity)).to.be.undefined;
        expect(R.empty(-Infinity)).to.be.undefined;
        expect(R.empty(0)).to.be.undefined;
        expect(R.empty(2345)).to.be.undefined;
        expect(R.empty(Number(2345))).to.be.undefined;

        expect(R.empty(function (a) { return a * a; })).to.be.undefined;
        /* jshint -W054 */ // The Function constructor is a form of eval
        expect(R.empty(new Function())).to.be.undefined;
        /* jshint +W054 */

        expect(R.empty('this')).to.be.equal('');
        expect(R.empty(String('this'))).to.be.equal('');

        expect(R.empty(/'this'/i)).to.be.undefined;
        expect(R.empty(new RegExp('this', 'i'))).to.be.undefined;


        expect(R.empty(['this'])).to.be.deep.equal([]);
        expect(R.empty(new Array(10))).to.be.deep.equal([]);

        // different empty returns are different! too bad
        expect(R.empty(['a'])).to.not.be.equal(R.empty(['b']));

        expect(R.empty({a:23})).to.be.deep.equal({});
        /* jshint -W010 */ // The object literal notation {} is preferable.
        expect(R.empty(new Object())).to.be.deep.equal({});
        /* jshint +W010 */

        expect(R.empty({a:23})).to.not.be.equal(R.empty({b:323}));

    });

    it('should do something functional with curry', function () {
        var curry = require('lodash.curry');

        var match = curry(function(what, str) {
            return str.match(what);
        });

        var replace = curry(function(what, replacement, str) {
            return str.replace(what, replacement);
        });

        var filter = curry(function(fnFilter, array) {
            return array.filter(fnFilter);
        });

        var map = curry(function(fnMap, array) {
            return array.map(fnMap);
        });

        void map;

        var hasSpaces = match(/\s+/g);
        var findSpaces = filter(hasSpaces);
        var noVowels = replace(/[aeiouy]/ig);
        var censored = noVowels('*');

        expect(match(/\s+/g, 'hello world')).to.be.deep.equal([' ']);
        expect(match(/\s+/g)('hello world')).to.be.deep.equal([' ']);
        expect(hasSpaces('hello world')).to.be.deep.equal([' ']);
        expect(hasSpaces('spaceless')).to.be.null;

        expect(filter(hasSpaces, ['tori_spelling', 'tori amos'])).to.be.deep.equal(['tori amos']);
        expect(findSpaces(['tori_spelling', 'tori amos'])).to.be.deep.equal(['tori amos']);

        expect(censored('Chocolate Rain')).to.be.equal('Ch*c*l*t* R**n');
    });

    it('should remember function call values with memoize', function () {
        var EPSILON = 1e-6;
        /* jshint maxparams: 5 */
        var memoize2 = function(fnCalc) {
            var cache = {};

            return function() {
                /* jshint maxcomplexity: 2 */
                var arg_str = JSON.stringify(arguments);
                cache[arg_str] = cache[arg_str] || fnCalc.apply(fnCalc, arguments);
                return cache[arg_str];
            };
        }; void memoize2;

        var memoize = require('memoize'); void memoize;

        var complex = memoize2(function (x, y, z, t) {
           // console.error('not cached1', arguments);
            return Math.sqrt(x*x + y*y + z*z + t*t);
        });

        var complex2 = memoize(function (x, y, z, t, fnCallback) {
            //console.error('not cached2', arguments);
            fnCallback(null,  Math.sqrt(x*x + y*y + z*z + t*t));
        });

        expect(complex(3,4,0,0)).to.be.equal(5);
        expect(complex(3,4,0,0)).to.be.equal(5);
        expect(complex(3,4,0,0)).to.be.equal(5);
        expect(complex(1,2,3,4)).to.be.closeTo(5.477225575051661, EPSILON);
        expect(complex(1,2,3,4)).to.be.equal(5.477225575051661, EPSILON);
        expect(complex(1,2,3,4)).to.be.equal(5.477225575051661, EPSILON);
        expect(complex(1,2,3,4)).to.be.equal(5.477225575051661, EPSILON);

        complex2(3,4,0,0,function (err, result) {
            void err;
            expect(result).to.be.equal(5);
        });
    });
});