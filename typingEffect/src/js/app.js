// Browserify handles scoping; so we don't need to IIFE this file.

// Easing library (whittle this down to just the functions we use)
var easingLibrary = require("./modules/easingLibrary");

// so basically in here we're going to need to do a handful of things:
//
// - animate the current element out
// - pause a bit if we're between animations
// - animate the next element in
// - pause a while longer if we're between animations
// - repeat (from beginning, if need be)
//
// to animate an element in or out I'm going to need it's total length and its text


//
// Easing/animation variables; Should this all be a config object?
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

// from this collection...
var currentIndex = 0;
var textObjects = [];

// in this direction...
var animationDirection = "out";

// Store the text and the lengths
var TextObject = function(el) {
  this.el = el;

  this.text = el.innerHTML;
  this.length = this.text.length;

  return this;
}

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function() {
  // should dump most of this into an init function for re-use (i.e. the setItUp function below)

  var terms = document.querySelectorAll("[data-term]");
  var activeTerm = _.find(terms, function(item) {
    return item.dataset.active = "true";
  })

  _.each(terms, function(el) {
    textObjects.push(new TextObject(el))
  })

  console.dir(activeTerm);
  console.dir(textObjects);

  // lets draw through the first element

  startValue = textObjects[0].length;
  changeInValue = startValue * -1;

  totalIts = textObjects[0].length * 15; // 15 frames per letter, but eased of course...

  animatedElement = textObjects[0];
  currentIndex = 0;

  var goForIt = window.setTimeout(function() {
    draw();
  }, 2000);
});

/**
 * Draw loop.
 */
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
  if (animationDirection == "out") {
    currentIndex = (currentIndex + 1 < textObjects.length) ? currentIndex + 1 : 0;
  }

  animatedElement = textObjects[currentIndex];
  animationDirection = (animationDirection == "out") ? "in" : "out";

  if (animationDirection == "in") {
    animatedElement.el.setAttribute("data-active", "true");
  }

  startValue = (animationDirection == "in") ? 0 : animatedElement.length;
  changeInValue = (animationDirection == "in") ? animatedElement.length : startValue * -1;

  iteration = 0;
  totalIts = animatedElement.length * 15; // 15 frames per letter, but eased of course...

  if (animationDirection == "out") {
    window.setTimeout(draw, 2000);
  } else {
    draw();
  }
}
