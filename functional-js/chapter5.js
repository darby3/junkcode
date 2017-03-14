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


/**
 * 
 * Function-Building Functions
 * 
 */

/**
 *
 * Fun fact. it was somewhere in this chapter that I finally realized I needed
 * to stop reading the book and start typing the book. How I even made it this
 * far, I have no idea.
 *
 */

/**
 *
 * I should unpack this for myself. Suffice it to say right now though I
 * understand how it works at a high level based on the examples that follow. A
 * bit of a challenge to keep it in my head but I more or less get it.
 *
 * We're basically creating a function that's going to execute a list of
 * functions until it finds one that does not return undefined, i.e., it
 * executes a function that actually gets a real return value.
 *
 */

function dispatch(/* funs */) {
  var funs = _.toArray(arguments);
  var size = funs.length;

  return function(target /*, args */) {
    var ret = undefined;
    var args = _.rest(arguments);

    for (var funIndex = 0; funIndex < size; funIndex++) {
      var fun = funs[funIndex];
      ret = fun.apply(fun, construct(target, args));

      if (existy(ret)) {
        return ret;
      }
    }

    return ret;
  }
}

var str = dispatch(invoker('toString', Array.prototype.toString),
                   invoker('toString', String.prototype.toString));

// console.dir(str('a'));
// console.dir(str(_.range(10)));

function stringReverse(s) {
  if (!_.isString(s)) {
    return undefined;
  }

  return s.split('').reverse().join('');
}

// console.dir(stringReverse('abc'));
// console.dir(stringReverse(10));

var reverseThings = dispatch(invoker('reverse', Array.prototype.reverse),
                             stringReverse);

// console.dir(reverseThings([1,2,3]));
// console.dir(reverseThings('i am a long string'));

var sillyReverse = dispatch(reverseThings, always(42));

// console.dir(sillyReverse('cool string is cool'));
// console.dir(sillyReverse(9999));

function isa(type, action) {
  return function(obj) {
    if (type === obj.type) {
      return action(obj);
    }
  }
}

/**
 *
 * This is mostly for discussion purposes. Where we're using dispatch to
 * eliminate switch statement dispatching.
 *
 */

// var performCommand = dispatch(
//   isa('notify', function(obj) { return notify(obj.message) }),
//   isa('join', function (obj) { return changeView(obj.target) }),
//   function(obj) { alert(obj.type) }
// );

// var performAdminCommand = dispatch(
//   isa('kill', function(obj) { return shutdown(obj.hostname) }),
//   performCommand
// )

// var performTrialUserCommand = dispatch(
//   isa('join', function(obj) { alert('Cannot join until approved') }),
//   performCommand
// )

// performCommand({
//   type: 'notify',
//   message: 'this is the message that would be in the notify call'
// });

// performAdminCommand({
//   type: 'kill',
//   hostname: 'localhost'
// });

// performTrialUserCommand({
//   type: 'join',
//   message: 'nope'
// });

// performTrialUserCommand({
//   type: 'notify',
//   message: 'well well well hello there'
// });

/**
 *
 * Currying
 *
 * "A curried function is one that returns a new function for every logical
 * argument that it takes."
 *
 * so like 
 * 
 * curry1(arg) -> function (includes arg)
 * curry2(arg1)(arg2) -> curriedWithArg1(arg2) -> function (includes args)
 * curry3(arg1)(arg2)(arg3) -> 
 *   curriedWithArg1(arg2)(arg3) ->
 *   curriedWithArg1AndArg2(arg3) ->
 *   function (includes all args)
 *
 * Or (taken from the JS The Weird Parts course) :
 *
 * 'Or function currying, where you're making a copy of a function using bind(),
 * but setting parameters in the copies of the function.' (And then a note about
 * function programming: 'Thinking and coding in terms of functions. Creating
 * functions that take functions as arguments, so you can have a function that
 * does work but the work it does is given to it as an argument.')
 *
 * Basically it's no wonder I find this term confusing.
 *
 * invoker() is an example of a curried function.
 *
 * You can curry from the right or left. The book goes from the right.
 * 
 */

function curry(fun) {
  return function(arg) {
    return fun(arg);
  }
}

// Which allows us to make something like parseInt accept only one argument when
// it's invoked (when it would normally take in some extra optional arguments).

var badResult = ['11', '11', '11', '11'].map(parseInt);
var goodResult = ['11', '11', '11', '11'].map(curry(parseInt));

// console.dir(badResult);
// console.dir(goodResult);

// because we're feeding a function to curry, which returns a function, which
// only accepts one argument, and then executes the function with that argument.

// sort of like
// .map(function(arg) { return parseInt(arg) });

// .. ie, we're neatly 'disposing' of the additional arguments that map would
// normally pass in

function curry2(fun) {
  return function(secondArg) {
    return function(firstArg) {
      return fun(firstArg, secondArg);
    };
  };
}

// Takes a function, and curries it up to two parameters deep.

function div(n, d) {
  return n / d;
}

var div10 = curry2(div)(10);

// console.dir(div10(50));

// Which is like saying

var div10 = function(secondArg) {
  return function(firstArg) {
    return div(firstArg, secondArg)
  };
}(10);

var div10 = function(firstArg) {
  return div(firstArg, 10);
}

// and div10(50) gives us return div(50, 10);

var parseBinaryString = curry2(parseInt)(2);

// console.dir(parseBinaryString('111'));
// console.dir(parseBinaryString('10'));

/**
 *
 * 'Currying is a useful technique for specifying the specialized behavior of
 * JavaScript functions and for "composing" new functions from existing
 * functions'
 *
 */

/*===========================
=            hum            =
===========================*/

function manyArgs(arg1) {
  return function(arg2) {
    return function(arg3) {
      return [str(arg1), str(arg2), str(arg3)].join(' -- ');
    }
  }
}

// console.dir(manyArgs('a')('b')('c'));

function manyMoreArgs(arg1) {
  var arg1proc = repeat(5, arg1);

  return function(arg2) {
    var arg2proc = repeat(3, arg2);

    return function(arg3) {
      return [str(arg1proc), str(arg2proc), str(arg3)].join(' -- ');
    }
  }
}

// console.dir(manyMoreArgs('a')('b')('c'));

/*==============================================
=            or something like that            =
==============================================*/


/**
 *
 * Building new functions using currying
 *
 * or, about when my head starts exploding
 *
 */

var plays = [
  { artist: 'sampleA', track: '101' },
  { artist: 'sampleA', track: '101' },
  { artist: 'sampleB', track: '201' },
  { artist: 'sampleB', track: '201' },
  { artist: 'sampleB', track: '201' },
  { artist: 'sampleB', track: '201' },
  { artist: 'sampleB', track: '201' },
  { artist: 'sampleC', track: '301' },
  { artist: 'sampleD', track: '301' },
  { artist: 'sampleA', track: '201' },
]

function songToString(song) {
  return [song.artist, song.track].join(' - ');
}

var songCount = curry2(_.countBy)(songToString);

// ohhhhhhhhhh wait
// 
// becomes _.countBy takes two arguments so we're going to curry it right to
// left by giving it the function that builds the tag data for each song first
// (the rightmost parameeter fed to countBy)

// console.dir(songCount(plays));

/**
 *
 * Currying three parameters...
 *
 */

function curry3(fun) {
  return function(last) {
    return function(middle) {
      return function(first) {
        return fun(first, middle, last);
      };
    };
  };
};

var songsPlayed = curry3(_.uniq)(false)(songToString);

// console.dir(songsPlayed(plays));

function toHex(n) {
  var hex = n.toString(16);
  return (hex.length < 2) ? [0,hex].join('') : hex;
}

function rgbToHexString(r, g, b) {
  return['#', toHex(r), toHex(g), toHex(b)].join('');
}

// console.dir(rgbToHexString(255, 255, 255));
// console.dir(rgbToHexString(127, 15, 55));

var blueGreenish = curry3(rgbToHexString)(255)(200);

// console.dir(blueGreenish(0));
// console.dir(blueGreenish(100));
// console.dir(blueGreenish(255));

/**
 *
 * Fluent APIs
 *
 */

var greaterThan = curry2(function(lhs, rhs) {
  return lhs > rhs;
});

var lessThan = curry2(function(lhs, rhs) {
  return lhs < rhs;
});

var withinRange = checker(
  validator('arg must be a number', _.isNumber),
  validator('arg must be greater than 10', greaterThan(10)),
  validator('arg must be less than 20', lessThan(20))
);

// console.dir(withinRange(15));
// console.dir(withinRange(25));
// console.dir(withinRange(5));
// console.dir(withinRange(''));

/**
 *
 * Partial Application
 *
 * worth noting that in the footnotes here we're talking about using .bind as a
 * way to achieve partial application, AS IF THIS WAS NOT ALREADY CONFUSING
 * ENOUGH, ahem
 *
 * TODO: go back and actuallu understand .bind
 *
 */

function divPart(n) {
  return function(d) {
    return n / d;
  }
}

var over10Part = divPart(10);

// console.dir(over10Part(2));

function partial1(fun, arg1) {
  return function(/* args */) {
    var args = construct(arg1, arguments);
    return fun.apply(fun, args);
  }
}

var over10Part1 = partial1(div, 10);

// console.dir(over10Part1(2));
// console.dir(over10Part1(5));

function partial2(fun, arg1, arg2) {
  return function(/* args */) {
    var args = cat([arg1, arg2], arguments);
    return fun.apply(fun, args);
  }
}

var div10by2 = partial2(div, 10, 2);

// console.log(
//   "div10by2() -- " + 
//    div10by2()
// );

function partial(fun /*, pargs */) {
  var pargs = _.rest(arguments);

  return function(/* arguments */) {
    var args = cat(pargs, _.toArray(arguments));
    return fun.apply(fun, args);
  }
}

var over10Partial = partial(div, 10);

// console.log(
//   "over10Partial(2) -- " + 
//    over10Partial(2)
// );
// console.log(
//   "over10Partial(5) -- " + 
//    over10Partial(5)
// );

// Partial application: preconditions

var zero = validator("cannot be zero", function(n) {
  return 0 === n;
});

var number = validator("arg must be a number", _.isNumber);

function sqr(n) {
  if (!number(n)) {
    throw new Error(number.message)
  }

  if (zero(n)) {
    throw new Error(zero.message)
  }

  return n * n;
}

// console.log(
//   "sqr(5) -- " + 
//    sqr(5)
// );

// THese throw errors

// console.log(
//   "sqr(0) -- " + 
//    sqr(0)
// );

// console.log(
//   "sqr('') -- " + 
//    sqr('')
// );

function condition1(/* validators */) {
  var validators = _.toArray(arguments);

  return function(fun, arg) {
    var errors = mapcat(function(isValid) {
      return isValid(arg) ? [] : [isValid.message]
    }, validators);

    if (!_.isEmpty(errors)) {
      throw new Error(errors.join(", "));
    }

    return fun(arg);
  }
}

var sqrPre = condition1(
  validator('arg must not be zero', complement(zero)),
  validator('arg must be a number', _.isNumber)
);

// console.log(
//   "sqrPre(_.identity, 10) -- " + 
//    sqrPre(_.identity, 10)
// );

// console.log(
//   "sqrPre(function(n) { return n * n }, 25) -- " + 
//    sqrPre(function(n) { return n * n }, 25)
// );

// Here there be errors

// console.log(
//   "sqrPre(function(n) { return n * n }, '25') -- " + 
//    sqrPre(function(n) { return n * n }, '25')
// );

// console.log(
//   "sqrPre(function(n) { return n * n }, 0) -- " + 
//    sqrPre(function(n) { return n * n }, 0)
// );

// and put it all together...

function uncheckedSqr(n) {
  return n * n;
}

var checkedSqr = partial1(sqrPre, uncheckedSqr);

/**
 *
 * Which is to say you are taking a function in that will take multiple
 * arguments and are pre-setting the first argument; in this case sqrPre's first
 * argument will be uncheckedSqr, and it will await the number that we are
 * squaring. But because sqrPre is using condition1 it's creating a function
 * that is first running its second argument through the pre-check conditions.
 * This is clever and quite pretty. (condition1 itself takes in the validators
 * that sqrPre gives it and pops a function back out that takes in the function
 * we ultiately want to run and the arguments to that function.)
 *
 */

// console.log(
//   "checkedSqr(25) -- " + 
//    checkedSqr(25)
// );

function isEven(n) {
  return n % 2 === 0;
}

var sillySquare = partial1(
  condition1(validator('should be even', isEven)),
  checkedSqr
);

// console.log(
//   "sillySquare(3) -- " + 
//    sillySquare(3)
// );

/**
 *
 * "Functions that compose other functions should themselves compose.""
 *
 */

/**
 *
 * And yes somewhere in here, where we start recreating things from chapter 4, I
 * need to go back and re-document what all this is because I'm losing the
 * thread. BUt the key takeaway I've got, which is, we're letting these
 * functions all build on top of each other, and then we can pass them through
 * each other to do more and more customized work.
 *
 */


var validateCommand = condition1(
  validator("arg must be a map", _.isObject),
  validator("arg must have the correct keys", hasKeys('msg', 'type'))
);

var createCommand = partial(validateCommand, _.identity);

// createCommand({})
// createCommand(21)

// createCommand({
//   msg: '', 
//   type: ''
// });

var createLaunchCommand = partial1(
  condition1(
    validator('arg must have the count down', hasKeys('countDown'))
  ),
  createCommand
);

// createLaunchCommand({
//   msg: '',
//   type: ''
// })

// createLaunchCommand({
//   msg: '',
//   type: '',
//   countDown: ''
// })

/**
 *
 * Compose
 *
 */

var isntString = _.compose(function(x) { return !x }, _.isString);

console.log(
  "isntString({}) -- " + 
   isntString({})
);

console.log(
  "isntString('hello there') -- " + 
   isntString('hello there')
);

function not(x) { return !x };

var isntString = _.compose(not, _.isString);

console.log(
  "isntString({}) -- " + 
   isntString({})
);

console.log(
  "isntString('hello there') -- " + 
   isntString('hello there')
);

var composedMapcat = _.compose(splat(cat), _.map);

console.dir(composedMapcat([[1,2], [3,4], [5,6]], _.identity));

console.dir(_.map([[1,2, [3,4]], [3,4], [5,6]], _.identity));

/**
 *
 * Pre- and post-conditions with composition
 *
 */

var sqrPost = condition1(
  validator('result should be a number', _.isNumber),
  validator('result should not be zero', complement(zero)),
  validator('result should be positive', greaterThan(0))
)

sqrPost(_.identity, 100)

var megaCheckerSqr = _.compose(partial(sqrPost, _.identity), checkedSqr);

// megaCheckerSqr(NaN);

/**
 *
 * Spoiler alert: I get really fuzzy on the actual step by step logic of this
 * chapter. Going back through and documenting all the functions will be a good
 * exercise.
 *
 */
