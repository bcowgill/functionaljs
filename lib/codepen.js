/* jshint maxparams: 7, -W003, -W030, -W110, -W101 */
/* global R, chai, describe, it, mocha, Maybe, get */

'use strict';

var NEXT = 56;

var expect = chai.expect,
	F = {};

// could not try out jscheck here, it needs a proper cdn
// https://raw.githubusercontent.com/douglascrockford/JSCheck/master/jscheck.js

function start () {
	mocha.setup('bdd');
	defineCode();
	defineSuite();
	mocha.run();
}

function defineSuite() {
describe('Functional Programming', function () {
	describe('ramda library', function () {
		describe('simple operations', function () {
			it('should test this next', function () {
				var keys = Object.keys(R);

				expect([keys.length,keys[NEXT]]).to.deep.equal([]);
			});

			describe('Math> R.add :: a → a → a', function () {
				it('should add values', function () {
					expect(R.add('g', 'h')).to.be.equal('gh');
					expect(R.add('g', 6)).to.be.equal('g6');
					expect(R.add(4, 6)).to.be.equal(10);
				});
			});


			describe('Function> R.always :: a → (* → a)', function () {
				it('should always return the value (aka constant)', function () {
					var obj = {};

					expect(R.always(42)()).to.be.equal(42);
					expect(R.always(obj)()).to.be.equal(obj);
				});
			});

			describe('Logic> R.F and R.T :: * → Boolean', function () {
				it('should return false/true', function () {
					expect(R).to.be.an('Object');

					expect(R.F()).to.be.not.ok;
					expect(R.T()).to.be.ok;
				});
			});

			describe('Logic> R.and :: Boolean → Boolean → Boolean', function () {
				it('should return logical and of parameters', function () {
					var gate = R.and(true);

					expect(R.and(false)(false)).to.be.not.ok;
					expect(R.and(false)(true)).to.be.not.ok;
					expect(gate(false)).to.be.not.ok;
					expect(gate(true)).to.be.ok;
				});
			});

			// also List> R.concat :: [a] → [a] → [a]
			describe('String> R.concat :: String → String → String', function () {
				it('should concatenate strings together', function () {
					expect(R.concat('first')('second')).to.be.equal('firstsecond');
					expect(R.concat('')('second')).to.be.equal('second');
				});
			});

			describe('Math> R.dec :: Number → Number', function () {
				it('should decrement the value', function () {
					expect(R.dec(42)).to.be.equal(41);
					expect(R.dec(0)).to.be.equal(-1);
				});
			});

			describe('Logic> R.defaultTo :: a → b → a | b', function () {
				var def = R.defaultTo(42);
				it('should return default value for undefined', function () {
					expect(def(void 0)).to.be.equal(42);
				});
				it('should return default value for null', function () {
					expect(def(null)).to.be.equal(42);
				});
				it('should return default value for NaN', function () {
					expect(def(NaN)).to.be.equal(42);
				});
				it('should NOT EXPECTED return default value for Infinity', function () {
					expect(def(Infinity)).to.be.equal(Infinity);
				});
				it('should NOT EXPECTED return default value for -Infinity', function () {
					expect(def(-Infinity)).to.be.equal(-Infinity);
				});
				it('should return zero value for zero', function () {
					expect(def(0)).to.be.equal(0);
				});
				it('should return empty string for empty string', function () {
					expect(def('')).to.be.equal('');
				});
				it('should return function for function', function () {
					expect(def(R.T)).to.be.equal(R.T);
				});
			});

			describe('Math> R.divide :: Number → Number → Number', function () {
				it('should divide the two values', function () {
					var percentToRatio = R.flip(R.divide)(100),
						reciprocal = R.divide(1);
					expect(percentToRatio(42)).to.be.equal(0.42);
					expect(reciprocal(4)).to.be.equal(0.25);
				});
			});

			// also List> Number → [a] → [a]
			describe('String> R.drop :: Number → String → String', function () {
				it('should drop the first character from string', function () {
					expect(R.drop(1, 'foo'))
						.to.be.equal('oo');
				});
				it('should drop the first two characters from string', function () {
					expect(R.drop(2, 'foo'))
						.to.deep.equal('o');
				});
				it('should drop the all characters from the string', function () {
					expect(R.drop(3, ''))
						.to.deep.equal('');
				});
				it('should drop the all characters from a short string', function () {
					expect(R.drop(4, 'foo'))
						.to.deep.equal('');
				});
			});

			// also List> Number → [a] → [a]
			describe('String> R.dropLast :: Number → String → String', function () {
				it('should drop the last character from string', function () {
					expect(R.dropLast(1, 'foo'))
						.to.be.equal('fo');
				});
				it('should drop the last two characters from string', function () {
					expect(R.dropLast(2, 'foo'))
						.to.deep.equal('f');
				});
				it('should drop the all characters from the string', function () {
					expect(R.dropLast(3, ''))
						.to.deep.equal('');
				});
				it('should drop the all characters from a short string', function () {
					expect(R.dropLast(4, 'foo'))
						.to.deep.equal('');
				});
			});

			// also List> (a → Boolean) → [a] → [a]
 			describe('String> R.dropLastWhile :: (Char → Boolean) → String → [Char]', function () {
				it('should drop last characters from a string provided they match a predicate function', function () {
					var isUpperCase = x => x === x.toUpperCase();

					expect(R.dropLastWhile(isUpperCase, 'ABcdCBA'))
						.to.deep.equal(['A', 'B', 'c', 'd']);
				});
			});

			// also List> (a, a → Boolean) → [a] → [a]
 			describe('String> R.dropRepeats :: String → [Char]', function () {
				it('should remove consecutive repeat characters from a string', function () {
					expect(R.dropRepeats('aaabcddbb'))
						.to.deep.equal(['a', 'b', 'c', 'd', 'b']);
				});
			});

			// also List> (a, a → Boolean) → [a] → [a]
 			describe('String> R.dropRepeatsWith :: (Char, Char → Boolean) → String → [Char]', function () {
				it('should remove consecutive repeat characters from string using a comparison function', function () {
					var list = 'aAacdDDEecc',
						cmp = function (a, b) { return a.toUpperCase() === b.toUpperCase(); };
					expect(R.dropRepeatsWith(cmp, list))
						.to.deep.equal(['a', 'c', 'd', 'E', 'c']);
				});
			});

			// also List> (a → Boolean) → [a] → [a]
 			describe('String> R.dropWhile :: (Char → Boolean) → String → [Char]', function () {
				it('should drop initial characters from a string provided they match a predicate function', function () {
					var isUpperCase = x => x === x.toUpperCase();

					expect(R.dropWhile(isUpperCase, 'ABcdcBA'))
						.to.deep.equal(['c', 'd', 'c', 'B', 'A']);
				});
			});

			describe('Function> R.empty :: a → a', function () {
				it('should return the empty string', function () {
					var test = 'filled';
					expect(R.empty(test)).to.be.equal('');
					expect(test).to.be.equal('filled');
				});
				it('should return the empty number', function () {
					var test = 42;
					expect(R.empty(test)).to.be.equal(void 0);
					expect(test).to.be.equal(42);
				});
				it('should return the empty array', function () {
					var test = [42];
					expect(R.empty(test)).to.deep.equal([]);
					expect(test).to.deep.equal([42]);
				});
				it('should return the empty object', function () {
					var test = {prop: 42};
					expect(R.empty(test)).to.deep.equal({});
					expect(test).to.deep.equal({prop: 42});
				});
				it('should return a custom empty object', function () {
					var test = {prop: 42, empty: function () { return 'custom'; }};
					expect(R.empty(test)).to.be.equal('custom');
				});
			});


		}); // simple operations

		describe('functional operations', function () {
			describe('Function> R.__', function () {
				it('should have R.__ placeholder functional', function () {
					expect(Object.keys(R.__)).to.deep.equal(['@@functional/placeholder']);
				});
			});

			describe('Logic> R.allPass :: [(*… → Boolean)] → (*… → Boolean) more generic version of both', function () {
				it('should check that value is within range', function () {
					var above1 = R.lt(1),
						below10 = R.flip(R.lt)(10),
						inRange = R.allPass([above1, below10]);

					expect(inRange(1)).to.be.equal(false);
					expect(inRange(2)).to.be.equal(true);
					expect(inRange(3)).to.be.equal(true);
					expect(inRange(9)).to.be.equal(true);
					expect(inRange(10)).to.be.equal(false);
					expect(inRange(11)).to.be.equal(false);
				});
			});

			describe('Logic> R.anyPass :: [(*… → Boolean)] → (*… → Boolean)', function () {
				it('should check that value is outside a range', function () {
					var above10 = R.lt(10),
						below1 = R.flip(R.lt)(1),
						inRange = R.anyPass([above10, below1]);
					expect(inRange(0)).to.be.equal(true);
					expect(inRange(1)).to.be.equal(false);
					expect(inRange(2)).to.be.equal(false);
					expect(inRange(3)).to.be.equal(false);
					expect(inRange(9)).to.be.equal(false);
					expect(inRange(10)).to.be.equal(false);
					expect(inRange(11)).to.be.equal(true);
				});
			});

			describe('Function> R.binary :: (* → c) → (a, b → c)', function () {
				it('should return a binary argument function, ignores args 3+', function () {
					var planar = R.binary(function (x, y, z) {
						return [x||0, y||0, z||0];
					});
					expect(planar).to.be.a('function');
					expect(planar.length).to.be.equal(2);
					expect(planar(1, 2, 3)).to.deep.equal([1, 2, 0]);
				});
			});

			describe('Logic> R.both :: (*… → Boolean) → (*… → Boolean) → (*… → Boolean) like and, see also allPass()', function () {
				it('should return true if both functions evaluate true on the arguments', function () {
					var above1 = R.lt(1),
						below10 = R.flip(R.lt)(10),
						inRange = R.both(above1, below10);

					expect(inRange(1)).to.be.equal(false);
					expect(inRange(2)).to.be.equal(true);
					expect(inRange(3)).to.be.equal(true);
					expect(inRange(9)).to.be.equal(true);
					expect(inRange(10)).to.be.equal(false);
					expect(inRange(11)).to.be.equal(false);
				});
			});

			describe('Function> R.call :: (*… → a),*… → a', function () {
				var glue = function () {
						return Array.prototype.slice.call(arguments).join('.');
					};

				it('should call the function using the arguments', function () {
					expect(R.call(glue, 'one', 'in', 'is', 'winner')).to.be.equal('one.in.is.winner');
				});
				it.skip('This is occasionally useful as a converging function for R.converge: the left branch can produce a function while the right branch produces a value to be passed to that function as an argument.');
/*
				var indentN = R.pipe(R.times(R.always(' ')),
					R.join(''),
					R.replace(/^(?!$)/gm));

				var format = R.converge(R.call, [
					R.pipe(R.prop('indent'), indentN),
					R.prop('value')
				]);

				format({indent: 2, value: 'foo\nbar\nbaz\n'}); //=> '  foo\n  bar\n  baz\n'
*/

			});

			describe('Function> R.comparator :: (a, b → Boolean) → (a, b → Number)', function () {
				it('should convert a boolean comparison check to a comparator check', function () {
					var isLess = function (a, b) { return a < b; },
						cmpLess = R.comparator(isLess);
					expect(isLess(1, 3)).to.be.equal(true);
					expect(isLess(3, 3)).to.be.equal(false);
					expect(isLess(3, 1)).to.be.equal(false);
					expect(cmpLess(1, 3)).to.be.equal(-1);
					expect(cmpLess(3, 3)).to.be.equal(0);
					expect(cmpLess(3, 1)).to.be.equal(1);
				});
			});

			describe('Logic> R.complement :: (*… → *) → (*… → Boolean)', function () {
				it('should return a function which logically complements the return value of the passed in function', function () {
					var valid = R.curry(function (a, b) { return a || b; }),
						invalid = R.complement(valid(false)),
						invalid2 = R.complement(valid),
						gte = R.complement(R.lt);

					expect(invalid(true)).to.be.equal(false);
					expect(invalid(false)).to.be.equal(true);
					expect(invalid2(false, false)).to.be.equal(true);
					expect(invalid2(false, true)).to.be.equal(false);
					expect(gte(1, 3)).to.be.equal(false);
					expect(gte(3, 3)).to.be.equal(true);
					expect(gte(3, 1)).to.be.equal(true);
				});
			});

			describe('Function> R.compose :: ((y → z), (x → y), …, (o → p), ((a, b, …, n) → o)) → ((a, b, …, n) → z) see also pipe', function () {
				it('should compose multiple functions into a single function call', function () {
					var longerThan2 = R.compose(R.lt(2), R.prop('length'), R.add);

					expect(longerThan2('a', '')).to.be.equal(false);
					expect(longerThan2('a', 'b')).to.be.equal(false);
					expect(longerThan2('ab', 's')).to.be.equal(true);
				});
			});

			describe.skip('Function> R.composeK :: Chain m => ((y → m z), (x → m y), …, (a → m b)) → (m a → m z) see also pipeK', function () {
				it('should compose multiple chain functions into a single chain function call', function () {
					// ramda-fantasy and ramda-maybe can be used

					//  parseJson :: String -> Maybe *
					var parseJson = R.compose(R.Maybe.of, function (string) {
						var obj;
						try {
							obj = JSON.parse(string);
						}
						finally {
							return obj;
						}
					});

					//  get :: String -> Object -> Maybe *

					//  getStateCode :: Maybe String -> Maybe String
					var getStateCode = R.composeK(
						R.compose(Maybe.of, R.toUpper),
						get('state'),
						get('address'),
						get('user'),
						parseJson
					);

					getStateCode(Maybe.of('{"user":{"address":{"state":"ny"}}}'));
					//=> Just('NY')
					getStateCode(Maybe.of('[Invalid JSON]'));
					//=> Nothing()
				});
				it('should be equivalent to composing the chain of each function');
				// R.composeK(h, g, f) is equivalent to R.compose(R.chain(h), R.chain(g), R.chain(f))
			});

			describe.skip('Function> R.composeP :: ((y → Promise z), (x → Promise y), …, (a → Promise b)) → (a → Promise z) see also pipeP', function () {
				it('should compose multiple promise returning functions into a single promise returning function call', function () {
					var longerThan2 = R.compose(R.lt(2), R.prop('length'), R.add);

					expect(longerThan2('a', '')).to.be.equal(false);
					expect(longerThan2('a', 'b')).to.be.equal(false);
					expect(longerThan2('ab', 's')).to.be.equal(true);
				});
			});

			describe('Logic> R.cond :: [[(*… → Boolean),(*… → *)]] → (*… → *)', function () {
				it('should make a function for an if/else chain', function () {
					var fn = R.cond([
						[R.equals(0),   R.always('water freezes at 0°C')],
						[R.equals(100), R.always('water boils at 100°C')],
						[R.T,           temp => 'nothing special happens at ' + temp + '°C']
					]);
					expect(fn(0)).to.be.equal('water freezes at 0°C');
					expect(fn(50)).to.be.equal('nothing special happens at 50°C');
					expect(fn(100)).to.be.equal('water boils at 100°C');
				});
			});

			describe('Function> R.converge :: (x1 → x2 → … → z) → [(a → b → … → x1), (a → b → … → x2), …] → (a → b → … → z)', function () {
				it('should make a function for converging the results of other functions', function () {
					// fn(x) = ( x + 1 / x - 1 )
					var fn = R.converge(R.divide, [R.add(1), R.dec]);

					expect(fn(0)).to.be.equal(-1);
					expect(fn(3)).to.be.equal(2);
				});
			});

			describe('Logic> R.either :: (*… → Boolean) → (*… → Boolean) → (*… → Boolean)', function () {
				it('should invoke only the first function of an either', function () {
					var invoked = {},
						fnIfTrue = function () { invoked.true = true; return true;},
						fnIfFalse = function () { invoked.false = false; return false;};

					var result = R.either(fnIfTrue, fnIfFalse)('anything');
					expect(invoked).to.deep.equal({true: true});
					expect(result).to.be.equal(true);
				});
				it('should invoke both the first and second functions of an either', function () {
					var invoked = {},
						fnIfTrue = function () { invoked.true = true; return true;},
						fnIfFalse = function () { invoked.false = false; return false;};

					var result = R.either(fnIfFalse, fnIfTrue)('anything');
					expect(invoked).to.deep.equal({false: false, true: true});
					expect(result).to.be.equal(true);
				});
				it('should invoke both the first and second functions of an either and return the final function call result', function () {
					var invoked = {},
						fnIfFalse = function () { invoked.false = false; return false;};

					var result = R.either(fnIfFalse, fnIfFalse)('anything');
					expect(invoked).to.deep.equal({false: false});
					expect(result).to.be.equal(false);
				});
				it('should perform an either or check on input', function () {
					var gt10 = x => x > 10;
					var even = x => x % 2 === 0;
					var f = R.either(gt10, even);
					expect(f(101)).to.be.equal(true);
					expect(f(8)).to.be.equal(true);
					expect(f(7)).to.be.equal(false);
				});
				it('In addition to functions, R.either also accepts any fantasy-land compatible applicative functor.');
			});

		}); // functional operations

		describe('object operations', function () {
			describe('Object> R.assoc :: String → a → {k: v} → {k: v}', function () {
				it('should add/updaate a key value association to an object', function () {
					expect(R.assoc('debug', true)({name: 'johnson'}))
						.to.deep.equal({debug: true, name: 'johnson'});
					expect(R.assoc('debug', true)({debug: false, name: 'johnson'}))
						.to.deep.equal({debug: true, name: 'johnson'});
				});
				it('should flatten prototype properties while associating and shallow copy references', function () {
					var obj = {name: 'fred', ref: ['referenced']};
					Object.setPrototypeOf(obj, { girth: 'huge' });
					var objNew = R.assoc('debug', true)(obj);

					expect(obj.name).to.be.equal('fred');
					expect(obj.girth).to.be.equal('huge');
					expect(objNew)
						.to.deep.equal({debug: true, name: 'fred', ref: ['referenced'], girth: 'huge'});
					expect(objNew.ref).to.be.equal(obj.ref);
				});
			});

			describe('Object> R.assocPath: [String] → a → {k: v} → {k: v}', function () {
				it('should add/update a path.key value association to an object vivifying missing depths', function () {
					expect(R.assocPath(['view','logger','debug'], true)({name: 'johnson'}))
						.to.deep.equal({view: {logger: {debug: true}}, name: 'johnson'});
					expect(R.assocPath('view.logger.debug'.split('.'), true)({view: {logger: {debug: false}}, name: 'johnson'}))
						.to.deep.equal({view: {logger: {debug: true}}, name: 'johnson'});
				});
				it('should flatten prototype properties while associating and shallow copy references', function () {
					var obj = {name: 'fred', ref: ['referenced']};
					Object.setPrototypeOf(obj, { girth: 'huge' });
					var objNew = R.assocPath('view.logger.debug'.split('.'), true)(obj);

					expect(obj.name).to.be.equal('fred');
					expect(obj.girth).to.be.equal('huge');
					expect(objNew)
						.to.deep.equal({view: {logger: {debug: true}}, name: 'fred', ref: ['referenced'], girth: 'huge'});
					expect(objNew.ref).to.be.equal(obj.ref);
				});
			});

			describe('Function> R.bind :: (* → *) → {*} → (* → *)', function () {
				var obj = { name: 'fred' },
					name = function () {
						return this.name;
					},
					boundName = R.bind(name, obj);

				it('should bind a function to an object', function () {
					expect(boundName()).to.be.equal('fred');
				});
			});

			describe('Object> R.clone :: {*} → {*}', function () {
				it('should deep copy an object properties (and prototype) but reference copy functions and the prototype methods', function () {
					var obj = {name: 'fred', ref: ['not referenced'], method: function () { return this.name; }};
					Object.setPrototypeOf(obj, { girth: ['huge'], protoMethod: function () { return this.girth; }});
					var objNew = R.clone(obj);
					expect(Object.keys(objNew)).to.deep.equal(['name', 'ref', 'method', 'girth', 'protoMethod']);
					expect(objNew.ref).to.not.be.equal(obj.ref);
					expect(objNew.ref).to.deep.equal(obj.ref);
					expect(objNew.girth).to.not.be.equal(obj.girth);
					expect(objNew.girth).to.deep.equal(obj.girth);
					expect(objNew.method).to.be.equal(obj.method);
					expect(objNew.protoMethod).to.be.equal(obj.protoMethod);
					expect(objNew.method()).to.be.equal('fred');
					expect(objNew.protoMethod()).to.deep.equal(['huge']);
				});
				it('Dispatches to a clone method if present');
			});

			describe('Function> R.construct :: (* → {*}) → (* → {*})', function () {
				it('should curry a constructor function', function () {
					var Widget = function (list) { this.name = list.join(' '); };
					Widget.prototype = { of: function (list) { return new Widget(list); } };

					var widget = Widget.prototype.of(['a', 'b', 'c']);
					var WidgetList = R.map(R.construct(Widget), [
						['John', 'C', 'Doe'],
						['Jesus', 'H', 'Christ']
					]);
					expect(widget.name).to.be.equal('a b c');
					expect(WidgetList.length).to.be.equal(2);
					expect(WidgetList[0].name).to.be.equal('John C Doe');
					expect(WidgetList[1].name).to.be.equal('Jesus H Christ');
				});
			});

			describe('Function> R.constructN :: Number → (* → {*}) → (* → {*})', function () {
				it('should curry a variadic constructor function', function () {
					var Widget = function () {
						this.name = Array.prototype.slice.call(arguments).join(' ');
					};
					Widget.prototype = {
						of: function () {
							var me = new Widget();
							me.name = Array.prototype.slice.call(arguments).join(' ');
							return me;
						}
					};

					var widget = Widget.prototype.of('a', 'b', 'c', 'd');
					var WidgetList = R.map(R.apply(R.constructN(3, Widget)), [
						['John', 'C', 'Doe'],
						['Jesus', 'H', 'Christ']
					]);
					expect(widget.name).to.be.equal('a b c d');
					expect(WidgetList.length).to.be.equal(2);
					expect(WidgetList[0].name).to.be.equal('John C Doe');
					expect(WidgetList[1].name).to.be.equal('Jesus H Christ');
				});
			});

			describe('Object> dissoc :: String → {k: v} → {k: v}', function () {
				it('should clone object minus one property', function () {
					expect(R.dissoc('b', {a: 1, b: 2, c: 3}))
						.to.deep.equal({a: 1, c: 3});
				});
			});

			describe('Object> dissocPath :: [String] → {k: v} → {k: v}', function () {
				it('should shallow clone a deep object minus one path to property', function () {
					expect(R.dissocPath(['a', 'b', 'c'], {a: {b: {c: 42}}}))
						.to.deep.equal({a: {b: {}}});
				});
			});

			describe.skip('cat> todo :: a → a', function () {
				it('should ...', function () {
					expect(false).to.be.equal(true);
				});
			});

		}); // object operations

		describe('list operations', function () {
			describe('Function> R.addIndex: ((a … → b) … → [a] → *) → (a …, Int, [a] → b) … → [a] → *)', function () {
				it('should map over an array with the index value to create bullet points', function () {
					expect(F.mapIndexed(F.indexedBullet('. '))(['one', 'two', 'three']))
						.to.deep.equal(['1. one', '2. two', '3. three']);
				});
			});

			describe('List> R.adjust: (a → a) → Number → [a] → [a]', function () {
				it('should adjust a value in a list by index', function () {
					expect(R.adjust(F.suffix(' day'))(1)(['one', 'two', 'three']))
						.to.deep.equal(['one', 'two day', 'three']);
				});
			});

			describe('List> R.all: (a → Boolean) → [a] → Boolean', function () {
				var longerThan2 = R.compose(R.lt(2), R.prop('length')),
				    shorterThan4 = R.compose(R.flip(R.lt)(4), R.prop('length'));

				it('should evaluate true if all array elements match a predicate', function () {
					expect(R.all(longerThan2, (['one', 'two', 'three'])))
						.to.be.equal(true);
				});
				it('should evaluate false if some array elements do not match a predicate', function () {
					expect(R.all(shorterThan4, (['one', 'two', 'thre'])))
						.to.be.equal(false);
				});
				it.skip('Dispatches to the all method of the second argument, if present.');
				it.skip('Acts as a transducer if a transformer is given in list position.');
			});

			describe('List> R.allUniq: [a] → Boolean', function () {
				it('should be true for array with no duplicate values', function () {
					expect(R.allUniq([1, 2 ,3, 4])).to.be.equal(true);
				});
				it('should be false for array with any duplicated value', function () {
					expect(R.allUniq([1, 2, 3, 1])).to.be.equal(false);
				});
			});

			describe('List> R.any: (a → Boolean) → [a] → Boolean', function () {
				var shorterThan4 = R.compose(R.flip(R.lt)(4), R.prop('length')),
					longerThan10 = R.compose(R.lt(10), R.prop('length'));

				it('should evaluate true if any one array element matches a predicate', function () {
					expect(shorterThan4('123')).to.be.equal(true);
					expect(R.any(shorterThan4, (['one', 'two', 'three'])))
						.to.be.equal(true);
				});
				it('should evaluate false if none of the array elements match a predicate', function () {
					expect(R.any(longerThan10, (['one', 'two', 'three'])))
						.to.be.equal(false);
				});
				it.skip('Dispatches to the all method of the second argument, if present.');
				it.skip('Acts as a transducer if a transformer is given in list position.');
			});

			describe('Function> R.ap :: [f] → [a] → [f a] aka apply', function () {
				it('should apply a list of functions to every item in the array new array length will be N * current length', function () {
					var result = R.ap([F.qq, F.q], (['one', 'two', 'three']));
					expect(result)
						.to.deep.equal(['"one"', '"two"', '"three"', "'one'", "'two'", "'three'"]);
				});
				it.skip('Dispatches to the ap method of the second argument, if present.');
				it.skip('Also treats functions as applicatives');
			});

			describe('List> R.append: a → [a] → [a]', function () {
				it('should append a single value to an array', function () {
					expect(R.append('tail')([1, 2, 3]))
						.to.deep.equal([1, 2, 3, 'tail']);
				});
				it('should append undefined to an array', function () {
					expect(R.append(void 0)([1, 2, 3]))
						.to.deep.equal([1, 2, 3, void 0]);
				});
			});

			describe('Function> R.apply: (*… → a) → [*] → a', function () {
				it('should convert function of variable parameters into a function of an array', function () {
					expect(R.apply(Math.max)([1, 2, 3]))
						.to.be.equal(3);
				});
			});

			describe('List> R.chain :: (a → [b]) → [a] → [b] aka flatMap', function () {
				it('should duplicate array entries into a new array', function () {
					var duplicate = function (item) { return [item, item]; };

					expect(R.chain(duplicate, [1, 2, 3])).to.deep.equal([1, 1, 2, 2, 3, 3]);
				});
				it('Dispatches to the chain method of the second argument, if present.');
			});

			describe('List> R.concat :: [a] → [a] → [a]', function () {
				it('should concatenate arrays together', function () {
					expect(R.concat(['first', 'second'])(['third'])).to.deep.equal(['first', 'second', 'third']);
					expect(R.concat(['first', void 0])(['third'])).to.deep.equal(['first', void 0, 'third']);
					expect(R.concat(['first'])([])).to.deep.equal(['first']);
					expect(R.concat(['first'])([[]])).to.deep.equal(['first', []]);
				});
			});

			describe('List> R.contains :: a → [a] → Boolean', function () {
				var Thing = function (text) {
					this.stuff = text;
				};
				Thing.prototype.equals = function (that) {
					return this.stuff.toUpperCase() === that.stuff.toUpperCase();
				};

				it('should be true when item is in the list', function () {
					expect(R.contains(5, [1, 2, 6, 5])).to.be.equal(true);
				});
				it('should be false when item is not in the list', function () {
					expect(R.contains(-5, [1, 2, 6, 5])).to.be.equal(false);
				});
				it('should be true when item is in the list (dispatch to .equals method of objects)', function () {
					expect(R.contains(
						new Thing('a'),
						[new Thing('A'),
						new Thing('b'),
						new Thing('f'),
						new Thing('z')])).to.be.equal(true);
				});
			});

			describe('Relation> R.countBy :: (a → String) → [a] → {*}', function () {
				it('should produce a key->count object from values of an array (histogram)', function () {
					var numbers = [1.0, 1.1, 1.2, 2.0, 3.0, 2.2];
					var letters = R.split('', 'abcABCaaaBBc');
					expect(R.countBy(Math.floor)(numbers))
						.to.deep.equal({'1': 3, '2': 2, '3': 1});
					expect(R.countBy(R.toLower)(letters))
						   .to.deep.equal({'a': 5, 'b': 4, 'c': 3});
				});
			});

			// also String> Number → String → String
			describe('List> R.drop :: Number → [a] → [a]', function () {
				it('should drop the first element from list', function () {
					expect(R.drop(1, ['foo', 'bar', 'baz']))
						.to.deep.equal(['bar', 'baz']);
				});
				it('should drop the first two elements from list', function () {
					expect(R.drop(2, ['foo', 'bar', 'baz']))
						.to.deep.equal(['baz']);
				});
				it('should drop the all elements from the list', function () {
					expect(R.drop(3, ['foo', 'bar', 'baz']))
						.to.deep.equal([]);
				});
				it('should drop the all elements from a short list', function () {
					expect(R.drop(4, ['foo', 'bar', 'baz']))
						.to.deep.equal([]);
				});
				it.skip('Returns all but the first n elements of the given transducer/transformer (or object with a drop method). Dispatches to the drop method of the second argument, if present.');
			});

			// also String> Number → String → String
 			describe('List> R.dropLast :: Number → [a] → [a]', function () {
				it('should drop the last element from list', function () {
					expect(R.dropLast(1, ['foo', 'bar', 'baz']))
						.to.deep.equal(['foo', 'bar']);
				});
				it('should drop the last two elements from list', function () {
					expect(R.dropLast(2, ['foo', 'bar', 'baz']))
						.to.deep.equal(['foo']);
				});
				it('should drop the all elements from the list', function () {
					expect(R.dropLast(3, ['foo', 'bar', 'baz']))
						.to.deep.equal([]);
				});
				it('should drop the all elements from a short list', function () {
					expect(R.dropLast(4, ['foo', 'bar', 'baz']))
						.to.deep.equal([]);
				});
				it.skip('Returns all but the first n elements of the given transducer/transformer (or object with a drop method). Dispatches to the drop method of the second argument, if present.');
			});

 			describe('List> R.dropLastWhile :: (a → Boolean) → [a] → [a]', function () {
				it('should drop last elements from a list provided they match a predicate function', function () {
					var lteThree = x => x <= 3;

					expect(R.dropLastWhile(lteThree, [1, 2, 3, 4, 3, 2, 1]))
						.to.deep.equal([1, 2, 3, 4]);
				});
			});

			// also String> String → [Char]
 			describe('List> R.dropRepeats :: [a] → [a]', function () {
				it('should remove consecutive repeats from list', function () {
					expect(R.dropRepeats([1, 1, 1, 2, 3, 4, 4, 2, 2]))
						.to.deep.equal([1, 2, 3, 4, 2]);
				});
				it('Dispatches to the dropRepeats method of the first argument, if present. Acts as a transducer if a transformer is given in list position.');
			});

			// also String> (Char, Char → Boolean) → String → [Char]
 			describe('List> R.dropRepeatsWith :: (a, a → Boolean) → [a] → [a]', function () {
				it('should remove consecutive repeats from list using a comparison function', function () {
					var list = [1, -1, 1, 3, 4, -4, -4, -5, 5, 3, 3];
					expect(R.dropRepeatsWith(R.eqBy(Math.abs), list))
						.to.deep.equal([1, 3, 4, -5, 3]);
				});
				it('Dispatches to the dropRepeatsWith method of the first argument, if present. Acts as a transducer if a transformer is given in list position.');
			});

			// also String> (Char → Boolean) → String → [Char]
 			describe('List> R.dropWhile :: (a → Boolean) → [a] → [a]', function () {
				it('should drop initial elements from a list provided they match a predicate function', function () {
					var lteTwo = x => x <= 2;

					expect(R.dropWhile(lteTwo, [1, 2, 3, 4, 3, 2, 1]))
						.to.deep.equal([3, 4, 3, 2, 1]);
				});
			});

 			describe.skip('List> R.todo :: [a] → [a]', function () {
				it('should ...', function () {
					expect(false).to.deep.equal(true);
				});
			});

		}); // list operations

		describe('set operations', function () {

			describe('Relation> R.difference :: [*] → [*] → [*]', function () {
				it('should return set of items in list 1 which are not in list 2', function () {
					var flipDiff = R.flip(R.difference),
						list1 = [1,4,2,3,2,4],
						list2 = [7,6,5,4,3],
						list3 = [1,2,3,4];
					expect(R.difference(list1, list2))
						.to.deep.equal([1,2]);
					expect(R.difference(list3, list2))
						.to.deep.equal([1,2]);
					expect(R.difference(list2, list3))
						.to.deep.equal([7,6,5]);
					expect(flipDiff(list2, list1))
						.to.deep.equal([1,2]);
					expect(flipDiff(list2, list3))
						.to.deep.equal([1,2]);
					expect(flipDiff(list3, list2))
						.to.deep.equal([7,6,5]);
				});
			});

			describe('Relation> R.differenceWith :: (a → a → Boolean) → [*] → [*] → [*]', function () {
				it('should return set of items in list 1 which are not in list 2', function () {
					var compareProp = function (a, b) {
							return a.A === b.A;
						},
						flipDiff = R.flip(R.differenceWith(compareProp)),
						list1 = [{A:1},{A:4},{A:2},{A:3},{A:2},{A:4}],
						list2 = [{A:7},{A:6},{A:5},{A:4},{A:3}],
						list3 = [{A:1},{A:2},{A:3},{A:4}];

					expect(R.differenceWith(compareProp, list1, list2))
						.to.deep.equal([{A:1},{A:2}]);
					expect(R.differenceWith(compareProp, list3, list2))
						.to.deep.equal([{A:1},{A:2}]);
					expect(R.differenceWith(compareProp ,list2, list3))
						.to.deep.equal([{A:7},{A:6},{A:5}]);
					expect(flipDiff(list2, list1))
						.to.deep.equal([{A:1},{A:2}]);
					expect(flipDiff(list2, list3))
						.to.deep.equal([{A:1},{A:2}]);
					expect(flipDiff(list3, list2))
						.to.deep.equal([{A:7},{A:6},{A:5}]);
				});
			});

			describe.skip('cat> todo :: a → a', function () {
				it('should ...', function () {
					expect(false).to.be.equal(true);
				});
			});

		}); // set operations

	}); // ramda library

	describe('sandwich :: a → a → a → a | a=Number,String', function () {
		it('should curry the sandwich function', function () {
			expect(F.sandwich('"')).to.be.a('function');
			expect(F.sandwich('<')('>')).to.be.a('function');
			expect(F.sandwich('<', '>')).to.be.a('function');
		});

		it('should execute the sandwich function with strings', function () {
			expect(F.sandwich('<', '>', 'html')).to.be.equal('<html>');
		});

		it('should execute the sandwich function with numbers (margins)', function () {
			expect(F.sandwich(10)(5)(42)).to.be.equal(57);
		});

		it('should double quote a string with F.qq', function () {
			expect(F.qq('html')).to.be.equal('"html"');
		});
		it('should single quote a string with F.q', function () {
			expect(F.q('html')).to.be.equal('\'html\'');
		});

	}); // sandwich()

	describe('orderedBullet :: o → String → String → o → String | o = Number, String', function () {
		it('should construct an ordered bullet point', function () {
			expect(F.indexedBullet(') ', 'point number one', 0)).to.be.equal('1) point number one');
			expect(F.numberedBullet('. ', 'point number one', 1)).to.be.equal('1. point number one');
			expect(F.letteredBullet('> ', 'point number seventeen', 'xvii')).to.be.equal('xvii> point number seventeen');
		});
	}); // orderedBullet()

	describe('mapIndexed :: ((a, Number) → b) → [a] → [b]', function () {
		it('should map over an array with the index value to create bullet points', function () {
			expect(F.mapIndexed(F.indexedBullet('. '))(['one', 'two', 'three']))
				.to.deep.equal(['1. one', '2. two', '3. three']);
		});
	}); // mapIndexed()

	describe('suffix :: String → String → String', function () {
		it('should suffix a string with first parameter', function () {
			expect(F.suffix('ing')('function')).to.be.equal('functioning');
			expect(F.prefix('un')('happy')).to.be.equal('unhappy');
		});
	}); // suffix()

	describe.skip('cat> todo :: a → a', function () {
		it('should ...', function () {
			expect(false).to.be.equal(true);
		});
	});
});
}

function defineCode() {

	// impure trace :: String → a → a
	F.trace = R.curry(function (message, thing) {
		console.log(message, thing);
		return thing;
	});

	// sandwich :: a → a → a → a
	// a = anything with an addition operator: Number, String
	F.sandwich = R.curry(function (before, after, value) {
		return before + value + after;
	});
	F.q = F.sandwich('\'', '\'');
	F.qq = F.sandwich('"', '"');

	// orderedBullet :: o → String → String → o → String
	// o: Number or String for bullet separator
	F.orderedBullet = R.curry(function (offset, bullet, string, ordinal) {
		ordinal = offset + ordinal;
		return ordinal + bullet + string;
	});
	F.indexedBullet = F.orderedBullet(1);
	F.numberedBullet = F.orderedBullet(0);
	F.letteredBullet = F.orderedBullet('');

	// mapIndexed :: ((a, Number) → b) → [a] → [b]
	// map over an array of items including the array index
	F.mapIndexed = R.addIndex(R.map);

	// suffix :: a → a → a
	F.suffix = R.flip(R.add);
	F.prefix = R.concat;
} // defineCode()

start();
