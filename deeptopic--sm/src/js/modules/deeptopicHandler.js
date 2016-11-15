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
 * Our main handler function.
 */
function deeptopicHandler(e) {
  e.preventDefault();

  var trigger = e.target;
  var target = getTarget(trigger);

  switch (target.dataset.deeptopicExpanded) {
    case "progress":
      // Should probably be recording direction so progress could be reversed
      break;

    case "no":
      resetVars(target);
      openIt(target, trigger);
      break;

    case "yes":
      resetVars(target);
      closeIt(target, trigger);
      break;

    default:
      break;
  }
};


function resetVars(target) {
  animatedElement = target;
  attrs = getContentElementAttributes(animatedElement);
  iteration = 0;

  return;
}


function openIt(target, button) {
  changeButton(button, "less");

  if (attrs.totalHeight + animatedElement.getBoundingClientRect().top < window.innerHeight) {
    easeFunction = easingLibrary.easeInOutCubic;
  } else {
    easeFunction = easingLibrary.easeInCubic;
  }

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
  changeButton(button, "more");

  if (animatedElement.getBoundingClientRect().bottom < window.innerHeight) {
    easeFunction = easingLibrary.easeInOutCubic;
  } else {
    easeFunction = easingLibrary.easeOutExpo;
  }

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
 * Change the button text.
 */
function changeButton(button, term) {
  var txt = button.innerHTML;

  switch (term) {
    case "less":
      button.innerHTML = txt.replace(/more/, "less");
      break;

    case "more":
      button.innerHTML = txt.replace(/less/, "more");
      break;

    default:
      break;
  }
}

/**
 * Get the target of a trigger.
 */
function getTarget(trigger) {
  var id = trigger.dataset.deeptopicTrigger;

  var targetString = '[data-deeptopic-target="';
  targetString += id;
  targetString += '"]';

  return document.querySelector(targetString);
}


/**
 * There's some things we need to know to animate the element correctly.
 */
function getContentElementAttributes(el) {
  var contentElement = el.querySelector("[data-deeptopic-content]");
  var contentElementStyle = window.getComputedStyle(contentElement);

  console.log(contentElementStyle);

  var pTop = getPxValue(contentElementStyle.paddingTop);
  var pBottom = getPxValue(contentElementStyle.paddingBottom);

  console.log("pTop -- " + pTop);
  console.log("pBottom -- " + pBottom);

  if (pTop === 0) {
    contentElement.style.paddingTop = '1px';
  }

  if (pBottom === 0) {
    contentElement.style.paddingBottom = '1px';
  }

  var mTop = getPxValue(contentElementStyle.marginTop);
  var mBot = getPxValue(contentElementStyle.marginBottom);

  var totalHeight = contentElement.offsetHeight + mTop + mBot;

  if (pTop === 0) {
    contentElement.style.paddingTop = '';
  }

  if (pBottom === 0) {
    contentElement.style.paddingBottom = '';
  }

  return {
    el: contentElement,
    totalHeight: totalHeight
  };
}


function getPxValue(value) {
  return Number(value.match(/(\d+)px/)[1]);
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
module.exports = deeptopicHandler;

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
