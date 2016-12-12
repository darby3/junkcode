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
  var filters = document.getElementById("filters");

  filters.addEventListener("click", function(e) {
    var totalGroup = document.querySelectorAll("[data-group]");

    if (e.target.hasAttribute("data-target")) {
      console.log("button");
      console.dir(e.target);
      
      var groupToVanish = e.target.getAttribute("data-target");

      console.log("groupToVanish -- " + groupToVanish);

      _.each(totalGroup, function (element, index, list) {
        element.dataset.filtered = (element.dataset.group === groupToVanish) ? "active" : "faded";
      })
    } else if (e.target.hasAttribute("data-reset")) {
      _.each(totalGroup, function (element, index, list) {
        element.dataset.filtered = "";
      })      
    }
  })

});
