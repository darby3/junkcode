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



/*================================================
=            Functions from chapter 1            =
================================================*/

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

/*================================================
=            Functions from Chapter 2            =
================================================*/

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

function div(x, y) {
  return x / y;
}

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

function complement(pred) {
  return function() {
    return !pred.apply(null, _.toArray(arguments));
  };
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

function mapcat(fun, coll) {
  return cat.apply(null, _.map(coll, fun));
}

function butLast(coll) {
  return _.toArray(coll).slice(0, -1);
}

function interpose(inter, coll) {
  return butLast(mapcat(function(e) {
    return construct(e, [inter]);
  }, coll))
};

function project(table, keys) {
  return _.map(table, function(obj) {
    return _.pick.apply(null, construct(obj, keys));
  })
}

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

function as(table, newNames) {
  return _.map(table, function(obj) {
    return rename(obj, newNames);
  })
}

function restrict(table, pred) {
  return _.reduce(table, function(newTable, obj) {
    if (truthy(pred(obj))) {
      return newTable;
    } else {
      return _.without(newTable, obj);
    }
  }, table);
};



/**
 * 
 * Chapter 3 - Variable Scope and Closures
 * 
 */


/**
 *
 * So there's a lot of stuff here about dynamic scope that I'm kind of skimming
 * over because I'm not sure exactly how interested I am in it...also I'm not
 * sure the specific description here is actually helpful to me,
 *
 */

/**
 *
 * Variable hoisting is a good thing to remember though.
 *
 */

/**
 *
 * Okay, closures are a good thing to review.
 *
 * Simplest closure: a first-class function that captures a local variable for
 * later use.
 *
 */

function whatWasTheLocal() {
  var captured = "Hello there";

  return function() {
    return "The local was: " + captured;
  }
};

var reportLocal = whatWasTheLocal();

// console.log(
//   "reportLocal() -- " + 
//    reportLocal()
// );

function createScaleFunction(factor) {
  return function(v) {
    return _.map(v, function(n) {
      return (n * factor);
    })
  }
}

var scale10 = createScaleFunction(10);
var scale100 = createScaleFunction(100);

var arrayOfNums = [ 1, 2, 3 ];

// console.log(
//   "scale10(arrayOfNums) -- " + 
//    scale10(arrayOfNums)
// );

// console.log(
//   "scale100(arrayOfNums) -- " + 
//    scale100(arrayOfNums)
// );

// console.log(
//   "scale10(scale100(arrayOfNums)) -- " + 
//    scale10(scale100(arrayOfNums))
// );

function makeAdder(captured) {
  return function(free) {
    return free + captured;
  }
}

var add10 = makeAdder(10);
var add100 = makeAdder(100);

// console.log(
//   "add10(32) -- " + 
//    add10(32)
// );

// console.log(
//   "add100(32) -- " + 
//    add100(32)
// );

function averageDamp(fun) {
  return function(n) {
    return average([n, fun(n)])
  }
}

var averageSq = averageDamp(function(n) {
  return n * n;
});

// console.log(
//   "averageSq(10) -- " + 
//    averageSq(10)
// );

// console.log(
//   "averageSq(100) -- " + 
//    averageSq(100)
// );

var averageOfTimesTwo = averageDamp(function(n) {
  return n * 2;
})

// console.log(
//   "averageOfTimesTwo(10) -- " + 
//    averageOfTimesTwo(10)
// );

// console.log(
//   "averageOfTimesTwo(100) -- " + 
//    averageOfTimesTwo(100)
// );

function plucker(field) {
  return function(obj) {
    return (obj && obj[field]);
  };
};

var best = {
  title: 'Infinite Jest',
  author: 'DFW'
}

var getTitle = plucker('title');

// console.log(
//   "getTitle(best) -- " + 
//    getTitle(best)
// );

var books = [{
  title: 'Chthon',
}, {
  stars: 5,
}, {
  title: 'Botchan',
}]

var third = plucker(2);

// console.log(
//   "third(books) -- " + 
//    third(books)
// );

// console.dir(third(books));

var finalResult = _.filter(books, getTitle);

// finalResult.forEach(logEach);

/*===========================
=            hmm            =
===========================*/

// sep('hmm');

var objectThing = { name: 'Joe' };

// console.log(
//   "objectThing -- " + 
//    objectThing
// );

// console.log(
//   "(objectThing && true) -- " + 
//    (objectThing && true)
// );

// console.log(
//   "(true && objectThing) -- " + 
//    (true && objectThing)
// );

// console.log(
//   "objectThing['name'] -- " + 
//    objectThing['name']
// );

// console.log(
//   "(objectThing && objectThing['name']) -- " + 
//    (objectThing && objectThing['name'])
// );

// console.log(
//   "(objectThing && objectThing['dumpy']) -- " + 
//    (objectThing && objectThing['dumpy'])
// );