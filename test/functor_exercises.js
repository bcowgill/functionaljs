'use strict';

var s = require('../lib/support2'),
    Task = require('data.task'),
    rdebug = require('ramda-debug'),
    _ = rdebug.wrap(require('ramda')),
    Identity = s.Identity,
    Maybe = s.Maybe,
    Left = s.Left,
    Right = s.Right,
    either = s.either,
    IO = s.IO;

// Exercise 1
// ==========
// Use _.add(x,y) and _.map(f,x) to make a function that increments a value inside a functor

var ex1 = _.map(_.add(1));



// Exercise 2
// ==========
// Use _.head to get the first element of the list
var xs = Identity.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);
void xs;
var ex2 = _.map(_.head);



// Exercise 3
// ==========
// Use safeProp and _.head to find the first initial of the user
var safeProp = _.curry(function (x, o) { return Maybe.of(o[x]); });

var user = { id: 2, name: 'Albert' };
void user;

var ex3 = _.compose(_.map(_.head), safeProp('name'));



// Exercise 4
// ==========
// Use Maybe to rewrite ex4 without an if statement

/*
var ex4 = function (n) {
    /!* jshint maxcomplexity: 2 *!/
    if (n) { return parseInt(n); }
};
*/

var maybeNumber = _.compose(
    Maybe.of,
    _.cond([
        [_.equals(null), _.always(null)],
        [isNaN, _.always(null)],
        [_.T, _.identity]
    ]),
    parseInt
);

var ex4 = maybeNumber;



// Exercise 5
// ==========
// Write a function that will getPost then _.toUpper the post's title

// functions returning a Task prefix 'will' or 'tryTo'

// getPost :: Int -> Future({id: Int, title: String})
var getPost = function (i) {
    return new Task(function(rej, res) {
        void rej;
        setTimeout(function(){
            res({id: i, title: 'Love them futures'});
        }, 300);
    });
};

var ucTitle = _.compose(
    _.toUpper,
    _.prop('title')
);

var ex5 = _.compose(
    s.breakPt('break ex5 before map'),
    _.map(
        ucTitle
    ),
    s.breakPt('break ex5 before getPost'),
    getPost
);



// Exercise 6
// ==========
// Write a function that uses checkActive() and showWelcome() to grant access or return the error

var showWelcome = _.compose(
    _.add( 'Welcome '),
    _.prop('name')
);

var checkActive = function(user) {
    /* jshint maxcomplexity: 2 */
    return user.active ?
        Right.of(user) :
        Left.of('Your account is not active');
};
var ex6 = _.compose(
    _.map(showWelcome),
    checkActive
);



// Exercise 7
// ==========
// Write a validation function that checks for a length > 3. It should return
// Right(x) if it is greater than 3 and Left('You need > 3') otherwise

var ex7 = function(x) {
    /* jshint maxcomplexity: 2 */
    return x.length > 3 ?
        Right.of(x) :
        Left.of('You need > 3');
};



// Exercise 8
// ==========
// Use ex7 above and either as a functor to save the user if they are valid
// or return the error message string. Remember either's two arguments must
// return the same type.

var save = function(x) {
    return new IO(function() {
        console.log('SAVED USER!');
        return x + '-saved';
    });
};
var discard = function (x) {
    return new IO(function () {
        return x;
    });
};
void discard;
var ex8 = _.compose(
    either(
        discard,
        save
    ),
    ex7
);

module.exports = {
    ex1: ex1,
    ex2: ex2,
    ex3: ex3,
    ex4: ex4,
    ex5: ex5,
    ex6: ex6,
    ex7: ex7,
    ex8: ex8,
    maybeNumber: maybeNumber
};
