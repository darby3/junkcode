/**
 *
 * Working through Functional JavaScript book. Using node to run the code.
 *
 * I digress and explore along the way and then try to comment the code up to
 * help explain my thinking and exploration. And then I comment code out as I
 * go. So this probably looks like a huge mess.
 *
 * I also expect I'll start moving re-used functions into a separate module
 * file. That'll make it even messier, sort of.
 *
 */

// Requires.
var _ = require('underscore');

// checking underscore

// _.times(4, function() {
//   console.log("Hello")
// });

/**
 * Chapter 1 - Introducing functional JS
 */

// built in functions

// [1, 2, 3].forEach(function(a) {
//   console.log(a);
// });


// Apply method: Call the function with an array as if the array elements were
// the arguments to the function itself.

// Splat takes function (A), and the returns a function (B). The new function
// (B) takes an array, and calls function (A), using (B)'s' elements as the
// arguments.

function splat(fun) {
  return function(array) {
    return fun.apply(null, array);
  };
}

var addArrayElements = splat(function(x, y) {
  return x + y;
});

// console.log("addArrayElements:", addArrayElements([1, 2]));
// console.log("addArrayElements:", addArrayElements([5, 10]));

// Unpacked a bit, it looks like this:

var addArrayElementsFull = function(array) {
  return function(x, y) {
    return x + y;
  }.apply(null, array);
}

// console.log("addArrayElementsFull:", addArrayElementsFull([1, 2]));
// console.log("addArrayElementsFull:", addArrayElementsFull([5, 10]));

// But we can supply other functions to splat, which we can't do with
// addArrayElementsFull.

var subtractArrayElements = splat(function(x, y) {
  return x - y;
})
var multiplyArrayElements = splat(function(x, y) {
  return x * y;
})
var divideArrayElements = splat(function(x, y) {
  return x / y;
})

// console.log("addArrayElements([10, 5]) -- " + addArrayElements([10, 5]));
// console.log("subtractArrayElements([10, 5]) -- " + subtractArrayElements([10, 5]));
// console.log("multiplyArrayElements([10, 5]) -- " + multiplyArrayElements([10, 5]));
// console.log("divideArrayElements([10, 5]) -- " + divideArrayElements([10, 5]));

// Unsplat works opposite of splat. It takes a function (A) and returns a
// function (B). Function (B) takes any number of arguments, and calls function
// (A) with an array of the given values.
// 
// The underscore bit here turns the arguments into an array, and then the call
// method passes the array into the function (A).

function unsplat(fun) {
  return function() {
    return fun.call(null, _.toArray(arguments));
  };
}

var joinElements = unsplat(function(array) {
  return array.join(' ');
});

// console.log("joinElements(1, 2) -- " + joinElements(1, 2));
// console.log("joinElements('-', '$', '/', '!', ':') -- " + joinElements('-', '$', '/', '!', ':'));

// If we didn't have to convert the arguments to an array, and we were fixed on
// the space, and the joing, we'd have:

var jointElementsFull = function(array) {
  return array.join(' ');
}

// console.log("jointElementsFull(['a', 'b', 'c']) -- " + jointElementsFull(['a', 'b', 'c']));

// But now we can do other array things with unsplat:

var listAllElements = unsplat(function(array) {
  array.forEach(function(item, index) {
    console.log(index + ' -- ' + item)
  })
})

// listAllElements('one', 'two', 'three');

// sep();

// note: can't one line this as array.push returns the resulting length
var makeArrayAndAppendSandwich = unsplat(function(array) {
  array.push("sandwich");
  return array;
})

var newArray = makeArrayAndAppendSandwich('a','b','c');

// See notes below.

// This works as expected; we know newArray is still an array.
// newArray.forEach(function(item, index) {
//   console.log(item, '---', index)
// })

// sep()

// This does not; when we use the .call method on the newArray argument it
// treats it as a single argument — the call passes the entire array in as a
// single argument to the listing function.

// listAllElements(newArray);

// The answer here probably involves checking, inside the listAll function, if
// the next argument in the list is an array, and it is, breaking it out into
// separate elements. I mean, if you're expecting to mix arrays and not arrays
// as argumemts, but want them to be treated as one long list instead?

/*========================================
=            Possible gotcha?            =
========================================*/

/**
 * This gets digressy:
 * 
 * (I got into trouble with an earlier version of "makeArrayAndAppendSandwich"
 * function above.)
 * 
 * Note you can't feed the newArray back to listAllElements because that
 * function will take the array as a single argument (where it is really
 * expecting a number of separate items), and will pass the whole thing into the
 * function (A) as one argument. So it's sort of converting the array into one
 * element of an array. Maybe? I might be missing a beat here.
 * 
 * One thing definitely worth noting is remembering that if you want to work
 * with the argyments variable as an array you have to convert it to an array,
 * because on its own it is not actually an array.
 */

// See here that toArray takes an array in and spits an array out just fine. So
// it must be the call bit that does the conversion?

// sep();

// var arrayOne = ['a', 'b', 'c'];
// console.log("arrayOne.length -- " + arrayOne.length);

// arrayOne.forEach(function(item, index) {
//   console.log("item, index -- " + item, index);
// })

// var arrayTwo = _.toArray(arrayOne);
// console.log("arrayTwo.length -- " + arrayTwo.length);

// arrayTwo.forEach(function(item, index) {
//   console.log("item, index -- " + item, index);
// })

// And here's a function using call or not call.

// sep();

// var awesome = function() {
//   var localArray = _.toArray(arguments);

//   localArray.forEach(function(item, index) {
//     console.log("item, index -- " + item, index);
//   })
// }

// console.log("awesome:");
// awesome([1,2,3]);
// awesome.call(null, _.toArray(['a', 'b', 'c']));

// var coolio = function(array) {
//   array.forEach(function(item, index) {
//     console.log("item, index -- " + item, index);
//   })
// };

// console.log("coolio:");
// coolio([1,2,3]);
// coolio.call(null, _.toArray([1,2,3]));

// console.log("array checks:");
// console.log("Array.isArray([1,2,3]) -- " + Array.isArray([1,2,3]));
// console.log("Array.isArray(_.toArray([1,2,3])) -- " + Array.isArray(_.toArray([1,2,3])));
// console.log("Array.isArray() -- " + Array.isArray());

// sep();

// Some array exploration.

// A function that returns the arguments provided to it as an array
function returnArguments() {
  return _.toArray(arguments);
}

// sep();
// console.log("Return regular arguments as an array:");
// console.log("returnArguments('a', 'b') -- " + returnArguments('a', 'b'));
// console.log("Array.isArray(returnArguments('a','b')) -- " + Array.isArray(returnArguments('a','b')));
// console.log("returnArguments('a','b').length -- " + returnArguments('a','b').length);

// sep();
// console.log("Return arguments as an array, passing in arguments via .call:");
// console.log("Array.isArray(returnArguments.call(null, ['a', 'b'], 'c')) -- " + Array.isArray(returnArguments.call(null, ['a', 'b'], 'c')));
// console.log("returnArguments.call(null, ['a', 'b'], 'c') -- " + returnArguments.call(null, ['a', 'b'], 'c'));
// console.log("returnArguments.call(null, ['a', 'b'], 'c').length -- " + returnArguments.call(null, ['a', 'b'], 'c').length);

/*================================================
=            And back to the book now            =
================================================*/

/**
 * Units of abstraction and behavior. By pulling these actions out into
 * functions, we can easily modify them in place or replace them with new
 * functions later.
 */

function fail(thing) {
  throw new Error(thing);
}

function warn(thing) {
  console.log(["WARNING:", thing].join(' '));
}

function note(thing) {
  console.log(["NOTE:", thing].join(' '));
}

// Use 'em'

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

// yay
// sep();
// console.log(parseAge("43"));

// uhoh
// sep();
// console.log(parseAge("frodo"));

// this throws an error
// console.log(parseAge(45));


// Determine if something is an indexed data type.
function isIndexed(data) {
  return _.isArray(data) || _.isString(data);
}

console.log("isIndexed('abc') -- " + isIndexed('abc'));
console.log("isIndexed(['a', 'b']) -- " + isIndexed(['a', 'b']));
console.log("isIndexed(45) -- " + isIndexed(45));

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

console.log("nth('abc', 2) -- " + nth('abc', 2));
// console.log("nth('abc', 'aaa') -- " + nth('abc', 'aaa'));
// console.log("nth(45, 4) -- " + nth(45, 4));
// console.log("nth('abc', 4) -- " + nth('abc', 4));