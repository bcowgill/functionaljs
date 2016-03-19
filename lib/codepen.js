/* jshint -W003 */
/* jshint -W030 */
/* jshint -W110 */
/* jshint -W101 */
/* jshint  maxparams: 7 */
/* global R, chai, describe, it, mocha */
'use strict';

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
	describe('rambda library', function () {
		describe('simple operations', function () {
			it('should test this next', function () {
				var keys = Object.keys(R);

				expect([keys.length,keys[19]]).to.be.deep.equal([]);
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
			
		});
				
		describe('functional operations', function () {
			describe('Function> R.__', function () {
				it('should have R.__ placeholder functional', function () {
					expect(Object.keys(R.__)).to.be.deep.equal(['@@functional/placeholder']);
				});
			});

			describe('Logic> allPass :: [(*… → Boolean)] → (*… → Boolean)', function () {
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
			
			describe('Logic> anyPass :: [(*… → Boolean)] → (*… → Boolean)', function () {
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

		});


		describe('object operations', function () {
			describe('Object> R.assoc: String → a → {k: v} → {k: v}', function () {
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
						.to.be.deep.equal({debug: true, name: 'fred', ref: ['referenced'], girth: 'huge'});
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
						.to.be.deep.equal({view: {logger: {debug: true}}, name: 'fred', ref: ['referenced'], girth: 'huge'});
					expect(objNew.ref).to.be.equal(obj.ref);
				});
			});

		});

		describe('list operations', function () {
			describe('Function> R.addIndex: ((a … → b) … → [a] → *) → (a …, Int, [a] → b) … → [a] → *)', function () {
				it('should map over an array with the index value to create bullet points', function () {
					expect(F.mapIndexed(F.indexedBullet('. '))(['one', 'two', 'three']))
						.to.be.deep.equal(['1. one', '2. two', '3. three']);
				});
			});

			describe('List> R.adjust: (a → a) → Number → [a] → [a]', function () {
				it('should adjust a value in a list by index', function () {
					expect(R.adjust(F.suffix(' day'))(1)(['one', 'two', 'three']))
						.to.be.deep.equal(['one', 'two day', 'three']);
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
						.to.be.deep.equal([1, 2, 3, 'tail']);
				});
				it('should append undefined to an array', function () {
					expect(R.append(void 0)([1, 2, 3]))
						.to.be.deep.equal([1, 2, 3, void 0]);
				});
			});

			describe('Function> R.apply: (*… → a) → [*] → a', function () {
				it('should convert function of variable parameters into a function of an array', function () {
					expect(R.apply(Math.max)([1, 2, 3]))
						.to.be.equal(3);
				});
			});

		});
		
	});
	
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
		
	});
	
	describe('orderedBullet :: o → String → String → o → String | o = Number, String', function () {
		it('should construct an ordered bullet point', function () {
			expect(F.indexedBullet(') ', 'point number one', 0)).to.be.equal('1) point number one');
			expect(F.numberedBullet('. ', 'point number one', 1)).to.be.equal('1. point number one');
			expect(F.letteredBullet('> ', 'point number seventeen', 'xvii')).to.be.equal('xvii> point number seventeen');
		});
	});

	describe('mapIndexed :: ((a, Number) → b) → [a] → [b]', function () {
		it('should map over an array with the index value to create bullet points', function () {
			expect(F.mapIndexed(F.indexedBullet('. '))(['one', 'two', 'three']))
				.to.be.deep.equal(['1. one', '2. two', '3. three']);
		});
	});
			
	describe('suffix :: String → String → String', function () {
	    it('should suffix a string with first parameter', function () {
			expect(F.suffix('ing')('function')).to.be.equal('functioning');
			expect(F.prefix('un')('happy')).to.be.equal('unhappy');
		});	
	});
	
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
}

start();
