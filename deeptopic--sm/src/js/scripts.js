(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// Browserify handles scoping; so we don't need to IIFE this file.

var deeptopicHandler = require("./modules/deeptopicHandler");

// Sample module
var helloWorld = require("./modules/helloWorld");

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function () {
  // Let's get this party started.
  console.log("hello let us begin");

  // Invoke a module.
  helloWorld();

  // Start ading code.

  // Main event listeners

  document.addEventListener("click", function (e) {
    clickHandler(e);
  });
});

//
// plumbing
//

function clickHandler(e) {
  if (e.target.hasAttribute("data-deepTopic-trigger")) {
    deeptopicHandler(e);
  }
}

},{"./modules/deeptopicHandler":2,"./modules/helloWorld":4}],2:[function(require,module,exports){
"use strict";

var easingLibrary = require("./easingLibrary");

// this function...
var easeFunction;

// will take these variables (in this order)...
var iteration = 0;
var startValue;
var changeInValue;
var totalIts = 55; // ~ 60/fps

// and generate this value...
var easingValue;

// for this element...
var animatedElement;
var attrs;

// with some required attributes...
var contentElementAttributes = {};

// and thesse metavalues.
var direction;
var finalValue;

/**
 * Our main handler function.
 */
function deeptopicHandler(e) {
  e.preventDefault();

  var trigger = e.target;
  var target = getTarget(trigger);

  switch (target.dataset.deeptopicExpanded) {
    case "progress":
      // Should probably be recording direction so progress could be reversed
      break;

    case "no":
      resetVars(target);
      openIt(target, trigger);
      break;

    case "yes":
      resetVars(target);
      closeIt(target, trigger);
      break;

    default:
      break;
  }
};

function resetVars(target) {
  animatedElement = target;
  attrs = getContentElementAttributes(animatedElement);
  iteration = 0;

  return;
}

function openIt(target, button) {
  changeButton(button, "less");

  if (attrs.totalHeight + animatedElement.getBoundingClientRect().top < window.innerHeight) {
    easeFunction = easingLibrary.easeInOutCubic;
  } else {
    easeFunction = easingLibrary.easeInCubic;
  }

  startValue = 0;
  changeInValue = startValue + attrs.totalHeight;

  direction = "down";
  finalValue = "yes";

  // Set our progress flag
  animatedElement.setAttribute("data-deeptopic-expanded", "progress");

  // Trigger the draw loop
  draw();
}

function closeIt(target, button) {
  changeButton(button, "more");

  if (animatedElement.getBoundingClientRect().bottom < window.innerHeight) {
    easeFunction = easingLibrary.easeInOutCubic;
  } else {
    easeFunction = easingLibrary.easeOutExpo;
  }

  startValue = attrs.totalHeight;
  changeInValue = startValue * -1;

  direction = "up";
  finalValue = "no";

  // Set our progress flag
  animatedElement.setAttribute("data-deeptopic-expanded", "progress");

  // Trigger the draw loop
  draw();
}

/**
 * Change the button text.
 */
function changeButton(button, term) {
  var txt = button.innerHTML;

  switch (term) {
    case "less":
      button.innerHTML = txt.replace(/more/, "less");
      break;

    case "more":
      button.innerHTML = txt.replace(/less/, "more");
      break;

    default:
      break;
  }
}

/**
 * Get the target of a trigger.
 */
function getTarget(trigger) {
  var id = trigger.dataset.deeptopicTrigger;

  var targetString = '[data-deeptopic-target="';
  targetString += id;
  targetString += '"]';

  return document.querySelector(targetString);
}

/**
 * There's some things we need to know to animate the element correctly.
 */
function getContentElementAttributes(el) {
  var contentElement = el.querySelector("[data-deeptopic-content]");
  var contentElementStyle = window.getComputedStyle(contentElement);

  console.log(contentElementStyle);

  var pTop = getPxValue(contentElementStyle.paddingTop);
  var pBottom = getPxValue(contentElementStyle.paddingBottom);

  console.log("pTop -- " + pTop);
  console.log("pBottom -- " + pBottom);

  if (pTop === 0) {
    contentElement.style.paddingTop = '1px';
  }

  if (pBottom === 0) {
    contentElement.style.paddingBottom = '1px';
  }

  var mTop = getPxValue(contentElementStyle.marginTop);
  var mBot = getPxValue(contentElementStyle.marginBottom);

  var totalHeight = contentElement.offsetHeight + mTop + mBot;

  if (pTop === 0) {
    contentElement.style.paddingTop = '';
  }

  if (pBottom === 0) {
    contentElement.style.paddingBottom = '';
  }

  return {
    el: contentElement,
    totalHeight: totalHeight
  };
}

function getPxValue(value) {
  return Number(value.match(/(\d+)px/)[1]);
}

/**
 * Draw loop
 */
function draw() {
  easingValue = easeFunction(iteration, startValue, changeInValue, totalIts);
  animatedElement.style.height = easingValue + 'px';

  // continue the draw loop or exit out, depending
  if (iteration < totalIts) {
    iteration++;
    requestAnimationFrame(draw);
  } else {
    animatedElement.setAttribute("data-deeptopic-expanded", finalValue);
  }
}

// the main Accordion Handler function
module.exports = deeptopicHandler;

// So basically we're going to need to:
// - reset / set our animation variables
//   - total iterations might be dynamic based on how tall the item is... i.e.
//     if it's longer than the screen or shorter than the screen we might want
//     it to time a little differently...but we can tackle that later
// - set the progress flag
// - trigger the draw loop
// - clean up when we're done
//
// for now we're going to just jump right in to the animation for testing
// purposes

},{"./easingLibrary":3}],3:[function(require,module,exports){
"use strict";

// Easing functions
// https://www.kirupa.com/js/easing.js

/*
 * This is a near-direct port of Robert Penner's easing equations. Please shower Robert with
 * praise and all of your admiration. His license is provided below.
 *
 * For information on how to use these functions in your animations, check out:
 * http://www.kirupa.com/html5/animating_with_easing_functions_in_javascript.htm
 *
 * -Kirupa
 */

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

var easingLibrary = {
  linearEase: function linearEase(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * currentIteration / totalIterations + startValue;
  },

  easeInQuad: function easeInQuad(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (currentIteration /= totalIterations) * currentIteration + startValue;
  },

  easeOutQuad: function easeOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
    return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
  },

  easeInOutQuad: function easeInOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * currentIteration * currentIteration + startValue;
    }
    return -changeInValue / 2 * (--currentIteration * (currentIteration - 2) - 1) + startValue;
  },

  easeInCubic: function easeInCubic(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow(currentIteration / totalIterations, 3) + startValue;
  },

  easeOutCubic: function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
  },

  easeInOutCubic: function easeInOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * Math.pow(currentIteration, 3) + startValue;
    }
    return changeInValue / 2 * (Math.pow(currentIteration - 2, 3) + 2) + startValue;
  },

  easeInQuart: function easeInQuart(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow(currentIteration / totalIterations, 4) + startValue;
  },

  easeOutQuart: function easeOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
    return -changeInValue * (Math.pow(currentIteration / totalIterations - 1, 4) - 1) + startValue;
  },

  easeInOutQuart: function easeInOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * Math.pow(currentIteration, 4) + startValue;
    }
    return -changeInValue / 2 * (Math.pow(currentIteration - 2, 4) - 2) + startValue;
  },

  easeInQuint: function easeInQuint(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow(currentIteration / totalIterations, 5) + startValue;
  },

  easeOutQuint: function easeOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 5) + 1) + startValue;
  },

  easeInOutQuint: function easeInOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * Math.pow(currentIteration, 5) + startValue;
    }
    return changeInValue / 2 * (Math.pow(currentIteration - 2, 5) + 2) + startValue;
  },

  easeInSine: function easeInSine(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (1 - Math.cos(currentIteration / totalIterations * (Math.PI / 2))) + startValue;
  },

  easeOutSine: function easeOutSine(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.sin(currentIteration / totalIterations * (Math.PI / 2)) + startValue;
  },

  easeInOutSine: function easeInOutSine(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue / 2 * (1 - Math.cos(Math.PI * currentIteration / totalIterations)) + startValue;
  },

  easeInExpo: function easeInExpo(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow(2, 10 * (currentIteration / totalIterations - 1)) + startValue;
  },

  easeOutExpo: function easeOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
  },

  easeInOutExpo: function easeInOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * Math.pow(2, 10 * (currentIteration - 1)) + startValue;
    }
    return changeInValue / 2 * (-Math.pow(2, -10 * --currentIteration) + 2) + startValue;
  },

  easeInCirc: function easeInCirc(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (1 - Math.sqrt(1 - (currentIteration /= totalIterations) * currentIteration)) + startValue;
  },

  easeOutCirc: function easeOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.sqrt(1 - (currentIteration = currentIteration / totalIterations - 1) * currentIteration) + startValue;
  },

  easeInOutCirc: function easeInOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * (1 - Math.sqrt(1 - currentIteration * currentIteration)) + startValue;
    }
    return changeInValue / 2 * (Math.sqrt(1 - (currentIteration -= 2) * currentIteration) + 1) + startValue;
  }
};

module.exports = easingLibrary;

},{}],4:[function(require,module,exports){
"use strict";

// Say hello! A tiny module!

var helloWorld = function helloWorld() {
  console.log("Hello, from a module!");
};

module.exports = helloWorld;

},{}]},{},[1])

//# sourceMappingURL=scripts.js.map