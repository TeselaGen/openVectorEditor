var isPositiveInteger = require('./isPositiveInteger.js');

module.exports = function arePositiveIntegers() {
  if (arguments) {
  	var args = Array.prototype.slice.call(arguments); //convert the arguments into a normal array so we can use the every method on it
    return args.every(function(argument) {
      return isPositiveInteger(argument);
    });
  } else {
    console.warn("no inputs passed");
    return false;
  }
};