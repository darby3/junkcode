// Browserify handles scoping; so we don't need to IIFE this file.

// Sample module
var helloWorld = require("./modules/helloWorld");

var count = 0;

//
// This method uses underscore's debounce or throttle functions to limit the
// rate of the scroll handler firing
//

// // document content loaded wrapper
// document.addEventListener('DOMContentLoaded', function() {
//   // Let's get this party started.
//   console.log("hello let us begin");

//   // Invoke a module.
//   helloWorld();

//   // Start ading code.

//   window.addEventListener("scroll", throttleHandler);

// });


// var throttleHandler = _.throttle(scrollHandler, 500);

// function scrollHandler(e) {
//   console.log(e);

//   var box = document.getElementById("stats");

//   count += 1;

//   box.innerHTML = count;
// }



//
// For funsies let's try using requestAnimationFrame
// (https://developer.mozilla.org/en-US/docs/Web/Events/scroll)
//


var last_known_scroll_position = 0;
var ticking = false;

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function() {
  // Let's get this party started.
  console.log("hello let us begin");

  // Invoke a module.
  helloWorld();

  // Start ading code.

  window.addEventListener("scroll", scrollHandler);

});



function scrollHandler(e) {

  // console.log("scroll handler");
  last_known_scroll_position = window.scrollY;
  if (ticking) {
    console.log("in the ticking check");
  }

  if (!ticking) {
    window.requestAnimationFrame(function(DOMHighResTimeStamp) {
      var box = document.getElementById("stats");
      count += 1;
      box.innerHTML = count;

      // var arrayThing = [];
      // for (var i = 0; i < 100000000; i++) {
      //   arrayThing[i] = Math.random() * Math.random();
      // }


      window.setTimeout(function() {
        ticking = false;
        console.log("ticking now false");
      }, 500)
    });
  }

  ticking = true;
  // console.log("ticking -- " + ticking);
}
