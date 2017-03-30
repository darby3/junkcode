(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// Browserify handles scoping; so we don't need to IIFE this file.

// Sample module
var helloWorld = require("./modules/helloWorld");

var targetImage;
var newImage;

var tnBox = document.getElementById("thumbnail_box");

var engaged;

// this could be replaced with timing functionality to smooth it out a bit
var increment = 0.035;

// for image preloading?
var loadingImage = new Image();
loadingImage.addEventListener("load", function () {
  console.log("loadingImage done");
});

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function () {
  // Let's get this party started.
  console.log("hello let us begin");

  // Invoke a module.
  helloWorld();

  var tnails = tnBox.children;
  for (var i = 0; i < tnails.length; i++) {
    tnails[i].dataset.active = "false";
  }

  // preload images
  var images = document.querySelectorAll("img[data-target]");
  console.log(images.length);
  preload(images);

  // Start ading code.
  tnBox.addEventListener("click", startTransition);
});

function startTransition(e) {
  if (engaged || e.target.dataset.active !== "false") {
    e.preventDefault();
    return;
  }

  engaged = true;

  var tnails = tnBox.children;
  for (var i = 0; i < tnails.length; i++) {
    tnails[i].dataset.active = "false";
  }

  e.target.dataset.active = "true";

  newImage = e.target.dataset.target;
  targetImage = document.getElementById("fullImage");

  // start poreloading the image
  loadingImage.src = newImage;

  targetImage.style.opacity = 1;

  drawOut();
}

function drawOut() {
  if (targetImage.style.opacity > 0) {
    targetImage.style.opacity = targetImage.style.opacity - increment;
    requestAnimationFrame(drawOut);
  } else {
    targetImage.src = newImage;
    targetImage.style.opacity = 0;

    targetImage.addEventListener("load", endTransition);
  }
}

function endTransition() {
  console.log("transition finishing now");
  drawIn();
}

function drawIn() {
  if (targetImage.style.opacity == 0) {
    targetImage.style.opacity = increment;
  }

  if (targetImage.style.opacity < 1) {
    targetImage.style.opacity = parseFloat(targetImage.style.opacity) + increment;
    requestAnimationFrame(drawIn);
  } else {
    targetImage.style.opacity = 1;

    engaged = false;
  }
}

function preload(images) {
  var imageArray = [];
  for (var pri = 0; pri < images.length; pri++) {
    imageArray.push(new Image());

    imageArray[pri].src = images[pri].dataset.target;

    imageArray[pri].addEventListener("load", function () {
      console.log("loadingImage done", this.src);
    });
  }
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