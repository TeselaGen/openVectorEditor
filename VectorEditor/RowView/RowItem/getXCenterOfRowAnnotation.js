import getXStartAndWidthOfRangeWrtRow from './getXStartAndWidthOfRangeWrtRow';
module.exports = function getXCenterOfRowAnnotation(range, row, bpsPerRow, charWidth, sequenceLength) {
    
    var result = getXStartAndWidthOfRangeWrtRow(range, row, bpsPerRow, charWidth, sequenceLength);
    var xStart = result.xStart;
    var width = result.width;
    return xStart + width / 2;
};