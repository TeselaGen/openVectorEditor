var isPositiveInteger = require('./isPositiveInteger');

module.exports = function arePositiveIntegers() {
  if (arguments) {
    return arguments.every(function(argument) {
      return isPositiveInteger(argument);
    })
  } else {
    console.warn("no inputs passed")
    return false
  }
}