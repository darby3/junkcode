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


// checking underscore

// _.times(4, function() {
//   console.log("Hello")
// });

/**
 * 
 * Chapter 1 - Introducing functional JS
 * 
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


// Building abstraction on abstraction: abstracting away the details of what
// we're actually doing.

// Determine if something is an indexed data type.
function isIndexed(data) {
  return _.isArray(data) || _.isString(data);
}

// console.log("isIndexed('abc') -- " + isIndexed('abc'));
// console.log("isIndexed(['a', 'b']) -- " + isIndexed(['a', 'b']));
// console.log("isIndexed(45) -- " + isIndexed(45));

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

// console.log("nth('abc', 2) -- " + nth('abc', 2));
// console.log("nth('abc', 'aaa') -- " + nth('abc', 'aaa'));
// console.log("nth(45, 4) -- " + nth(45, 4));
// console.log("nth('abc', 4) -- " + nth('abc', 4));

// From there, we can build up another layer of abstraction:
function second(a) {
  return nth(a, 1);
}

// console.log("second('abcde') -- " + second('abcde'));
// console.log("second(['1', '2', '3']) -- " + second(['1', '2', '3']));
// console.log("second({}) -- " + second({}));



// "Comparator": takes two values, returns <1 if the first is less than the
// second, >1 if the first is greater than the second, and 0 if equal. so, three
// return values. They're used in Array.sort() to tell JS how to sort values.

var sortResult = [2,3,-1,-6,0,-100,42,10].sort(function(x,y) {
  if (x<y) {
    return -1;
  }
  if (x>y) {
    return 1;
  }
  return 0;
});

// console.log("sortResult -- " + sortResult);

// With functional JS, we want to make this more generic and more reusable. But
// if we just drop it out to a named function as-is, it doesn't stand on its own
// very well; not very extendable.

// SO instead, let's turn it into a predicate function (one that always returns
// TRUE or FALSE)

function lessOrEqual(x, y) {
  return x <= y;
}

// This gets us partially there, but since it only returns T or F, we need to
// somehow get to -1/0/1 expected of a comparator. So we write a function that
// takes a predicate and converts it to the expected result for a comparator
// operation.

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

// Note: comparator is a higher-order function, because it takes a function and
// returns another function.

/*====================================
=            Odd aside...            =
====================================*/

// Which I can't actually play with yet because the truthy function hasn't been
// defined yet, which is odd. (Truthy and Falsey hurts my brain anyways.)

// If we removed the truthy call though and just assumed our pred would return
// boolean values, though, (which I'm sure we can't actually do for reasons that
// are soon to become clear), we could do this:

function comparatorAlt(pred) {
  return function(x, y) {
    if (pred(x, y)) {
      return -1;
    } else if (pred(y, x)) {
      return 1;
    } else {
      return 0;
    }
  }
}

// So then we could use the predicate function to sort an array:

var sortResultAlt = [2,3,-1,-6,0,-100,42,10].sort(comparatorAlt(lessOrEqual));

// console.log("sortResultAlt -- " + sortResultAlt);

// And by extension we can have other predicates:

function greaterOrEqual(x, y) {
  return x >= y;
}

var sortResultAltAlt = [2,3,-1,-6,0,-100,42,10].sort(comparatorAlt(greaterOrEqual));

// console.log("sortResultAltAlt -- " + sortResultAltAlt);

// This one probably should have data checks in it:

function shorterLength(x, y) {
  return x.length < y.length;
}

var arrayOfArrays = [
  [1,2,3],
  [1,2,3,4,5],
  [1],
  [1,2]
]

// sep('arrayOfArrays');
// arrayOfArrays.forEach(logEach)

// sep('arrayOfArrays, sorted');
// arrayOfArrays.sort(comparatorAlt(shorterLength))
// arrayOfArrays.forEach(logEach);

// Or with strings...

var arrayOfStringArrays = [
  ['x','y','z'],
  ['a','b','c','d','e','f','g'],
  ['a','b','c','d','e'],
  ['a','b','c'],
  ['a','b','c','d'],
]

// sep('arrayOfStringArrays, unsorted');
// arrayOfStringArrays.forEach(logEach);

// sep('arrayOfStringArrays, sorted');
// arrayOfStringArrays.sort(comparatorAlt(shorterLength)).forEach(logEach);

/*=================================
=            End aside            =
=================================*/

// Data as abstraction; getting data from world X to world Y; such as with the
// lame CSV parser.

function lameCSV(str) {
  return _.reduce(str.split('\n'), function(table, row) {
    table.push(_.map(row.split(','), function(c) {
      return c.trim();
    }));
    return table;
  }, [])
}

var peopleTable = lameCSV("name,age,hair\nMerble,35,red\nBob,64,blonde");

// console.log("peopleTable -- " + peopleTable);
// peopleTable.forEach(logEach);

/*====================================================================
=            Which, to parse out that lameCSV function...            =
====================================================================*/

// _.reduce - boils a list down into a single value.
// 
// In this case:
// 
//  * list: str.split('\n')
//  * iteratee: the big function in the middle
//  * memo: the [] at the end; tells us what the original state of the reduction
//    looks like
//    
//  ...so in this case we're reducing an array (that we get by splitting up a
//  string) into another arrauy. We pass it through a function to do so.
//    
//  The iteratee is passed the original memo (our empty array) and the next
//  value from the list. The iteratee returns the updated memo each pass.
//  
//  In this case our iteratee is taking a table, pushing something into it, and
//  returning the table (to be added to next time around).
//  
//  That something is generated by the _.map function, which itself is given a
//  list and an iteratee function and generates an array using them. Our list is
//  generated by splitting each substring at the comma. Our iteratee function is
//  simply taking the value and removing any whitespace from the start or end.
//  
//  Easy, really.

/*==========================================
=            And now back to it            =
==========================================*/

// The book makes some points here about how we can do neat things with data
// when we use it in "simple" native formats, instead of recreating class-like
// structures. IE arrays give us a lot of functionality we can tap in to.

// sep('doing stuff with data');

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

// sep('names');
// var names = selectNames(peopleTable);
// names.forEach(logEach);

// sep('ages');
// var ages = selectAges(peopleTable);
// ages.forEach(logEach);

// sep('hair colors');
// var hairColors = selectHairColor(peopleTable);
// hairColors.forEach(logEach);

// sep('merging results');
// var results = mergeResults(selectNames(peopleTable), selectAges(peopleTable));
// results.forEach(logEach);


/*==================================
=            Quick note            =
==================================*/

// Now, what would all this look like if we used an OO approach? We'd have some object that was like
// 
// var Person = function(age, name, hairColor {
//   this.age: age || 0;
//   this.name: name || '';
//   this.hairColor: hairColor || '';
//   
//   return this;
// }
// 
// ...and then a function that would have to parse through the csv data and
// create probably an array of objects based on that, and then we'd be either
// using functions to find relevant objects and data or we'd be building methods
// into the objects' prototype to return the data we need, etc etc, which does
// feel cumbersome and extra somehow?


// Some useful existence checking functions. These should enable us to use the
// original comparator() function above.

// Existy. Null and Undefined both signify non-existence. This checks that
// neither is the case. Because we use the loose operator, we can distinguis
// between null, undefined, and everything else.

function existy(x) {
  return x != null;
}

// console.log("existy(null) -- " + existy(null));
// console.log("existy(undefined) -- " + existy(undefined));
// console.log("existy({}.nothingHere) -- " + existy({}.nothingHere));
// console.log("existy((function(){})()) -- " + existy((function(){})()));
// console.log("existy(0) -- " + existy(0));
// console.log("existy(false) -- " + existy(false));

/*================================================================================
=            I always have trouble with this null and undefined stuff            =
================================================================================*/

// console.log("existy(peopleTable) -- " + existy(peopleTable));
// console.log("existy(arrayOfArrays) -- " + existy(arrayOfArrays));

var notARealVariable;
// sep('empty variable');

// console.log("existy(notARealVariable) -- " + existy(notARealVariable));
// console.log("notARealVariable == null -- " + notARealVariable == null);
// console.log("notARealVariable == undefined -- " + notARealVariable == undefined);
// console.log("notARealVariable === null -- " + notARealVariable === null);
// console.log("notARealVariable === undefined -- " + notARealVariable === undefined);

// console.log("typeof (notARealVariable) -- " + typeof (notARealVariable));

// Note here that if you do the typeof first, the second line will work and show
// undefined. If you only do the second line, it will break. 

// sep();

// // console.log("typeof(reallyNotReal) -- " + typeof (reallyNotReal));
// console.log("reallyNotReal -- " + reallyNotReal);

// var reallyNotReal;
// console.log("typeof (reallyNotReal) -- " + typeof (reallyNotReal));
// console.log("existy(reallyNotReal) -- " + existy(reallyNotReal));

// Mostly I think I need to check my assumptions about what I actually want to
// know when I think I want to know if something exists and/or has a value.


// Truthy. Which is to say, it both exists and is not false. (A value of zero
// would come up as non-truthy, otherwise.)

// sep('Truthiness');

function truthy(x) {
  return (x !== false) && existy(x);
}

// console.log("truthy(false) -- " + truthy(false));
// console.log("truthy(undefined) -- " + truthy(undefined));
// console.log("truthy(0) -- " + truthy(0));
// console.log("truthy('') -- " + truthy(''));

// Useful thing to do: do a thing if a condition is true, return null/undefined
// otherwise.

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

// Wherein _.result looks at the target (object) for a name property. If it's a
// function, it executes it. If it's a value, return it. (Hence why the "this"
// below can be used to reference values on the same object.)

// The function above is used like:

// executeIfHasField([1,2,3], 'reverse');

// executeIfHasField({
//   foo: 42,
// }, 'foo');

// executeIfHasField({
//   foo: 42,
//   baz: 1442,
//   bar: function() { 
//     return this.baz
//   },
// }, 'bar');

// executeIfHasField('abacus', 'length');

// var coolString = 'a storm in a teacup';
// executeIfHasField(coolString, 'length');
// executeIfHasField(coolString, 'unknown thingy');
// console.log("executeIfHasField(coolString, 'unknown thingy') -- " + executeIfHasField(coolString, 'unknown thingy'));


