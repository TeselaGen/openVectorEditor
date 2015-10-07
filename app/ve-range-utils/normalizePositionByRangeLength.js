var ac = require('ve-api-check');
// ac.throw([ac.posInt, ac.posInt, ac.bool], arguments);
module.exports = function normalizePositionByRangeLength(pPosition, sequenceLength, isInBetweenPositions) {
    //isInBetweenPositions refers to:
    // A T G C
    // 0 1 2 3    <--  isInBetweenPositions = false is counting the positions themselves
    //0 1 2 3 4   <--  isInBetweenPositions = true is counting the spaces between positions
    ac.throw([ac.number, ac.posInt, ac.bool], arguments);
    var position = pPosition;
    if (position < 0) {
        position += sequenceLength;
    } else if (position + (isInBetweenPositions ? 0 : 1) > sequenceLength) {
        position -= sequenceLength;
    }
    return position;
};