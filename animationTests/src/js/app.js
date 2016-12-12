// Browserify handles scoping; so we don't need to IIFE this file.

// Easing library (whittle this down to just the functions we use)
var easingLibrary = require("./modules/easingLibrary");

//
// Easing/animation variables; Should this all be a config object?
//

// this function...
var easeFunction = easingLibrary.easeOutQuint;

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

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function() {
  // Let's get this party started.
  console.log("hello let us begin");

  // Start ading code.

  var itemA = document.getElementById("itemA");

  itemA.addEventListener("click", function(e) {

    var wrapper = document.getElementById("items");
    var wrapperCoords = {
      top:    wrapper.getBoundingClientRect().top,
      left:   wrapper.getBoundingClientRect().left,
      right:  wrapper.getBoundingClientRect().right,
      bottom: wrapper.getBoundingClientRect().bottom
    }

    animatedElement = itemA;

    startValueX = animatedElement.getBoundingClientRect().left - window.getComputedStyle(animatedElement).marginLeft.match(/\d+/)[0];
    startValueY = animatedElement.getBoundingClientRect().top - window.getComputedStyle(animatedElement).marginTop.match(/\d+/)[0];

    animatedElement.style.position = "absolute";


    changeInValueX = startValueX - wrapper.getBoundingClientRect().left;
    changeInValueY = startValueY - wrapper.getBoundingClientRect().top;

    draw();
  })
});




/**
 * Draw loop.
 */

function draw() {
  easingValueX = easeFunction(iteration, startValueX, changeInValueX, totalIts);
  easingValueY = easeFunction(iteration, startValueY, changeInValueY, totalIts);

  // animatedElement.el.innerHTML = animatedElement.text.substring(0, Math.round(easingValue));

  animatedElement.style.left = easingValueX+'px';
  animatedElement.style.top = easingValueY+'px';

  if (iteration < totalIts) {

    // there's a really really really long pause when we reach zero ... can we
    // cut that out?

    iteration++;
    requestAnimationFrame(draw);
  }
}
