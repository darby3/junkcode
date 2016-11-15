// Browserify handles scoping; so we don't need to IIFE this file.

var deeptopicHandler = require("./modules/deeptopicHandler");

// Sample module
var helloWorld = require("./modules/helloWorld");

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function() {
  // Let's get this party started.
  console.log("hello let us begin");

  // Invoke a module.
  helloWorld();

  // Start ading code.

  // Main event listeners

  document.addEventListener("click", function(e) {
    clickHandler(e);
  });
});

//
// plumbing
//

function clickHandler(e) {
  if (e.target.hasAttribute("data-deepTopic-trigger")) {
    deeptopicHandler(e);
  }
}
