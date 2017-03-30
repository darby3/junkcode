// Browserify handles scoping; so we don't need to IIFE this file.

// Sample module
var helloWorld = require("./modules/helloWorld");

var targetImage;
var newImage;

var tnBox = document.getElementById("thumbnail_box");

var engaged;

var increment = 0.035;


// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function() {
  // Let's get this party started.
  console.log("hello let us begin");

  // Invoke a module.
  helloWorld();

  var tnails = tnBox.children;
  for (var i = 0; i < tnails.length; i++) {
    tnails[i].dataset.active = "false";
  }

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