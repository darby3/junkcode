// Browserify handles scoping; so we don't need to IIFE this file.

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function() {
  // Let's get this party started.
  console.log("hello let us begin");

  // Start ading code.
  var button = document.getElementById("garbler");
  var input = document.getElementById("textToGarble");
  var output = document.getElementById("output");

  button.addEventListener("click", function(e) {
    e.preventDefault();

    console.log("activate");

    handleIt(input.value, output);
  })

});


function handleIt(inputText, outputEl) {

  // assign it
  var checkText = inputText;

  // check it for a condition
  if (checkText.charAt(0) === '@') {
    checkText = checkText.substr(1);
  }

  // split it up into an array
  var garbledArray = checkText.split('');

  // do more things to the array
  garbledArray = _.shuffle(garbledArray);





  // collapse the array
  var garbledText = garbledArray.join('');

  // spit it out
  outputEl.innerHTML = garbledText;
}



// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function coinFlip() {
  return Math.floor(Math.random() * 2);
}
