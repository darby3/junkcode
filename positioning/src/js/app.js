// Browserify handles scoping; so we don't need to IIFE this file.

var makeElement = require('./modules/makeElement');

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function() {
  // Let's get this party started.
  console.log("hello let us begin");

  // Start ading code.
  var wrapper = document.getElementById("items");
  var wrapperCoords = {
    top: wrapper.getBoundingClientRect().top,
    left: wrapper.getBoundingClientRect().left,
    right: wrapper.getBoundingClientRect().right,
    bottom: wrapper.getBoundingClientRect().bottom
  }

  console.log("Wrapper:");
  console.dir(wrapperCoords);

  var bodyEl = document.querySelector("body");
  var bodyElCoords = {
    top: bodyEl.getBoundingClientRect().top,
    left: bodyEl.getBoundingClientRect().left,
    right: bodyEl.getBoundingClientRect().right,
    bottom: bodyEl.getBoundingClientRect().bottom
  }

  console.log("Body:");
  console.dir(bodyElCoords);

  var itemA = document.getElementById("itemA");
  var itemACoords = {
    top: itemA.getBoundingClientRect().top,
    left: itemA.getBoundingClientRect().left,
    right: itemA.getBoundingClientRect().right,
    bottom: itemA.getBoundingClientRect().bottom
  }

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
  }

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
  }

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
document.addEventListener('DOMContentLoaded', function() {
  // Let's get this party started.
  console.log("hello let us begin DOWN HERE");

  // Start ading code.

  var itemA = document.getElementById("itemA");

  itemA.addEventListener("click", function(e) {

    if (!lock) {

      lock = true;

      var wrapper = document.getElementById("items");
      var wrapperCoords = {
        top: wrapper.getBoundingClientRect().top,
        left: wrapper.getBoundingClientRect().left,
        right: wrapper.getBoundingClientRect().right,
        bottom: wrapper.getBoundingClientRect().bottom
      }

      animatedElement = document.getElementById("moveme");

      // startValueX = animatedElement.getBoundingClientRect().left - window.getComputedStyle(animatedElement).marginLeft.match(/\d+/)[0];
      // startValueY = animatedElement.getBoundingClientRect().top - window.getComputedStyle(animatedElement).marginTop.match(/\d+/)[0];

      startValueX = animatedElement.getBoundingClientRect().left;
      startValueY = animatedElement.getBoundingClientRect().top;

      animatedElement.style.position = "absolute";


      changeInValueX = (coinFlip()) ? 100 : -100;
      changeInValueY = (coinFlip()) ? 100 : -100;

      if (startValueX + changeInValueX < 0 || startValueX + changeInValueX > window.innerWidth) {
        changeInValueX = 0;
      }
      if (startValueY + changeInValueY < 0 || startValueY + changeInValueY > window.innerHeight) {
        changeInValueY = 0;
      }

      draw();

    }


  })
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
