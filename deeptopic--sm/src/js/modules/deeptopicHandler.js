var easingLibrary = require("./easingLibrary");

// this function...
var easeFunction;

// will take these variables (in this order)...
var iteration = 0;
var startValue;
var changeInValue;
var totalIts = 35; // ~ 60/fps

// and generate this value...
var easingValue;

// for this element...
var animatedElement;

// with some required attributes...
var contentElementHeight;

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

/**
 * Reset vars.
 */
function resetVars(target) {
  animatedElement = target;
  setContentElementHeight(animatedElement);

  iteration = 0;
  animatedElement.setAttribute("data-deeptopic-expanded", "progress");

  return;
}

/**
 * Prep to open the content element.
 */
function openIt(target, button) {
  changeButton(button, "less");

  easeFunction = windowWillContainContent() ? easingLibrary.easeInOutCubic : easingLibrary.easeInCubic;

  startValue = 0;
  changeInValue = startValue + contentElementHeight;

  direction = "down";
  finalValue = "yes";

  draw();
}

/**
 * Prep to close the content element.
 */
function closeIt(target, button) {
  changeButton(button, "more");

  easeFunction = windowContainsContent() ? easingLibrary.easeInOutCubic : easingLibrary.easeOutExpo;

  startValue = contentElementHeight;
  changeInValue = startValue * -1;

  direction = "up";
  finalValue = "no";

  // Trigger the draw loop
  draw();
}

/**
 * Main draw loop
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


//
// Plumbing functions
//

function windowWillContainContent() {
  return (contentElementHeight + animatedElement.getBoundingClientRect().top) < window.innerHeight;
}

function windowContainsContent() {
  return animatedElement.getBoundingClientRect().bottom < window.innerHeight;
}

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
function setContentElementHeight(el) {
  var contentElement = el.querySelector("[data-deeptopic-content]");
  var contentElementStyle = window.getComputedStyle(contentElement);

  var pTop = getPxValue(contentElementStyle.paddingTop);
  var pBottom = getPxValue(contentElementStyle.paddingBottom);

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

  contentElementHeight = totalHeight;

  return;
}


function getPxValue(value) {
  return Number(value.match(/(\d+)px/)[1]);
}

// the main handler function
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
