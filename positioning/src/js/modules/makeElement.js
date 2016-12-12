// Create a new element, possibly with some text in it, and return it.

var makeElement = function(text, elType) {
  var newEl = document.createElement(elType || "p");

  if (text) {
    var newText = document.createTextNode(text);
    newEl.appendChild(newText);
  }

  return newEl;
};

module.exports = makeElement;
