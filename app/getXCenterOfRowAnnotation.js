var ac = require('ve-api-check');
// ac.warn([ac.string,ac.bool],arguments);
module.exports = function getXCenterOfRowAnnotation(range, bpsPerRow, charWidth) {
    ac.warn([ac.range, ac.posInt, ac.number], arguments);
    var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
    var result = getXStartAndWidthOfRowAnnotation(range, bpsPerRow, charWidth);
    var xStart = result.xStart;
    var width = result.width;
    return xStart + width / 2;
};