(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// Browserify handles scoping; so we don't need to IIFE this file.

// Sample module
var helloWorld = require("./modules/helloWorld");

var count = 0;

//
// For funsies let's try using requestAnimationFrame
// (https://developer.mozilla.org/en-US/docs/Web/Events/scroll)
//
// I branched this off the scrollHandler demo; I should look into
// https://developer.mozilla.org/en-US/docs/Web/Events/resize#Example to see if
// that can do more for me than I'm doing here
//


var ticking = false;

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function () {
  // Let's get this party started.
  console.log("hello let us begin");

  // Invoke a module.
  helloWorld();

  // Start ading code.

  window.addEventListener("resize", resizeHandler);
});

function resizeHandler(e) {

  // console.log("scroll handler");
  if (ticking) {
    // console.log("in the ticking check");
  }

  if (!ticking) {
    window.requestAnimationFrame(function (DOMHighResTimeStamp) {

      // console.log("requestAnimationFrame called");

      var box = document.getElementById("stats");

      var sizestats = '';
      sizestats += window.innerWidth + 'px';
      sizestats += ', <br />';
      sizestats += window.innerHeight + 'px';

      box.innerHTML = sizestats;

      var boxheight = getPxValue(window.getComputedStyle(box).height);

      console.log("window.getComputedStyle(box).height -- " + window.getComputedStyle(box).height);

      console.log("boxheight -- " + boxheight);

      var boxPos = window.innerHeight / 2 - boxheight / 2;

      console.log("boxPos -- " + boxPos);
      box.style.top = boxPos + "px";

      box.style.width = "10vw";
      box.style.height = "10vw";

      // window.setTimeout(function() {
      ticking = false;
      // console.log("ticking now false");
      // }, 1000)
    });
  }

  ticking = true;
}

function getPxValue(value) {
  return Number(value.match(/([\d.]+)px/)[1]);
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