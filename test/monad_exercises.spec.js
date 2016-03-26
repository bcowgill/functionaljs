'use strict';

var s = require('../lib/support2');
var E = require('./monad_exercises');
var assert = require('chai').assert;
var rdebug = require('ramda-debug'),
    _ = rdebug.wrap(require('ramda')),
   Maybe = s.Maybe,
    either = s.either,
    unsafePerformIO = s.unsafePerformIO;

describe('Monad Exercises', function(){

    it('Exercise 1', function(){
        assert.deepEqual(E.ex1(E.user), Maybe.of('Walnut St'));
    });

    it('Exercise 2', function(){
        assert.equal(E.ex2(undefined).unsafePerformIO(), 'logged monad_exercises.js');
    });

    it('Exercise 3', function(done){
        rdebug.on();
        E.ex3(13).fork(console.log, function (res) {
            assert.deepEqual(res.map(_.prop('post_id')), [13, 13]);
            done();
        });
        rdebug.off();
    });

    var getResult = either(_.identity, unsafePerformIO);
    it('Exercise 4a', function(){
        assert.equal(getResult(E.ex4('notanemail')), 'invalid email <notanemail>');
    });
    it('Exercise 4b', function(){
        assert.equal(getResult(E.ex4('sleepy@grandpa.net')), 'emailed: sleepy@grandpa.net');
    });

});
