/* jshint -W003 */ // function was used before it was defined
'use strict';

var s = require('../lib/support2');
var Task = require('data.task');
var rdebug = require('ramda-debug'),
    _ = rdebug.wrap(require('ramda')),
    IO = s.IO,
    Maybe = s.Maybe;

// fib browser for test
var localStorage = {};



// Exercise 1
// ==========
// Write a function that add's two possibly null numbers together using Maybe and ap()

// ex1 :: Number -> Number -> Maybe Number
var ex1 = function(x, y) {
    var functor = Maybe.of;
    return functor(_.add).ap(functor(x)).ap(functor(y));
//    return Maybe.of(x).map(_.add).ap(Maybe.of(y));
};


// Exercise 2
// ==========
// Now write a function that takes 2 Maybe's and adds them. Use liftA2 instead of ap().

// ex2 :: Maybe Number -> Maybe Number -> Maybe Number
var ex2 = _.lift(_.add);
// _.liftN(2)(_.add);
// s.liftA2(_.add);



// Exercise 3
// ==========
// Run both getPost(n) and getComments(n) then render the page with both. (the n arg is arbitrary)
// makeComments :: [String] → String
var makeComments = _.reduce(function(acc, c) {
    return acc+'<li>'+c+'</li>';
}, '');

// render :: { title: String } -> [String] -> String
var render = _.curry(function(p, cs) {
    return '<div>'+p.title+'</div>'+makeComments(cs);
});

var taskRender = _.lift(render);

// ex3 :: Task Error HTML
var ex3 = (function (i) {
    return taskRender(
        getPost(i),
        getComments(i)
    );
})(42);




// Exercise 4
// ==========
// Write an IO that gets both player1 and player2 from the cache and starts the game
localStorage.player1 = 'toby';
localStorage.player2 = 'sally';

// getCache :: String -> IO LocalStorage
var getCache = function(x) {
    return new IO(function() { return localStorage[x]; });
};
// game :: String -> String -> String
var game = _.curry(function(p1, p2) { return p1 + ' vs ' + p2; });

var getPlayersIO = _.lift(game)(getCache('player1'), getCache('player2'));

// ex4 :: IO String
var ex4 = getPlayersIO;




// TEST HELPERS
// =====================

// getPost :: Number -> Task Error { id: Number, title: String }
function getPost(i) {
    void i;
    return new Task(function (rej, res) {
        void rej;
        setTimeout(function () {
                res({ id: i, title: 'Love them futures' });
            }, Math.floor(300 * Math.random())
        );
    });
}

// getPost :: Number -> Task Error [String]
function getComments(i) {
    void i;
    return new Task(function (rej, res) {
        void rej;
        setTimeout(function () {
            res(['This book should be illegal', 'Monads are like space burritos']);
        }, Math.floor(300 * Math.random()));
    });
}

module.exports = {
    ex1: ex1,
    ex2: ex2,
    ex3: ex3,
    ex4: ex4
};
