'use strict';

var s = require('../lib/support2');
var Task = require('data.task');
var rdebug = require('ramda-debug'),
    _ = rdebug.wrap(require('ramda')),
    IO = s.IO;

// fib browser for test
var localStorage = {};



// Exercise 1
// ==========
// Write a function that add's two possibly null numbers together using Maybe and ap()

// ex1 :: Number -> Number -> Maybe Number
var ex1 = function(x, y) {
    void x; void y;
    // write me
};


// Exercise 2
// ==========
// Now write a function that takes 2 Maybe's and adds them. Use liftA2 instead of ap().

// ex2 :: Maybe Number -> Maybe Number -> Maybe Number
var ex2;



// Exercise 3
// ==========
// Run both getPost(n) and getComments(n) then render the page with both. (the n arg is arbitrary)
var makeComments = _.reduce(function(acc, c) {
    return acc+'<li>'+c+'</li>';
}, '');
var render = _.curry(function(p, cs) {
    return '<div>'+p.title+'</div>'+makeComments(cs);
});

// ex3 :: Task Error HTML
var ex3 = void render;



// Exercise 4
// ==========
// Write an IO that gets both player1 and player2 from the cache and starts the game
localStorage.player1 = 'toby';
localStorage.player2 = 'sally';

var getCache = function(x) {
    return new IO(function() { return localStorage[x]; });
};
var game = _.curry(function(p1, p2) { return p1 + ' vs ' + p2; });

// ex4 :: IO String
var ex4 = void getCache;
void game;




// TEST HELPERS
// =====================

function getPost(i) {
    void i;
    return new Task(function (rej, res) {
        void rej;
        setTimeout(function () { res({ id: i, title: 'Love them futures' }); }, 300);
    });
}

function getComments(i) {
    void i;
    return new Task(function (rej, res) {
        void rej;
        setTimeout(function () {
            res(['This book should be illegal', 'Monads are like space burritos']);
        }, 300);
    });
}

void getPost;
void getComments;

module.exports = {
    ex1: ex1,
    ex2: ex2,
    ex3: ex3,
    ex4: ex4
};
