var ac = require('ve-api-check');
var getYOffsetForPotentiallyCircularRange = require('./getYOffsetForPotentiallyCircularRange');
module.exports = function getYOffsetsForPotentiallyCircularRanges(ranges, assignYOffsetToRange) {
    ac.throw([ac.array, ac.bool.optional],arguments);
    //adjust the yOffset of the range being pushed in by checking its range against other ranges already in the row
    var yOffsets = [];
    var maxYOffset = 0;
    var yOffsetLevels = [] //yOffsetLevels is an array of arrays (array of yOffset levels holding arrays of ranges)
    ranges.forEach(function(range){
        //loop through y offset levels starting with the 0 level until an empty one is found and push the range into it. If none are found, add another level. 
        var yOffset = getYOffsetForPotentiallyCircularRange(range, yOffsetLevels, assignYOffsetToRange)
        yOffsets.push(yOffset)
        if (yOffset>maxYOffset) {
            maxYOffset = yOffset;
        }
        range.yOffset = yOffset;
        if (!yOffsetLevels[yOffset]) yOffsetLevels[yOffset] = [];
        yOffsetLevels[yOffset].push(range);
    });
    return {yOffsets, maxYOffset};
}