// Working through Functional JavaScript in a Node environment.

// Requires.
var _ = require('underscore');

// Minor utilities
function sep() {
  console.log("--------");
};

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

listAllElements('one', 'two', 'three');

var makeArrayAndAppend = unsplat(function(array) {
  var insideArray = array;
  insideArray.push("sandwich");
  return insideArray;
})

var newArray = makeArrayAndAppend('a','b','c');

newArray.forEach(function(item, index) {
  console.log(item, '---', index)
})

// POSSIBLE GOTCHA?

// Note you can't feed the newArray back to listAllElements because that
// function will take the array as a single argument (where it is really
// expecting a number of separate items), and will pass the whole thing into the
// function (A) as one argument. So it's sort of converting the array into one
// element of an array. Maybe? I might be missing a beat here.

// See here that toArray takes an array in and spits an array out just fine. So
// it must be the call bit that does the conversion?

// var arrayOne = ['a', 'b', 'c'];

// arrayOne.forEach(function(item, index) {
//   console.log("item, index -- " + item, index);
// })

// var arrayTwo = _.toArray(arrayOne);

// arrayTwo.forEach(function(item, index) {
//   console.log("item, index -- " + item, index);
// })

// And here's a function using call or not call.

var awesome = function() {
  var localArray = _.toArray(arguments);

  localArray.forEach(function(item, index) {
    console.log("item, index -- " + item, index);
  })
}

console.log("awesome:");
awesome([1,2,3]);
awesome.call(null, _.toArray(['a', 'b', 'c']));

var coolio = function(array) {
  array.forEach(function(item, index) {
    console.log("item, index -- " + item, index);
  })
};

console.log("coolio:");
coolio([1,2,3]);
coolio.call(null, _.toArray([1,2,3]));

console.log("array checks:");
console.log("Array.isArray([1,2,3]) -- " + Array.isArray([1,2,3]));
console.log("Array.isArray(_.toArray([1,2,3])) -- " + Array.isArray(_.toArray([1,2,3])));
console.log("Array.isArray() -- " + Array.isArray());

sep();

// A function that returns the arguments provided to it as an array
function returnArguments() {
  return _.toArray(arguments);
}


sep();
console.log("Return regular arguments as an array:");
console.log("returnArguments('a', 'b') -- " + returnArguments('a', 'b'));
console.log("Array.isArray(returnArguments('a','b')) -- " + Array.isArray(returnArguments('a','b')));
console.log("returnArguments('a','b').length -- " + returnArguments('a','b').length);

sep();
console.log("Return arguments as an array, passing in arguments via .call:");
console.log("Array.isArray(returnArguments.call(null, ['a', 'b'], 'c')) -- " + Array.isArray(returnArguments.call(null, ['a', 'b'], 'c')));
console.log("returnArguments.call(null, ['a', 'b'], 'c') -- " + returnArguments.call(null, ['a', 'b'], 'c'));
console.log("returnArguments.call(null, ['a', 'b'], 'c').length -- " + returnArguments.call(null, ['a', 'b'], 'c').length);