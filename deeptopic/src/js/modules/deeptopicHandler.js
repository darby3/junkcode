var easingLibrary = require("./easingLibrary");

// this function...
var easeFunction;

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

// with some required attributes...
var contentElementAttributes = {};

// and thesse metavalues.
var direction;
var finalValue;


/**
 * There's some things we need to know to animate the element correctly.
 */
function getContentElementAttributes(el) {

  console.dir(el);
  var aEC = el.querySelector("[data-deeptopic-content]");
  var aECstyle = window.getComputedStyle(aEC);
  var mTop = Number(aECstyle.marginTop.match(/(\d+)px/)[1]);
  var mBot = Number(aECstyle.marginBottom.match(/(\d+)px/)[1]);

  var totalHeight = aEC.offsetHeight + mTop + mBot;

  return {
    el: aEC,
    totalHeight: totalHeight
  };
}

function setAnimatedElement(target) {
  animatedElement = target;
  attrs = getContentElementAttributes(animatedElement);
}

function openIt(target, button) {
  // Change button text
  var txt = button.innerHTML;
  button.innerHTML = txt.replace(/more/, "less");

  // Reset our animation variables / attributes
  setAnimatedElement(target);

  var elTop = animatedElement.getBoundingClientRect().top;
  // console.log("elTop -- " + elTop);

  if (attrs.totalHeight + animatedElement.getBoundingClientRect().top < window.innerHeight) {
    easeFunction = easingLibrary.easeInOutCubic;
  } else {
    easeFunction = easingLibrary.easeInCubic;
  }

  iteration = 0;
  startValue = 0;
  changeInValue = startValue + attrs.totalHeight;

  direction = "down";
  finalValue = "yes";

  // Set our progress flag
  animatedElement.setAttribute("data-deeptopic-expanded", "progress");

  // Trigger the draw loop
  draw();
}

function closeIt(target, button) {
  // Change button text
  var txt = button.innerHTML;
  button.innerHTML = txt.replace(/less/, "more");

  // Reset our animation variables / attributes
  setAnimatedElement(target);

  var elTop = animatedElement.getBoundingClientRect().top;
  console.log("elTop -- " + elTop);

  if (animatedElement.getBoundingClientRect().bottom < window.innerHeight) {
    easeFunction = easingLibrary.easeInOutCubic;
  } else {
    easeFunction = easingLibrary.easeOutExpo;
  }

  iteration = 0;
  startValue = attrs.totalHeight;
  changeInValue = startValue * -1;

  direction = "up";
  finalValue = "no";

  // Set our progress flag
  animatedElement.setAttribute("data-deeptopic-expanded", "progress");

  // Trigger the draw loop
  draw();
}

/**
 * Draw loop
 */
function draw() {
  easingValue = easeFunction(iteration, startValue, changeInValue, totalIts);
  animatedElement.style.height = easingValue + 'px';

  // continue the draw loop or exit out, depending
  if (iteration < totalIts) {
    iteration++;
    requestAnimationFrame(draw);
  } else {
    animatedElement.setAttribute("data-deeptopic-expanded", finalValue);
  }
}

// the main Accordion Handler function
module.exports = function(e) {
  e.preventDefault();

  // console.dir(e.target);

  var targetID = e.target.dataset.deeptopicTrigger;
  // console.dir(e.targetID);
  var target = document.querySelector('[data-deeptopic-target="' + targetID + '"]');

  // console.dir(target);

  switch (target.dataset.deeptopicExpanded) {
    case "progress":
      break;

    case "yes":
      closeIt(target, e.target);
      break;

    case "no":
      openIt(target, e.target);
      break;

    default:
      break;
  }
};

// So basically we're going to need to:
// - reset / set our animation variables
//   - total iterations might be dynamic based on how tall the item is... i.e.
//     if it's longer than the screen or shorter than the screen we might want
//     it to time a little differently...but we can tackle that later
// - set the progress flag
// - trigger the draw loop
// - clean up when we're done
//
// for now we're going to just jump right in to the animation for testing
// purposes
