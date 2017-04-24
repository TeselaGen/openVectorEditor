 module.exports = function getXStartAndWidthOfRowAnnotation(range, bpsPerRow, charWidth) {
    // 24 bps long: 
    // 
    // if (range.end + 1 - range.start > 0 && )
    // (range.end + 1 - range.start) % bpsPerRow
    var startOffset = (range.start % bpsPerRow)
    return {
    	startOffset,
        xStart: startOffset * charWidth,
        width: ((range.end + 1 - range.start)) * charWidth,
    };
};