var ac = require('ve-api-check');

module.exports = function getXCenterOfRowAnnotation(range, bpsPerRow, charWidth) {
    ac.throw([ac.range, ac.posInt, ac.number], arguments);
    var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
    var result = getXStartAndWidthOfRowAnnotation(range, bpsPerRow, charWidth);
    var xStart = result.xStart;
    var width = result.width;
    return xStart + width / 2;
};