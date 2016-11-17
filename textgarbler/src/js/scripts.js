(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// Browserify handles scoping; so we don't need to IIFE this file.

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function () {
  // Let's get this party started.
  console.log("hello let us begin");

  // Start ading code.
  var button = document.getElementById("garbler");
  var input = document.getElementById("textToGarble");
  var output = document.getElementById("output");

  button.addEventListener("click", function (e) {
    e.preventDefault();

    console.log("activate");

    handleIt(input.value, output);
  });
});

function handleIt(inputText, outputEl) {

  // assign it
  var checkText = inputText;

  // check it for a condition
  if (checkText.charAt(0) === '@') {
    checkText = checkText.substr(1);
  }

  // split it up into an array
  var garbledArray = checkText.split('');

  // do more things to the array
  garbledArray = _.shuffle(garbledArray);

  // collapse the array
  var garbledText = garbledArray.join('');

  // spit it out
  outputEl.innerHTML = garbledText;
}

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function coinFlip() {
  return Math.floor(Math.random() * 2);
}

},{}]},{},[1])

//# sourceMappingURL=scripts.js.map