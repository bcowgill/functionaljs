'use strict';

var s = require('../lib/support2');
var path = require('path');
var Task = require('data.task');
var rdebug = require('ramda-debug'),
    _ = rdebug.wrap(require('ramda')),
    IO = s.IO,
    Right = s.Right,
    Left = s.Left,
    Maybe = s.Maybe;

// Exercise 1
// ==========
// Use safeProp and map/join or chain to safely get the street name when given a user

var safeProp = _.curry(function (x, o) { return Maybe.of(o[x]); });
var user = {
    id: 2,
    name: 'albert',
    address: {
        street: {
            number: 22,
            name: 'Walnut St'
        }
    }
};

// ex1 :: User -> String
var ex1 = _.compose(
    s.chain(safeProp('name')),
    s.chain(safeProp('street')),
    safeProp('address')
);


// Exercise 2
// ==========
// Use getIOPath to get the filename,
// remove the directory so it's just the file,
// then purely log it.

// getIOPath :: * -> IO String
var getIOPath = function() {
    return new IO(function(){ return __filename; });
};

var getFileName = _.compose(
    _.last,
    _.split(path.sep)
);

// pureLog :: String -> IO String
var pureLog = function(x) {
    return new IO(function(){
        console.log(x);
        return 'logged ' + x; // for testing w/o mocks
    });
};

// ex2 :: * -> String
var ex2 = _.compose(
    s.chain(
        _.compose(
            pureLog,
            getFileName
        )
    ),
    // IO String
    getIOPath
);



// Exercise 3
// ==========
// Use getPost() then pass the post's id to getComments().

// getPost :: Number -> Task Nothing Article
var getPost = function(i) {
    return new Task(function (rej, res) {
        void rej;
        setTimeout(function () {
            res({ id: i, title: 'Love them tasks' }); // THE POST
        }, 300);
    });
};

// getComments :: Number -> Task Nothing [Comment]
var getComments = function(i) {
    return new Task(function (rej, res) {
        void rej;
        setTimeout(function () {
            res([
                {
                    post_id: i,
                    body: 'This book should be illegal'
                }, {
                    post_id: i,
                    body:'Monads are like smelly shallots'
                }
            ]);
        }, 300);
    });
};

// ex3 :: Number -> [Comment]
var ex3 = _.compose(
    s.chain(
        _.compose(
            getComments,
            // Bonus use safeProp!
            _.prop('id')
        )
    ),
    getPost
);




// Exercise 4
// ==========
// Use validateEmail, addToMailingList and emailBlast to implement ex4's type signature.
// It should safely add a new subscriber to the list, then email everyone with this happy news.

// addToMailingList :: Email -> IO [Email]
var addToMailingList = (function (list) {
    return function (email) {
        return new IO(function () {
            list.push(email);
            return list;
        });
    };
})([]);

// emailBlast :: [Email] -> IO String
function emailBlast (list) {
    return new IO(function () {
        console.log('email blasted', list.join(','));
        return 'emailed: ' + list.join(','); // for testing w/o mocks
    });
}

void addToMailingList;
void emailBlast;
// validateEmail :: Email -> Either String Email
var validateEmail = function (x) {
    /* jshint maxcomplexity: 2 */
    return x.match(/\S+@\S+\.\S+/) ? (new Right(x)) : (new Left('invalid email <' + x + '>'));
};

// ex4 :: Email -> Either String (IO String)
var ex4 = _.compose(
    _.map(
        _.compose(
            s.chain(emailBlast),
            addToMailingList
        )
    ),
    validateEmail
);


module.exports = {ex1: ex1, ex2: ex2, ex3: ex3, ex4: ex4, user: user};
