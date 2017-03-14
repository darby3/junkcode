/**
 *
 * This isn't really a library file, more of a convenient file to copy-paste
 * from. And I copy in some things I'm sure I won't need and I probably leave
 * out some things I wish were in here.
 *
 * This might also be a useful starting point for the exercise of documenting
 * how all this stuff works for myself.
 *
 */


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

/*================================================
=            Functions from Chapter 3            =
================================================*/

function whatWasTheLocal() {
  var captured = "Hello there";

  return function() {
    return "The local was: " + captured;
  }
};

function createScaleFunction(factor) {
  return function(v) {
    return _.map(v, function(n) {
      return (n * factor);
    })
  }
}

function makeAdder(captured) {
  return function(free) {
    return free + captured;
  }
}

function averageDamp(fun) {
  return function(n) {
    return average([n, fun(n)])
  }
}

var add10 = makeAdder(10);
var add100 = makeAdder(100);

var averageSq = averageDamp(function(n) {
  return n * n;
});

function plucker(field) {
  return function(obj) {
    return (obj && obj[field]);
  };
};

/*================================================
=            Functions from Chapter 4            =
================================================*/

function finder(valueFun, bestFun, coll) {
  return _.reduce(coll, function(best, current) {
    var bestValue = valueFun(best);
    var currentValue = valueFun(current);

    return (bestValue === bestFun(bestValue, currentValue)) ? best : current;
  });
}

function best(fun, coll) {
  return _.reduce(coll, function(x, y) {
    return fun(x, y) ? x : y;
  })
}

function repeat(times, value) {
  return _.map(_.range(times), function() {
    return value;
  })
}

function repeatedly(times, fun) {
  return _.map(_.range(times), fun)
}

function iterateUntil(fun, check, init) {
  var ret = [];
  var result = fun(init);

  while (check(result)) {
    ret.push(result);
    result = fun(result);
  };

  return ret;
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

var rev = invoker('reverse', Array.prototype.reverse);

var concatter = invoker('concat', Array.prototype.concat);

function makeUniqueStringFunction(start) {
  var counter = start;

  return function(prefix) {
    return [prefix, counter++].join('');
  }
}

var uniqueString = makeUniqueStringFunction(0);

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

var safeMult = fnull(function(total, n) {
  return total * n;
}, 1, 1);

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

function aMap(obj) {
  return _.isObject(obj);
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

/*================================================
=            Functions from Chapter 5            =
================================================*/

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

function isa(type, action) {
  return function(obj) {
    if (type === obj.type) {
      return action(obj);
    }
  }
}

function curry(fun) {
  return function(arg) {
    return fun(arg);
  }
}

function curry2(fun) {
  return function(secondArg) {
    return function(firstArg) {
      return fun(firstArg, secondArg);
    };
  };
}

function curry3(fun) {
  return function(last) {
    return function(middle) {
      return function(first) {
        return fun(first, middle, last);
      };
    };
  };
};

function toHex(n) {
  var hex = n.toString(16);
  return (hex.length < 2) ? [0,hex].join('') : hex;
}

function rgbToHexString(r, g, b) {
  return['#', toHex(r), toHex(g), toHex(b)].join('');
}

var blueGreenish = curry3(rgbToHexString)(255)(200);

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

function partial1(fun, arg1) {
  return function(/* args */) {
    var args = construct(arg1, arguments);
    return fun.apply(fun, args);
  }
}

function partial2(fun, arg1, arg2) {
  return function(/* args */) {
    var args = cat([arg1, arg2], arguments);
    return fun.apply(fun, args);
  }
}

function partial(fun /*, pargs */) {
  var pargs = _.rest(arguments);

  return function(/* arguments */) {
    var args = cat(pargs, _.toArray(arguments));
    return fun.apply(fun, args);
  }
}

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

function uncheckedSqr(n) {
  return n * n;
}

var checkedSqr = partial1(sqrPre, uncheckedSqr);

function isEven(n) {
  return n % 2 === 0;
}

var validateCommand = condition1(
  validator("arg must be a map", _.isObject),
  validator("arg must have the correct keys", hasKeys('msg', 'type'))
);

var createCommand = partial(validateCommand, _.identity);

var createLaunchCommand = partial1(
  condition1(
    validator('arg must have the count down', hasKeys('countDown'))
  ),
  createCommand
);

function not(x) { return !x };

var isntString = _.compose(not, _.isString);

var composedMapcat = _.compose(splat(cat), _.map);

var sqrPost = condition1(
  validator('result should be a number', _.isNumber),
  validator('result should not be zero', complement(zero)),
  validator('result should be positive', greaterThan(0))
)

var megaCheckerSqr = _.compose(partial(sqrPost, _.identity), checkedSqr);
