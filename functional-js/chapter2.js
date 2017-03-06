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
  console.log(index, '---', item)
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

sep('collection-centric programming');

sep('map');

_.map(coolObject, function(value, key, collection) {
  return [key, value, _.keys(collection)];
}).forEach(logEach);

sep('filter');
_.filter(coolObject, function(value, key) {
  return (value <= 2) || (key === 'd');
}).forEach(logEach);

/** 
 *
 * _.reduceRight is like _.reduce but it works in the opposite direction.
 * 
 */

var nums = [ 100, 2, 25 ];

function div(x, y) {
  return x / y;
}

sep('reducing');

console.log("_.reduce(nums, div) -- " + _.reduce(nums, div));
console.log("_.reduceRight(nums, div) -- " + _.reduceRight(nums, div));

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

sep('using reduceRight to check t/f values of many things');

console.log("allOf() -- " + allOf());
console.log("allOf(T, T) -- " + allOf(T, T));
console.log("allOf(T, T, T, T, F) -- " + allOf(T, T, T, T, F));

sep();

console.log("anyOf(F, F, F) -- " + anyOf(F, F, F));
console.log("anyOf(F, T) -- " + anyOf(F, T));
console.log("anyOf() -- " + anyOf());

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

sep('using reduceRight to check t/f values of many things from the left');

console.log("allOfLeft() -- " + allOfLeft());
console.log("allOfLeft(T, T) -- " + allOfLeft(T, T));
console.log("allOfLeft(T, T, T, T, F) -- " + allOfLeft(T, T, T, T, F));

sep();

console.log("anyOfLeft(F, F, F) -- " + anyOfLeft(F, F, F));
console.log("anyOfLeft(F, T) -- " + anyOfLeft(F, T));
console.log("anyOfLeft() -- " + anyOfLeft());

// These come up the same. I'm not certain I see the difference/need?

/*=================================
=            End aside            =
=================================*/
