// Browserify handles scoping; so we don't need to IIFE this file.

// Sample module
var helloWorld = require("./modules/helloWorld");

var count = 0;




//
// For funsies let's try using requestAnimationFrame
// (https://developer.mozilla.org/en-US/docs/Web/Events/scroll)
//
// I branched this off the scrollHandler demo; I should look into
// https://developer.mozilla.org/en-US/docs/Web/Events/resize#Example to see if
// that can do more for me than I'm doing here
//


var ticking = false;

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function() {
  // Let's get this party started.
  console.log("hello let us begin");

  // Invoke a module.
  helloWorld();

  // Start ading code.

  window.addEventListener("resize", resizeHandler);

});



function resizeHandler(e) {

  // console.log("scroll handler");
  if (ticking) {
    // console.log("in the ticking check");
  }

  if (!ticking) {
    window.requestAnimationFrame(function(DOMHighResTimeStamp) {

      // console.log("requestAnimationFrame called");

      var box = document.getElementById("stats");

      var sizestats = '';
      sizestats += window.innerWidth + 'px';
      sizestats += ', <br />';
      sizestats += window.innerHeight + 'px';

      box.innerHTML = sizestats;

      var boxheight = getPxValue(window.getComputedStyle(box).height);

      console.log("window.getComputedStyle(box).height -- " + window.getComputedStyle(box).height);

      console.log("boxheight -- " + boxheight);

      var boxPos = window.innerHeight / 2 - boxheight / 2;

      console.log("boxPos -- " + boxPos);
      box.style.top = boxPos + "px";

      box.style.width = "10vw";
      box.style.height = "10vw";



      // window.setTimeout(function() {
        ticking = false;
        // console.log("ticking now false");
      // }, 1000)
    });
  }

  ticking = true;
}


function getPxValue(value) {
  return Number(value.match(/([\d.]+)px/)[1]);
}
