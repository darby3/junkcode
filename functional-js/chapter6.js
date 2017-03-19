var _ = require('underscore');
require('pretty-error').start();

/*=======================================
=            Minor utilities            =
=======================================*/

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

/*======================================================
=            Required functions (as needed)            =
======================================================*/

/**
 *
 * Sort of. Copied from the accumulated head of chapter 5. Additional functions
 * from chapter 5 or elsewhere copied as needed.
 *
 */

function existy(x) {
  return x != null;
}

function truthy(x) {
  return (x !== false) && existy(x);
}

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

function doWhen(cond, action) {
  if (truthy(cond)) {
    return action();
  } else {
    return undefined;
  }
}

function always(value) {
  return function() {
    return value;
  }
}

function invoker(name, method) {
  return function(target /* args */) {
    if (!existy(target)) {
      fail("Must provide a target");
    };

    var targetMethod = target[name];
    var args = _.rest(arguments);

    return doWhen((existy(targetMethod) && method === targetMethod), function() {
      return targetMethod.apply(target, args);
    });
  };
};

function repeat(times, value) {
  return _.map(_.range(times), function() {
    return value;
  })
}

function checker(/* validators */) {
  var validators = _.toArray(arguments);

  return function(obj) {
    return _.reduce(validators, function(errs, check) {
      if (check(obj)) {
        return errs;
      } else {
        return _.chain(errs).push(check.message).value();
      }
    }, []);
  };
}

function validator(message, fun) {
  var f = function(/* args */) {
    return fun.apply(fun, arguments);
  };

  f['message'] = message;
  return f;
}

function mapcat(fun, coll) {
  return cat.apply(null, _.map(coll, fun));
}

function complement(pred) {
  return function() {
    return !pred.apply(null, _.toArray(arguments));
  };
}

function hasKeys() {
  var keys = _.toArray(arguments);

  var fun = function(obj) {
    return _.every(keys, function(k) {
      return _.has(obj, k);
    });
  };

  fun.message = cat(['Must have values for keys:'], keys).join(" ");

  return fun;
}

function splat(fun) {
  return function(array) {
    return fun.apply(null, array);
  };
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

function isIndexed(data) {
  return _.isArray(data) || _.isString(data);
}

function fail(thing) {
  throw new Error(thing);
}

function warn(thing) {
  console.log(["WARNING:", thing].join(' '));
}

function note(thing) {
  console.log(["NOTE:", thing].join(' '));
}

var rev = invoker('reverse', Array.prototype.reverse);

/**
 *
 * Chapter 6: Recursion
 *
 */

// This one's really just for demo purposes.
function myLength(ary) {
  if (_.isEmpty(ary)) {
    return 0
  } else {
    return 1 + myLength(_.rest(ary));
  }
}

// console.log(
//   "myLength([1,2,3,4,5,6,7]) -- " + 
//    myLength([1,2,3,4,5,6,7])
// );

function cycle(times, ary) {
  if (times <= 0) {
    return [];
  } else {
    return cat(ary, cycle(times - 1, ary));
  }
}

// console.log(
//   "cycle(5, ['a','b','c']) -- " + 
//    cycle(5, ['a','b','c'])
// );

// console.dir(cycle(5, ['a','b','c']));

// console.dir(_.zip(['a', 'b', 'c'], ['x','y','z']));
// console.dir(_.zip(['a', 'b', 'c', 'd'], ['x','y','z']));
// console.dir(_.zip(['a', 'b', 'c'], ['x','y','z','u']));
// console.dir(cycle(3, _.zip(['a', 'b', 'c'], ['x','y','z'])));

function constructPair(pair, rests) {
  return [ construct(_.first(pair), _.first(rests)),
           construct(second(pair), second(rests)) ]
}

// console.dir(constructPair( ['a', 1], [[],[]] ));

function unzip(pairs) {
  if (_.isEmpty(pairs)) {
    return [[],[]];
  } 

  return constructPair(_.first(pairs), unzip(_.rest(pairs)));
}

console.log("zippedThings");
var zippedThings = _.zip([1,2,3],[4,5,6]);
console.dir(zippedThings);

console.log("unzippedThings");
var unzippedThings = unzip(zippedThings);
console.dir(unzippedThings);

/**
 *
 * Note to self: I spent a horrifyingly long time here tracking down a bug.
 * Turned out I was forgetting to return the value from unzip. That will gum up
 * the works...
 *
 */

/**
 *
 * From the book: rules of thumb for writing self-recursive functions.
 *
 * - Know when to stop
 * - Decide how to take one step
 * - Break the problem into that step and a smaller problem
 *
 */

// Graph walking

var influences = [
  [ 'Lisp', 'Smalltalk' ],
  [ 'Lisp', 'Scheme' ],
  [ 'Smalltalk', 'Self' ],
  [ 'Scheme', 'JavaScript' ],
  [ 'Scheme', 'Lua' ],
  [ 'Self', 'Lua' ],
  [ 'Self', 'JavaScript' ],
];

function nexts(graph, node) {
  if (_.isEmpty(graph)) {
    return []
  };

  var pair = _.first(graph);
  var from = _.first(pair);
  var to = second(pair);
  var more = _.rest(graph);

  if (_.isEqual(node, from)) {
    return construct(to, nexts(more, node));
  } else {
    return nexts(more, node)
  }
}

console.dir(nexts(influences, 'Scheme'));

/**
 *
 * Wherein we're using a series of constructs() to build an array, and we're
 * taking the "graph" (or array of arrays next time), and are breaking it down
 * into the first, rest, and the from and to of the first; if the first is the
 * same as the node we're looking for, we add the 'to' of that pair to our
 * constructed array, and go looking for more in nexts; if not, we don't change
 * the array and just look for more nexts. And just keep returning up
 * constructed arrays or the nexts set as it gets smaller and smaller.
 *
 */

function depthSearch(graph, nodes, seen) {
  if (_.isEmpty(nodes)) {
    return rev(seen);
  }

  var node = _.first(nodes);
  var more = _.rest(nodes);

  if (_.contains(seen, node)) {
    return depthSearch(graph, more, seen)
  } else {
    return depthSearch( graph,
                        cat(nexts(graph, node), more),
                        construct(node, seen) );     
  }
}

console.dir(depthSearch(influences, ['Lisp'], []));
console.dir(depthSearch(influences, ['Smalltalk','Self'], []));
console.dir(depthSearch(construct(['Lua','Io'], influences), ['Lisp'], []));