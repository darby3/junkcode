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
    if (e.target.hasAttribute("data-target")) {
      console.log("button");
      console.dir(e.target);
      
      var totalGroup = document.querySelectorAll("[data-group]");
      var groupToVanish = e.target.getAttribute("data-target");

      console.log("groupToVanish -- " + groupToVanish);

      _.each(totalGroup, function (element, index, list) {

        // console.dir(element.dataset);

        if (element.dataset.group === groupToVanish) {
          element.classList.add("gone");
        }
      })

    }
  })

});
