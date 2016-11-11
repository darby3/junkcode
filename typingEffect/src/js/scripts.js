(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// Browserify handles scoping; so we don't need to IIFE this file.

// Sample module
var easingLibrary = require("./modules/easingLibrary");

// so basically in here we're going to need to do a handful of things:

// - animate the current element out
// - pause a bit if we're between animations
// - animate the next element in
// - pause a while longer if we're between animations
// - repeat (from beginning, if need be)

// to animate an element in or out I'm going to need it's total length and its text


//
// Easing/animation variables
//

// this function...
var easeFunction = easingLibrary.easeOutQuint;

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

// in this direction...
var animationDirection = "out";

// with some required attributes...
var contentElementAttributes = {};

// and thesse metavalues.
var direction;
var finalValue;

var currentIndex = 0;

var TextObject = function TextObject(el) {
  this.el = el;

  this.text = el.innerHTML;
  this.length = this.text.length;

  return this;
};

var textObjects = [];
var currentInex = 0;

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function () {
  // Let's get this party started.
  console.log("hello let us begin");

  var terms = document.querySelectorAll("[data-term]");
  var activeTerm = _.find(terms, function (item) {
    return item.dataset.active = "true";
  });

  _.each(terms, function (el) {
    textObjects.push(new TextObject(el));
  });

  console.dir(activeTerm);
  console.dir(textObjects);

  // lets draw through one element out based on its length

  startValue = textObjects[0].length;
  changeInValue = startValue * -1;

  totalIts = textObjects[0].length * 15; // 15 frames per letter, but eased of course...

  animatedElement = textObjects[0];
  currentIndex = 0;

  var goForIt = window.setTimeout(function () {
    draw();
  }, 2000);
});

function draw() {
  easingValue = easeFunction(iteration, startValue, changeInValue, totalIts);

  animatedElement.el.innerHTML = animatedElement.text.substring(0, Math.round(easingValue));

  if (animatedElement.el.innerHTML.length == 0) {
    animatedElement.el.innerHTML = '&nbsp;';
  }

  console.log("Math.round(easingValue) -- " + Math.round(easingValue));

  if (iteration < totalIts) {

    // there's a really really really long pause when we reach zero ... can we
    // cut that out?

    iteration++;
    requestAnimationFrame(draw);
  } else {
    if (animationDirection == "out") {
      animatedElement.el.setAttribute("data-active", "false");
    }
    setUpNext();
  }
}

function setUpNext() {

  console.log("setUpNext");
  if (animationDirection == "out") {
    currentIndex = currentIndex + 1 < textObjects.length ? currentIndex + 1 : 0;
  }

  animatedElement = textObjects[currentIndex];

  animationDirection = animationDirection == "out" ? "in" : "out";

  if (animationDirection == "in") {
    animatedElement.el.setAttribute("data-active", "true");
  }

  startValue = animationDirection == "in" ? 0 : animatedElement.length;
  changeInValue = animationDirection == "in" ? animatedElement.length : startValue * -1;

  iteration = 0;
  totalIts = animatedElement.length * 15; // 15 frames per letter, but eased of course...

  if (animationDirection == "out") {
    window.setTimeout(draw, 2000);
  } else {
    draw();
  }
}

},{"./modules/easingLibrary":2}],2:[function(require,module,exports){
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

},{}]},{},[1])

//# sourceMappingURL=scripts.js.map