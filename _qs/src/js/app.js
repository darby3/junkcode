// Browserify handles scoping; so we don't need to IIFE this file.

// Sample module
var helloWorld = require("./modules/helloWorld");

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function() {
  // Let's get this party started.
  console.log("hello let us begin");

  // Invoke a module.
  helloWorld();

  // Start ading code.


});
