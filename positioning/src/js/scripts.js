(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// Browserify handles scoping; so we don't need to IIFE this file.

var makeElement = require('./modules/makeElement');

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function () {
  // Let's get this party started.
  console.log("hello let us begin");

  // Start ading code.
  var wrapper = document.getElementById("items");
  var wrapperCoords = {
    top: wrapper.getBoundingClientRect().top,
    left: wrapper.getBoundingClientRect().left,
    right: wrapper.getBoundingClientRect().right,
    bottom: wrapper.getBoundingClientRect().bottom
  };

  console.log("Wrapper:");
  console.dir(wrapperCoords);

  var bodyEl = document.querySelector("body");
  var bodyElCoords = {
    top: bodyEl.getBoundingClientRect().top,
    left: bodyEl.getBoundingClientRect().left,
    right: bodyEl.getBoundingClientRect().right,
    bottom: bodyEl.getBoundingClientRect().bottom
  };

  console.log("Body:");
  console.dir(bodyElCoords);

  var itemA = document.getElementById("itemA");
  var itemACoords = {
    top: itemA.getBoundingClientRect().top,
    left: itemA.getBoundingClientRect().left,
    right: itemA.getBoundingClientRect().right,
    bottom: itemA.getBoundingClientRect().bottom
  };

  console.log("itemA:");
  console.dir(itemACoords);

  // create something
  // 

  var newItem = makeElement("hello", "div");
  newItem.style.position = "absolute";
  newItem.style.top = "100px";
  newItem.style.left = "200px";
  newItem.style.backgroundColor = "#323232";
  newItem.style.padding = "1rem";

  newItem.setAttribute("id", "moveme");

  document.body.appendChild(newItem);

  var newItemCoords = {
    top: newItem.getBoundingClientRect().top,
    left: newItem.getBoundingClientRect().left,
    right: newItem.getBoundingClientRect().right,
    bottom: newItem.getBoundingClientRect().bottom
  };

  console.log("newItem:");
  console.dir(newItemCoords);

  // create something
  // 

  var newItem = makeElement("hello", "div");
  newItem.style.position = "absolute";
  newItem.style.top = "500px";
  newItem.style.left = "800px";
  newItem.style.backgroundColor = "#cdcdcd";
  newItem.style.padding = "1rem";

  document.body.appendChild(newItem);

  var newItemCoords = {
    top: newItem.getBoundingClientRect().top,
    left: newItem.getBoundingClientRect().left,
    right: newItem.getBoundingClientRect().right,
    bottom: newItem.getBoundingClientRect().bottom
  };

  console.log("newItem:");
  console.dir(newItemCoords);

  // make a grid?

  console.log(window.innerHeight);

  for (var i = 0; i < window.innerWidth; i += 100) {
    var newLine = makeElement(false, "div");
    newLine.style.position = "fixed";
    newLine.style.top = "0px";
    newLine.style.left = i + "px";

    newLine.style.height = window.innerHeight + "px";
    newLine.style.width = "1px";

    newLine.style.backgroundColor = "#eeeeff";

    document.body.appendChild(newLine);
  }

  for (var i = 0; i < window.innerHeight; i += 100) {
    var newLine = makeElement(false, "div");
    newLine.style.position = "fixed";
    newLine.style.top = i + "px";
    newLine.style.left = 0;

    newLine.style.height = "1px";
    newLine.style.width = window.innerWidth + "px";

    newLine.style.backgroundColor = "#eeeeff";

    document.body.appendChild(newLine);
  }
});

// let's move something around a bit


// Easing library (whittle this down to just the functions we use)
var easingLibrary = require("./modules/easingLibrary");

//
// Easing/animation variables; Should this all be a config object?
//

// this function...
var easeFunction = easingLibrary.easeInOutCirc;

// will take these variables (in this order)...
var iteration = 0;
var startValueX;
var startValueY;
var changeInValueX;
var changeInValueY;
var totalIts = 45; // ~ 60/fps

// and generate this value...
var easingValueX;
var easingValueY;

// for this element...
var animatedElement;

// from this collection...
var currentIndex = 0;
var textObjects = [];

// in this direction...
var animationDirection = "out";

// unless we're locked
var lock = false;

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function () {
  // Let's get this party started.
  console.log("hello let us begin DOWN HERE");

  // Start ading code.

  var itemA = document.getElementById("itemA");

  itemA.addEventListener("click", function (e) {

    if (!lock) {

      lock = true;

      var wrapper = document.getElementById("items");
      var wrapperCoords = {
        top: wrapper.getBoundingClientRect().top,
        left: wrapper.getBoundingClientRect().left,
        right: wrapper.getBoundingClientRect().right,
        bottom: wrapper.getBoundingClientRect().bottom
      };

      animatedElement = document.getElementById("moveme");

      // startValueX = animatedElement.getBoundingClientRect().left - window.getComputedStyle(animatedElement).marginLeft.match(/\d+/)[0];
      // startValueY = animatedElement.getBoundingClientRect().top - window.getComputedStyle(animatedElement).marginTop.match(/\d+/)[0];

      startValueX = animatedElement.getBoundingClientRect().left;
      startValueY = animatedElement.getBoundingClientRect().top;

      animatedElement.style.position = "absolute";

      changeInValueX = coinFlip() ? 100 : -100;
      changeInValueY = coinFlip() ? 100 : -100;

      if (startValueX + changeInValueX < 0 || startValueX + changeInValueX > window.innerWidth) {
        changeInValueX = 0;
      }
      if (startValueY + changeInValueY < 0 || startValueY + changeInValueY > window.innerHeight) {
        changeInValueY = 0;
      }

      draw();
    }
  });
});

/**
 * Draw loop.
 */

function draw() {
  easingValueX = easeFunction(iteration, startValueX, changeInValueX, totalIts);
  easingValueY = easeFunction(iteration, startValueY, changeInValueY, totalIts);

  // animatedElement.el.innerHTML = animatedElement.text.substring(0, Math.round(easingValue));

  animatedElement.style.left = easingValueX + 'px';
  animatedElement.style.top = easingValueY + 'px';

  if (iteration < totalIts) {

    // there's a really really really long pause when we reach zero ... can we
    // cut that out?

    iteration++;
    requestAnimationFrame(draw);
  } else {
    lock = false;
    iteration = 0;
  }
}

function coinFlip() {
  return Math.floor(Math.random() * 2);
}

},{"./modules/easingLibrary":2,"./modules/makeElement":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

// Create a new element, possibly with some text in it, and return it.

var makeElement = function makeElement(text, elType) {
  var newEl = document.createElement(elType || "p");

  if (text) {
    var newText = document.createTextNode(text);
    newEl.appendChild(newText);
  }

  return newEl;
};

module.exports = makeElement;

},{}]},{},[1])

//# sourceMappingURL=scripts.js.map