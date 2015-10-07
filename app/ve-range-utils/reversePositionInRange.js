var ac = require('ve-api-check');
module.exports = function reversePositionInRange(position, rangeLength, isInBetweenPositions) {
    //isInBetweenPositions refers to:
    // A T G C
    // 0 1 2 3    <--  isInBetweenPositions = false is counting the positions themselves
    //0 1 2 3 4   <--  isInBetweenPositions = true is counting the spaces between positions
    ac.throw([
        ac.posInt,
        ac.posInt,
        ac.bool
    ], arguments);
    return rangeLength - position - (isInBetweenPositions ? 0 : 1);
};