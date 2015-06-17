module.exports = function getXCenterOfRowAnnotation(range, bpsPerRow, charWidth) {
	var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
	var {xStart, width} = getXStartAndWidthOfRowAnnotation(range, bpsPerRow, charWidth);
	return xStart + width/2;
};