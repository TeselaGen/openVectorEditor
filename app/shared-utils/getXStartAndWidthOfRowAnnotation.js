 module.exports = function getXStartAndWidthOfRowAnnotation(range, bpsPerRow, charWidth) {
    let widthInBps = (range.end + 1 - range.start);
    let width = widthInBps * (charWidth-1) * 1.2;
    return {
        xStart: (range.start % bpsPerRow) * 1.2, // 1.2 account for character spacing
        width: width
    };
};
