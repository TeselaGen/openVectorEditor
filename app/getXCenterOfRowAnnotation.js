module.exports = function getXCenterOfRowAnnotation(range, bpsPerRow, charWidth) {
    var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
    var result = getXStartAndWidthOfRowAnnotation(range, bpsPerRow, charWidth);
    var xStart = result.xStart;
    var width = result.width;
    return xStart + width / 2;
};