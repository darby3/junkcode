(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// Browserify handles scoping; so we don't need to IIFE this file.

// Sample module
var helloWorld = require("./modules/helloWorld");

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function () {
  // Let's get this party started.
  console.log("hello let us begin");

  // Invoke a module.
  helloWorld();

  // Start ading code.
  var filters = document.getElementById("filters");

  filters.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-target")) {
      console.log("button");
      console.dir(e.target);

      var totalGroup = document.querySelectorAll("[data-group]");
      var groupToVanish = e.target.getAttribute("data-target");

      console.log("groupToVanish -- " + groupToVanish);

      _.each(totalGroup, function (element, index, list) {

        // console.dir(element.dataset);

        if (element.dataset.group === groupToVanish) {
          element.classList.add("gone");
        }
      });
    }
  });
});

},{"./modules/helloWorld":2}],2:[function(require,module,exports){
"use strict";

// Say hello! A tiny module!

var helloWorld = function helloWorld() {
  console.log("Hello, from a module!");
};

module.exports = helloWorld;

},{}]},{},[1])

//# sourceMappingURL=scripts.js.map