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

function plucker(field) {
  return function(obj) {
    return (obj && obj[field]);
  };
};

function average(array) {
  var sum = _.reduce(array, function(a, b) {
    return a + b;
  });

  return sum / _.size(array);
}

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

function fail(thing) {
  throw new Error(thing);
}

function warn(thing) {
  console.log(["WARNING:", thing].join(' '));
}

function note(thing) {
  console.log(["NOTE:", thing].join(' '));
}

function cat() {
  var head = _.first(arguments);

  if (existy(head)) {
    return head.concat.apply(head, _.rest(arguments));
  } else {
    return [];
  }
}


/**
 * 
 * Chapter 4 - Higher-Order Functions
 * 
 */

/**
 *
 * Side note before I begin: there's a new episode of Meet the Composer out
 * right now where the host talks about how she never really understands a
 * composer's work until she fully inhabits it by playing it. And I think that's
 * how I feel about the act of typing out a lot of this code. I need to flow it
 * through my brain and hands like that to get it, to really concentrate on it.
 * I mean obviously not even close to the same thing, but, sort of close to the
 * same thing.
 *
 * And with that.
 *
 */

var people = [{
  name: 'Fred',
  age: '25',
}, {
  name: 'Lucy',
  age: '35'
}];

/**
 *
 * finder() is like a more generic _.max - it takes two functions, one to build
 * coparable values, one to compare and return the preferred value
 *
 */

function finder(valueFun, bestFun, coll) {
  return _.reduce(coll, function(best, current) {
    var bestValue = valueFun(best);
    var currentValue = valueFun(current);

    return (bestValue === bestFun(bestValue, currentValue)) ? best : current;
  });
}

// console.log(
//   "finder(_.identity, Math.max, [1,2,3,4,5]) -- " + 
//    finder(_.identity, Math.max, [1,2,3,4,5])
// );

// console.log(
//   "finder(_.identity, Math.min, [1,2,3,4,5]) -- " + 
//    finder(_.identity, Math.min, [1,2,3,4,5])
// );

var oldestPerson = finder(plucker('age'), Math.max, people);

// console.dir(oldestPerson);

var personNamedL = finder(plucker('name'), function(x,y) {
    return (x.charAt(0) === 'L') ? x : y;
  }, people);

// console.dir(personNamedL);

/**
 * With best(), we're removing the duplicate logic.
 *
 * Note that x here is always going to be the "current" best option, so for the
 * next item in the list to replace it, it has to be better, somehow.
 *
 * This makes the most sense if we're comparing the values in some interesting
 * way. Otherwise we're going to get the first option and stick with it.
 * 
 */

function best(fun, coll) {
  return _.reduce(coll, function(x, y) {
    return fun(x, y) ? x : y;
  })
}

// console.log(
//   "best(function(x,y) { return x > y }, [1,2,3,4,5]) -- " + 
//    best(function(x,y) { return x > y }, [1,2,3,4,5])
// );

// console.log(
//   "best(function(x, y) { return x % 2 == 0 }, [5, 4, 3, 2, 1]) -- " + 
//    best(function(x, y) { return x % 2 == 0 }, [5, 4, 3, 2, 1])
// );

/**
 *
 * Worth noting here the importance of the tradeoffs between genericness and
 * flexibility. How much can we or do we want to assume about the flexibility of
 * the functions we're working with? How much do we need?
 *
 */

function repeat(times, value) {
  return _.map(_.range(times), function() {
    return value;
  })
}

// console.log(
//   "repeat(4, 'Major') -- " + 
//    repeat(4, 'Major')
// );

// console.dir(repeat(4, 'major'));

// From repeating a value to repeating a computation:

function repeatedly(times, fun) {
  return _.map(_.range(times), fun)
}

var someValues = repeatedly(3, function() {
  return Math.floor((Math.random() *10 + 1));
})

// console.dir(someValues);

// And of course the function gets the current times count via range:

var someValues = repeatedly(10, function(n) {
  return Math.floor((Math.random() * n * 2 + 1));
})

// console.dir(someValues);

var giveMeSomethingWeird = average(repeatedly(10, function(n) {
    return Math.floor((Math.random() * n * 2 + 1));
  })
)

// console.log(
//   "giveMeSomethingWeird -- " + 
//    giveMeSomethingWeird
// );

var giveMeSomethingWeirder = average(repeatedly(10, function(n) {
    return Math.random() * n * 2 + 1;
  })
)

// console.log(
//   "giveMeSomethingWeirder -- " + 
//    giveMeSomethingWeirder
// );

function iterateUntil(fun, check, init) {
  var ret = [];
  var result = fun(init);

  while (check(result)) {
    ret.push(result);
    result = fun(result);
  };

  return ret;
}

var doubles = iterateUntil(function(n) {
  return n + n;
}, function(n) {
  return n <= 1024;
}, 1);

// sep('doubles');
// console.dir(doubles);

var randoms = iterateUntil(function(n) {
  return Math.random() * n * 2 + 1;
}, function(n) {
  return n >= 2;
}, 1000);

// sep('randoms');
// console.dir(randoms);

/**
 *
 * So that was functions that take functions.
 *
 * Now we have functions that return functions.
 *
 */

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

/*===============================
=            Hoo boy            =
===============================*/

/**
 *
 * So: invoker "takes a method and returns a function that will invoke that
 * method on any object given"
 *
 * Okay so note that invoker is a function we invoke and assign to a variable,
 * and the variable will then be a function. That function would then take a
 * target and some arguments. 
 *
 * It will check to make sure the target exists. If it doesn't, we bounce.
 *
 * We then set the targetMethod variable, which is a property of the target
 * object, and is found by the name that was passed in to the original invoker
 * function, and was captured by closure.
 *
 * The args are simply anything that follows the target passed to the returned
 * function.
 *
 * We then use doWhen to check that the targetMethod does in fact exist, and
 * that the method that was passed in to the original function and was captured
 * by closure is the same as the targetMethod, to do a function that returns
 * what we get when we pass in the "target" as "this" and the args as args via
 * apply to the targetMethod function.
 *
 * I'm hazy on why we'd want to go through all this. The book notes that "[ A ]
 * it's perfectly legitimate to directly invoke a particular method on an
 * instance, [ but ] [ B ] a function style prefers functions taking the
 * invocation target as an argument."
 *
 * So like A below would be [1,2,3].reverse()
 *
 * And B below is ... what we see. We create a rev function that we can feed
 * arrays to an an argument. So like map is giving [1,2,3] to rev as the
 * argument, which will then check to make sure it exists, get the
 * [1,2,3]['reverse'] method, get some extra arguments it doesn't really need,
 * and then doWhen -- if the target method exists (it does) and if the method
 * and targetMethod are the same (they are) it will then basically do
 * Array.prototype.reverse.apply([1,2,3], args). And return the result.
 *
 * So I see the logic now. I'm still hazy on why this is the "style" we'd
 * prefer. But maybe I just beed to see more examples in mind. Also I guess it
 * helps to pass in the array(s) through the map function as well. So!
 * 
 * So like below we're mapping a list of items through the rev() function, which
 * is taking the value of the item in the list as its target,
 * 
 */

/*===============================
=            yob ooH            =
===============================*/

var rev = invoker('reverse', Array.prototype.reverse);

// console.log(
//   "_.map([[1,2,3]], rev) -- " + 
//    _.map([[1,2,3]], rev)
// );

var revvedArray = _.map([[1,2,3]], rev);
// console.dir(revvedArray);

var revvedOtherArray = _.map([[1,2,3], [4,5,6]], rev);
// console.dir(revvedOtherArray);

// console.log(
//   "rev([1,2,3,4,5]) -- " + 
//    rev([1,2,3,4,5])
// );

// console.log(
//   "rev([1,2,3,4,5], [9,10,11]) -- " + 
//    rev([1,2,3,4,5], [9,10,11])
// );

// console.log(
//   "[1,2,3,4]['reverse'] -- " + 
//    [1,2,3,4]['reverse']
// );

/**
 *
 * AKA the moment I sort of got it:
 *
 */

var concatter = invoker('concat', Array.prototype.concat);

var concattedArray = concatter([1,2,3], ['a','b','c'], ['apples','oranges']);
// console.dir(concattedArray);

/**
 *
 * Capturing variables
 *
 */

function makeUniqueStringFunction(start) {
  var counter = start;

  return function(prefix) {
    return [prefix, counter++].join('');
  }
}

var uniqueString = makeUniqueStringFunction(0);

// console.log(
//   "uniqueString('apple') -- " + 
//    uniqueString('apple')
// );

// console.log(
//   "uniqueString('orange') -- " + 
//    uniqueString('orange')
// );

// console.log(
//   "uniqueString('pears') -- " + 
//    uniqueString('pears')
// );

// And then some talk about how we could do this with objects but this is really
// clean and safe, so. But also at the same time we want to avoid having bits of
// 'state' like counter as much as possible anyway.

/**
 *
 * Guarding against nonexistence with fnull
 *
 */

function fnull(fun /*, defaults */) {
  // a simple array of arguments
  var defaults = _.rest(arguments);

  return function (/* args */) {
    var args = _.map(arguments, function(el, index) {
      return existy(el) ? el : defaults[index];
    });

    return fun.apply(null, args);
  }
};

// Note: assigning defaults is done in a lazy fashion, only if the incoming
// function is called

var nums = [1,2,3,null,5];

var safeMult = fnull(function(total, n) {
  return total * n;
}, 1, 1);

// console.log(
//   "_.reduce(nums, safeMult) -- " + 
//    _.reduce(nums, safeMult)
// );

/**
 *
 * And then there's this bit I realy need to come back and parse through.
 *
 * lookup becomes a function returned by defaults, which takes settings object
 * full of default values that gets captured by closure. The function will
 * assign a value using fnull to val, which ultimately is applying arguments to
 * the identity function. So when you run lookup, it's going to check for the
 * existence of the property on the object it is given, ...
 *
 * this is a bit of a mess but it starts to expand out like:
 * 
 * var lookup = function(o, k) {
 *   d = { critical: 100 };
 *   
 *   var val = function( incomingargs ) {
 *     var args = _.map(arguments, function(el, index) {
 *       return existy(el) ? el : d[key];
 *     })
 *
 *     return _.identity(apply(null, args));
 *   };
 *   
 *   return o && val(o[k]);
 * }
 *
 */

function defaults(d) {
  return function(o, k) {
    var val = fnull(_.identity, d[k]);
    return o && val(o[k]);
  }
}

function doSomething(config) {
  var lookup = defaults({ 
    critical: 100
  });

  return lookup(config, 'critical');
}

// console.log(
//   "doSomething({critical: 9}) -- " + 
//    doSomething({critical: 9})
// );

// console.log(
//   "doSomething({}) -- " + 
//    doSomething({})
// );

/**
 *
 * Object validators
 *
 */

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

var alwaysPasses = checker(always(true), always(true));

// console.dir(alwaysPasses({}));

var fails = always(false);
fails.message = "a failure in life";
var alwaysFails = checker(fails);

// console.dir(alwaysFails({}));

// ah, but an api for creating validators...

function validator(message, fun) {
  var f = function(/* args */) {
    return fun.apply(fun, arguments);
  };

  f['message'] = message;
  return f;
}

var gonnaFail = checker(validator("Oops", always(false)));

// console.dir(gonnaFail(100));

function aMap(obj) {
  return _.isObject(obj);
}

var checkCommand = checker(validator("must be a map", aMap));

// console.dir(checkCommand({}));
// console.dir(checkCommand(10));

/**
 *
 * uhm "...arguments to a function-returning function can serve as behavior
 * configuration for the returned closure. Keeping this in mind will allow you
 * to return tweaked closures anywhere that a function is expected."
 *
 * I'm starting to feel drown-y right about now.
 *
 * "the purpose of the function hasKeys is to provide an execution configuration
 * to fun"
 *
 */


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

var checkCommand = checker(validator('must be a map', aMap),
                            hasKeys('msg', 'type'));     

// console.dir(checkCommand({
//   msg: 'blah',
//   type: 'display'
// }));

// console.dir(checkCommand(32));

// console.dir(checkCommand({}));