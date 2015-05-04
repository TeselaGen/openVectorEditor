module.exports = function isPositiveInteger(value) {
  if (
    value % 1 === 0 &&
    value > -1
  ) {
    return true;
  } else {
    return false;
  }
};