module.exports = function getCutsiteType(restrictionEnzyme) {
  const { topSnipOffset, bottomSnipOffset } = restrictionEnzyme;
  if (topSnipOffset === bottomSnipOffset) {
    return "blunt";
  } else if (topSnipOffset < bottomSnipOffset) {
    return "5' overhang";
  } else {
    return "3' overhang";
  }
};
