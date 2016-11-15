(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// Browserify handles scoping; so we don't need to IIFE this file.

// Sample module
var helloWorld = require("./modules/helloWorld");

var count = 0;

//
// This method uses underscore's debounce or throttle functions to limit the
// rate of the scroll handler firing
//

// // document content loaded wrapper
// document.addEventListener('DOMContentLoaded', function() {
//   // Let's get this party started.
//   console.log("hello let us begin");

//   // Invoke a module.
//   helloWorld();

//   // Start ading code.

//   window.addEventListener("scroll", throttleHandler);

// });


// var throttleHandler = _.throttle(scrollHandler, 500);

// function scrollHandler(e) {
//   console.log(e);

//   var box = document.getElementById("stats");

//   count += 1;

//   box.innerHTML = count;
// }


//
// For funsies let's try using requestAnimationFrame
// (https://developer.mozilla.org/en-US/docs/Web/Events/scroll)
//


var last_known_scroll_position = 0;
var ticking = false;

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function () {
  // Let's get this party started.
  console.log("hello let us begin");

  // Invoke a module.
  helloWorld();

  // Start ading code.

  window.addEventListener("scroll", scrollHandler);
});

function scrollHandler(e) {

  // console.log("scroll handler");
  last_known_scroll_position = window.scrollY;
  if (ticking) {
    console.log("in the ticking check");
  }

  if (!ticking) {
    window.requestAnimationFrame(function (DOMHighResTimeStamp) {
      var box = document.getElementById("stats");
      count += 1;
      box.innerHTML = count;

      // var arrayThing = [];
      // for (var i = 0; i < 100000000; i++) {
      //   arrayThing[i] = Math.random() * Math.random();
      // }


      window.setTimeout(function () {
        ticking = false;
        console.log("ticking now false");
      }, 500);
    });
  }

  ticking = true;
  // console.log("ticking -- " + ticking);
}

},{"./modules/helloWorld":2}],2:[function(require,module,exports){
"use strict";

// Say hello! A tiny module!

var helloWorld = function helloWorld() {
  console.log("Hello, from a module!");
};

module.exports = helloWorld;

},{}]},{},[1])

//# sourceMappingURL=scripts.js.map