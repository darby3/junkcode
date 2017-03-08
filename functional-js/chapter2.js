// Requires.
var _ = require('underscore');

// Pretty print errors.
require('pretty-error').start();

// minor utilities

/**
 * Separator.
 */
function sep(text) {
  console.log('');
  console.log(['-----', text].join(' '));
}

/**
 * For use when listing items in an array via .forEach
 */
function logEach(item, index) {
  console.log(index, '---', item);
}
function logEachAP(item, index) {
  console.log(index, '---', arrayPrint(item));
}

/**
 * Maybe it's an array?
 */
function arrayPrint(el) {
  if (Array.isArray(el)) {
    return '[ ' + el + ' ]';
  } else {
    return el
  }
}

// Previous functions

function splat(fun) {
  return function(array) {
    return fun.apply(null, array);
  };
}

var addArrayElements = splat(function(x, y) {
  return x + y;
});

function unsplat(fun) {
  return function() {
    return fun.call(null, _.toArray(arguments));
  };
}

var joinElements = unsplat(function(array) {
  return array.join(' ');
});

var listAllElements = unsplat(function(array) {
  array.forEach(function(item, index) {
    console.log(index + ' -- ' + item)
  })
})

function fail(thing) {
  throw new Error(thing);
}

function warn(thing) {
  console.log(["WARNING:", thing].join(' '));
}

function note(thing) {
  console.log(["NOTE:", thing].join(' '));
}

function parseAge(age) {
  if (!_.isString(age)) {
    fail("Expecting string");
  };

  var a;

  note("Attempting to parse an age.");
  a = parseInt(age, 10);

  if (_.isNaN(a)) {
    warn(['Could not parse age:', age].join(' '));
    a = 0;
  }

  return a;
}

function isIndexed(data) {
  return _.isArray(data) || _.isString(data);
}

function nth(a, index) {
  if (!_.isNumber(index)) {
    fail("Expected a number as the index");
  };

  if (!isIndexed(a)) {
    fail("Not supported on non-indexed type");
  };

  if ((index < 0) || (index > a.length - 1)) {
    fail("Index value is out of bounds");
  };

  return a[index];
}

function second(a) {
  return nth(a, 1);
}

function lessOrEqual(x, y) {
  return x <= y;
}

function comparator(pred) {
  return function(x, y) {
    if (truthy(pred(x, y))) {
      return -1;
    } else if (truthy(pred(y, x))) {
      return 1;
    } else {
      return 0;
    }
  }
}

function lameCSV(str) {
  return _.reduce(str.split('\n'), function(table, row) {
    table.push(_.map(row.split(','), function(c) {
      return c.trim();
    }));
    return table;
  }, [])
}

function selectNames(table) {
  return _.rest(_.map(table, _.first))
}

function selectAges(table) {
  return _.rest(_.map(table, second));
}

function selectHairColor(table) {
  return _.rest(_.map(table, function(row) {
    return nth(row, 2);
  }))
}

var mergeResults = _.zip;

function existy(x) {
  return x != null;
}

function truthy(x) {
  return (x !== false) && existy(x);
}

function doWhen(cond, action) {
  if (truthy(cond)) {
    return action();
  } else {
    return undefined;
  }
}

function executeIfHasField(target, name) {
  return doWhen(existy(target[name]), function() {
    var result = _.result(target, name);
    console.log(['The result is', result].join(' '));
    return result;
  })
}

/**
 * 
 * Chapter 2 - First-class Functions and Applicative Programming
 * 
 */

/**
 *
 * TO summarize an item or two from the book:
 * 
 * A functional language is one that facilitates the use and creation of first-
 * class functions. First-class means something is a value, and it can go where
 * other values can go.
 * 
 * Numbers are first-class. Functions are like numbers. They can be stored
 * pretty much anywhere and passed back and forth as values. They can be passed
 * in to other functions, or returned from functions as return values: this
 * makes for higher-order functions (functions that take and/or return
 * functions).
 * 
 */

// Example higher-order function: _.each

// sep('higher-order function example');

var terms = ['whiskey', 'tango', 'foxtrot'];

// _.each(terms, function(word) {
//   console.log(word.charAt(0).toUpperCase() + word.substr(1));
// });

/**
 *
 * Applicative programming: when function (A) is supplied to function (B) as an
 * argument so function (B) can invoke it.
 *
 * Three 'canonical' examples: map, reduce, filter.
 *
 * - map: takes a collection, calls a function on each element, and returns a
 *   new collection ("a maps to x, b maps to y, c maps to z")
 *
 * - reduce: takes each element, runs a function on it, and passes the value
 *   forward (iterative reduction of collection down to one value) (start with
 *   a, make it into a', pass it forward; combine a' and b into ab'; ab' forward
 *   into c becomes abc'; etc)
 *
 * - filter: uses a predicate function to pass or not pass items in a collection
 *   into a new collection ("yes, no, no, yes, yes")
 * 
 */

var nums = [1,2,3,4,5];

function doubleAll(array) {
  return _.map(array, function(n) {
    return n*2;
  })
}

function average(array) {
  var sum = _.reduce(array, function(a, b) {
    return a + b;
  });

  return sum / _.size(array);
}

function onlyEvens(array) {
  return _.filter(array, function(n) {
    return n % 2 === 0;
  })
}

// sep('applicative programming');

// console.log("nums -- " + nums);

// sep('double all');
// doubleAll(nums).forEach(logEach);
// nums.forEach(logEach);

// sep('average');
// console.log("average(nums) -- " + average(nums));

// sep('only evens');
// console.log("onlyEvens(nums) -- " + onlyEvens(nums));

/**
 *
 * Collection-centric programming: a 'consistent processing idiom'. So like an
 * array and an object are both collections, but the latter is a collection of
 * key/value pairs instead of 'just' values.
 *
 * So you can ultimate use _.map to deal with the value, the key, and the
 * collection itself:
 * 
 */

var coolObject = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5
}

// sep('collection-centric programming');

// sep('map');

// _.map(coolObject, function(value, key, collection) {
//   return [key, value, _.keys(collection)];
// }).forEach(logEach);

// sep('filter');

// _.filter(coolObject, function(value, key) {
//   return (value <= 2) || (key === 'd');
// }).forEach(logEach);

/** 
 *
 * _.reduceRight is like _.reduce but it works in the opposite direction.
 * 
 */

var nums = [ 100, 2, 25 ];

function div(x, y) {
  return x / y;
}

// sep('reducing');

// console.log("_.reduce(nums, div) -- " + _.reduce(nums, div));
// console.log("_.reduceRight(nums, div) -- " + _.reduceRight(nums, div));

// And then we do fun stuff with it:

function allOf() {
  return _.reduceRight(arguments, function (truth, f) {
    return truth && f();
  }, true);
}

function anyOf() {
  return _.reduceRight(arguments, function (truth, f) {
    return truth || f();
  }, false);
}

function T() {
  return true;
}

function F() {
  return false;
}

// sep('using reduceRight to check t/f values of many things');

// console.log("allOf() -- " + allOf());
// console.log("allOf(T, T) -- " + allOf(T, T));
// console.log("allOf(T, T, T, T, F) -- " + allOf(T, T, T, T, F));

// sep();

// console.log("anyOf(F, F, F) -- " + anyOf(F, F, F));
// console.log("anyOf(F, T) -- " + anyOf(F, T));
// console.log("anyOf() -- " + anyOf());

/*===============================================================
=            Why does that need to be a reduceRight?            =
===============================================================*/

function allOfLeft() {
  return _.reduce(arguments, function (truth, f) {
    return truth && f();
  }, true);
}

function anyOfLeft() {
  return _.reduce(arguments, function (truth, f) {
    return truth || f();
  }, false);
}

// sep('using reduceRight to check t/f values of many things from the left');

// console.log("allOfLeft() -- " + allOfLeft());
// console.log("allOfLeft(T, T) -- " + allOfLeft(T, T));
// console.log("allOfLeft(T, T, T, T, F) -- " + allOfLeft(T, T, T, T, F));

// sep();

// console.log("anyOfLeft(F, F, F) -- " + anyOfLeft(F, F, F));
// console.log("anyOfLeft(F, T) -- " + anyOfLeft(F, T));
// console.log("anyOfLeft() -- " + anyOfLeft());

// These come up the same. I'm not certain I see the difference/need?

/**
 *
 * Update: Missed the footnote that makes it clear that, nope, it doesn't need
 * to be reduceRight, just an illustration purposes kind of thing. Carry on!
 *
 */

/*=================================
=            End aside            =
=================================*/

/**
 *
 * Some other underscore applicative functions looked at here:
 *
 * _.find (get the first matching element)
 * _.reject (the opposite of _.filter)
 * _.all (true if all are true on the predicate)
 * _.any (trye is any are true on the predicate)
 * _.sortBy, _.groupBy, _.countBy
 *
 * We note in here that reject is like reversing the truthiness of filter's
 * predicate; a function that can do that is like so:
 *
 */

function complement(pred) {
  return function() {
    return !pred.apply(null, _.toArray(arguments));
  };
}

/**
 *
 * Which is to say, complement takes a function (A) and then returns a function
 * (B). The returned function will give an array of arguments to the original
 * predicate function (A) via the apply method (we make sure the arguments are
 * an array via toArray), and then reverses whatever the result is.
 *
 */

// sep();

// console.log("_.filter(['a', 'b', 3, 'd'], complement(_.isNumber)) -- " + 
//              _.filter(['a', 'b', 3, 'd'], complement(_.isNumber)));

var elementArray = ['a', 'b', 'c', 45, 'guppy'];

// console.log(
//   "_.filter(elementArray, complement(_.isString)) -- " + 
//    _.filter(elementArray, complement(_.isString))
// );

/**
 *
 * Definining applicative functions. First we start with a couple functions that
 * use other functions but aren't applicative because they don't receive the
 * functions as arguments. And then we move on to mapcat which is and does.
 *
 */

function cat() {
  var head = _.first(arguments);

  if (existy(head)) {
    return head.concat.apply(head, _.rest(arguments));
  } else {
    return [];
  }
}

function construct(head, tail) {
  return cat([head], _.toArray(tail))
};

// sep('cat');

// console.log(
//   "cat([1,2,3], [4,5], [6,7,8]) -- " + 
//    cat([1,2,3], [4,5], [6,7,8])
// );

// console.log(
//   "existy(null) -- " + 
//    existy(null)
// );

// console.log(
//   "cat(null, 'x', 'y', 'abacus') -- " + 
//    cat(null, 'x', 'y', 'abacus')
// );

// var newCoolArray = cat(['a','b','c'], ['x','y','z']);

// console.log(
//   "newCoolArray -- " + 
//    newCoolArray
// );

// var newCoolArray = construct(42, [1,2,3]);

// console.log(
//   "newCoolArray -- " + 
//    newCoolArray
// );

// var newCoolArray = construct([42], [1,2,3]);

// console.log(
//   "newCoolArray -- " + 
//    newCoolArray
// );

// console.log(
//   "Array.isArray(construct(42, [1,2,3])) -- " + 
//    Array.isArray(construct(42, [1,2,3]))
// );

function mapcat(fun, coll) {
  return cat.apply(null, _.map(coll, fun));
}

// var someThing = mapcat(function(e) {
//   return construct(e, ['-']);
// }, [1,2,3]);

// console.log(
//   "someThing -- " + 
//    someThing
// );

// someThing.forEach(logEach);

// sep('someThingElse');

// var someThingElse = mapcat(function(e) {
//   return [e, e*2, [e*4, e*8]];
// }, [1, 2, 3]);

// someThingElse.forEach(logEach);

// sep('someThingElseElse');

// var someThingElseElse = mapcat(function(e) {
//   return [e, e*2, [e*4, e*8]];
// }, [[1, 2], 3]);

// someThingElseElse.forEach(logEach);

/**
 *
 * Basically above we are:
 *
 * mapcat is taking a function (A) and a collection. 
 * 
 * It's mapping the collection through the function (A), returning a new array.
 * The array is passed through cat(), which concats the arguments into an array.
 * In our someThing case, our mapping function (A) is construct(), which itself
 * is returning an array. So the mapping function returns an array of arrays,
 * which our mapcat function is then concatting into a simpler array.
 * (Flattening by a level, as the book says.)
 *
 * Uh, I have absolutely no idea right now why or how I would use this. Is
 * probably why I am having trouble wrapping my head around it.
 *
 * But of course, the book goes on with butLast() and interpose().
 *
 */

function butLast(coll) {
  return _.toArray(coll).slice(0, -1);
}

function interpose(inter, coll) {
  return butLast(mapcat(function(e) {
    return construct(e, [inter]);
  }, coll))
};

// sep('newArrayThing');
// var newArrayThing = interpose(",", [1,2,3]);
// newArrayThing.forEach(logEach);

// sep('newArrayThing');
// var newArrayThing = interpose(",", ['apples', 'oranges', 'pears']);
// newArrayThing.forEach(logEach);

/**
 *
 * Which is like, interpose takes a collection and something to interpose. Down
 * a few levels, we are mapcatting the collection with the interposed element.
 * So our construct function is using the cat function to make a bunch of
 * arrays, and then mapcat is taking those arrays and flattening them out a
 * level into another array. That array of values gets passed up through
 * butLast, which gives us a copy of the array, minus one element off the end.
 *
 * So the chain looks like:
 *
 * return construct(e, [inter]) takes our head (e) as an [ array ], and our
 * [inter] (which is an array like five times over by the time we get out). it's
 * using cat to concat them into a new array, [e, inter]. We do this for each e
 * in the coll, so we wind up with like 
 * 
 * [ [e1, inter], [e2, inter], [e3, inter] ]
 *
 * but mapcat also references cat, in order to concat the array of elements
 * (arrays) into a single array, (concatting all the elements into the head one
 * by one) so we wind up with something like
 *
 * [ e1, inter, e2, inter, e3, inter ]
 *
 * which gets piped through butLast to drop the last element:
 * 
 * [ e1, inter, e2, inter, e3 ]
 *
 * ...is more or less the gist of it, I think.
 *
 * this would probably look better if I had arrays looking like arrays in the
 * node console outputs.
 * 
 */

/*=====================================
=            Uhm mayyyyybe            =
=====================================*/

// sep('arrayPrint');

// console.log(
//   "arrayPrint('abacus') -- " + 
//    arrayPrint('abacus')
// );

// console.log(
//   "arrayPrint([1,2,3]) -- " + 
//    arrayPrint([1,2,3])
// );

// console.log(
//   "[1,2,3] -- " + 
//    [1,2,3]
// );

/*================================
=            Hmmm end            =
================================*/

/**
 *
 * There's a bunch of underscore here, to talk about data-thinking, and using
 * objects as, essentially, manipulatable key/value stores.
 *
 * Functions referenced include:
 *
 * _.keys 
 * _.values
 * _.pluck (array of values for given key)
 * _.pairs (array of arrays of key/value pairs)
 * _.object (convert array to object)
 * _.invert (flip keys and values)
 * _.defaults (ensure selected keys have safe values)
 * _.omit (give me an object without these keys)
 * _.pick (give me an object with only these keys)
 * _.findWhere (first object with these key/value pairs)
 * _.where (all objects with these key/value pairs)
 * 
 */


/**
 *
 * Then we start getting into "table"-life data, with arrays of JS objects being
 * sort of similar to an SQL table, and dealing with how the abstractions can
 * change (but we want the abstractions to remain consistent).
 * 
 */

// sample array of js objects

var library = [
  { title: 'SCIP', isbn: '010101444', ed: 1 },
  { title: 'SCIP', isbn: '010101777', ed: 2 },
  { title: 'Joy of Clojure', isbn: '256245309', ed: 1 },
];

// So you can do _.pluck to get all the titles, but it's a different abstraction
// than the original table idea. Because now we have a simple array of strings,
// instead of objects like we had originally. Basically..

// console.log(
//   "_.pluck(library, 'title') -- " + 
//    _.pluck(library, 'title')
// );

// so the project function helps us with that:

function project(table, keys) {
  return _.map(table, function(obj) {
    return _.pick.apply(null, construct(obj, keys));
  })
}

// Remembering that we're feeding an array of arguments to _.pick in order to
// get an object back:

// console.dir(_.pick(library[0], [ 'isbn', 'ed' ]));

// And we're using apply and construct to make an array of arguments that we
// feed into pick, namely, in this case, each successive object from the
// original table (which is being passed in successively via _.map) and the set
// of keys that we pass in when we invoke the function.

// So we can get something like this:

var editionResults = project(library, [ 'title', 'isbn' ]);
// editionResults.forEach(logEach);

// Since we're keeping the abstraction in place we can keep processing the data,
// as we know it's basic structure:

var isbnResults = project(editionResults, ['isbn']);
// isbnResults.forEach(logEach);

// And then when we just need the data in some other format we can grab it like:

// console.log(
//   "_.pluck(isbnResults, 'isbn') -- " + 
//    _.pluck(isbnResults, 'isbn')
// );


/*====================================
=            Worth noting            =
====================================*/

/**
 *
 * I'm writing functions out a lot here because it helps me mentally trace how
 * the data is being transformed and passed through them. The ultimate goal of
 * course is to bury the functions somewhere and just use then to do work. The
 * 'implementation details' are swept out of site.
 *
 * That said, I'm trying to think ahead as well to the need to come up with
 * functions like this on one's own: to think through the logic of how to nest
 * all these functions within each other. I'm only scratching the surface on
 * that. That feels like a longer part of the project in waiting.
 *
 *
 * Also randomly jumping back in later to add: documenting these functions would
 * be very important, in order to remember how to use them. (I get a little ways
 * away from the definitions and I forget if they take arrays, objects, etc...)
 *
 */

/*=================================
=            End aside            =
=================================*/


/**
 *
 * Now we start looking at using a SELECT...AS type approach. We start with a
 * function that helps us rename keys on the fly.
 *
 */

function rename(obj, newNames) {
  return _.reduce(newNames, function(o, nu, old) {
    if (_.has(obj, old)) {
      o[nu] = obj[old];
      return o;
    } else {
      return o;
    }
  }, _.omit.apply(null, construct(obj, _.keys(newNames))));
}

// Where:
// 
// = we are feeding an object to rename along with an object of the form 
//   { oldName: newName, ... }
// 
// - we start with an object that removes any of the keys we're planning on
//   rename
//   
// - then we're going to run through the newNames object, add the new keyname to
//   the new object, and then assign it the value of the old key from the old
//   object
//   
// There's a bit above that I didn't follow until I saw the as function below:
// the check on the old object to see if it has the old key at all; this way we
// can pass in a newNames object that has more names than are necessarily needed
// on the new object. I think.

// console.dir(rename({a: 1, b: 2 }, {'a': 'AAA'}) );

// And then we can implement the "as" functionality:

function as(table, newNames) {
  return _.map(table, function(obj) {
    return rename(obj, newNames);
  })
}

// Where we're simply mapping one array to a new array and piping each object
// through the rename function, passing in the row (object) and the newNames
// object each time. And we're safe from breaking it if we pass in newNames that
// don't exist in the table.

// sep('as 1');
// as(library, {ed: 'edition'}).forEach(logEach);

// sep('as 2');
// as(library, {
//   title: 'Book Title', 
//   somethingElse: 'Some other title'
// }).forEach(logEach);

// And by 'staying in the same abstraction' we can pipe the data through each
// function:

var newTableResult = project(as(library, {ed: 'edition'}), ['edition']);
// newTableResult.forEach(logEach);

// And then we can get to 'WHERE' functionality with a 'restrict' function:

function restrict(table, pred) {
  return _.reduce(table, function(newTable, obj) {
    if (truthy(pred(obj))) {
      return newTable;
    } else {
      return _.without(newTable, obj);
    }
  }, table);
};

// ... so you start with the table and then reduce it down to itself minus
// anything that fails the predicate function test, a la:

var noFirstEds = restrict(library, function(book) {
  return book.ed > 1;
});

// sep('some chain');
// noFirstEds.forEach(logEach);

// and then with chaining:

var someCrazyTable = restrict(
  project(
    as(library, { ed: 'edition' }),
    ['title', 'isbn', 'edition']
  ), function(book) {
    return book.edition > 1; 
});

// sep('mega chain');
// someCrazyTable.forEach(logEach);