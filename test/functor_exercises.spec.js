'use strict';

var rsigs = require('ramda-debug'),
    s = rsigs.wrap(require('../lib/support2')),
    E = rsigs.wrap(require('./functor_exercises')),
    assert = require('chai').assert,
    Identity = s.Identity,
    Maybe = s.Maybe,
    Left = s.Left,
    Right = s.Right;

describe('Functor Exercises', function(){

    it('Exercise 1', function(){
        assert.deepEqual(E.ex1(Identity.of(2)), Identity.of(3));
    });

    it('Exercise 2', function(){
        rsigs.on();
        var xs = Identity.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);
        assert.deepEqual(E.ex2(xs), Identity.of('do'));
        rsigs.off();
    });

    it('Exercise 3a', function(){
        var user = { id: 2, name: 'Albert' };
        assert.deepEqual(E.ex3(user), Maybe.of('A'));
        assert.equal(E.ex3(user).isNothing(), false);
    });

    it('Exercise 3b', function(){
        var nouser = { id: 3 };
        assert.equal(E.ex3(nouser).isNothing(), true);
    });

    it('Exercise 3c', function(){
        var nouser = { id: 3 };
        assert.equal(E.ex3(nouser).isNothing(), true);
    });

    it('Exercise 4.a', function(){
        assert.equal(s.notrace('4.a', E.maybeNumber('4')).isNothing(), false);
        assert.deepEqual(E.maybeNumber('4'), Maybe.of(4));
    });
    it('Exercise 4.b', function(){
        assert.equal(E.maybeNumber().isNothing(), true);
    });
    it('Exercise 4.c', function(){
        assert.equal(s.notrace('4.c', E.maybeNumber()).isNothing('nonumber'), true);
    });
    it('Exercise 4.d', function(){
        assert.equal(s.notrace('4.d', E.maybeNumber('')).isNothing(), true);
    });
    it('Exercise 4.e', function(){
        assert.equal(s.notrace('4.e', E.maybeNumber(0)).isNothing(), false);
    });

    it('Exercise 4a', function(){
        assert.deepEqual(E.ex4('4'), Maybe.of(4));
        assert.equal(E.ex4('4').isNothing(), false);
    });
    it('Exercise 4b', function(){
        assert.equal(E.ex4().isNothing(), true);
    });
    it('Exercise 4c', function(){
        assert.equal(s.notrace('4c', E.ex4()).isNothing('nonumber'), true);
    });
    it('Exercise 4d', function(){
        assert.equal(s.notrace('4d', E.ex4('')).isNothing(), true);
    });
    it('Exercise 4e', function(){
        assert.equal(s.notrace('4e', E.ex4(0)).isNothing(), false);
    });

    it('Exercise 5', function(done){
        E.ex5(13).fork(console.log, function(res){
            assert.deepEqual(res, 'LOVE THEM FUTURES');
            done();
        });
    });

    it('Exercise 6', function(){
        assert.deepEqual(
            E.ex6({active: false, name: 'Gary'}),
            Left.of('Your account is not active')
        );
        assert.deepEqual(
            E.ex6({active: true, name: 'Theresa'}),
            Right.of('Welcome Theresa')
        );
    });

    it('Exercise 7', function(){
        assert.deepEqual(E.ex7('fpguy99'), Right.of('fpguy99'));
        assert.deepEqual(E.ex7('...'), Left.of('You need > 3'));
    });

    it('Exercise 8', function(){
        assert.deepEqual(E.ex8('fpguy99').unsafePerformIO(), 'fpguy99-saved');
        assert.deepEqual(E.ex8('...').unsafePerformIO(), 'You need > 3');
    });
});
