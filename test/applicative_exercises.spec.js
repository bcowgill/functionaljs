'use strict';

var s = require('../lib/support2'),
    E = require('./applicative_exercises'),
    rdebug = require('ramda-debug'),
    _ = rdebug.wrap(require('ramda')),
    assert = require('chai').assert,
    Maybe = s.Maybe;
void _;

describe('Applicative Exercises', function(){

    it('Exercise 1a', function(){
        assert.deepEqual(E.ex1(2, 3), Maybe.of(5));
    });
    it('Exercise 1b', function(){
        assert.deepEqual(E.ex1(null, 3), Maybe.of(null));
    });
    it('Exercise 1c', function(){
        assert.deepEqual(E.ex1(2, null), Maybe.of(null));
    });

    it('Exercise 2a', function(){
        assert.deepEqual(E.ex2(Maybe.of(2), Maybe.of(3)), Maybe.of(5));
    });
    it('Exercise 2b', function(){
        assert.deepEqual(E.ex2(Maybe.of(null), Maybe.of(3)), Maybe.of(null));
    });
    it('Exercise 2c', function(){
        assert.deepEqual(E.ex2(Maybe.of(2), Maybe.of(null)), Maybe.of(null));
    });

    it('Exercise 3', function(done){
        E.ex3.fork(console.log, function (html) {
            assert.equal('<div>Love them futures</div>' +
                '<li>This book should be illegal</li>' +
                '<li>Monads are like space burritos</li>', html);
            done();
        });
    });

    it('Exercise 4', function(){
        assert.equal('toby vs sally', E.ex4.unsafePerformIO());
    });

});
