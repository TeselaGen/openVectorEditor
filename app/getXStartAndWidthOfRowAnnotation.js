import ac from 've-api-check';
// ac.throw([ac.string,ac.bool],arguments);
export default function getXStartAndWidthOfRowAnnotation(range, bpsPerRow, charWidth) {
    ac.throw([ac.range, ac.posInt, ac.number], arguments);
    // 24 bps long: 
    // 
    // if (range.end + 1 - range.start > 0 && )
    // (range.end + 1 - range.start) % bpsPerRow
    return {
        xStart: (range.start % bpsPerRow) * charWidth,
        width: ((range.end + 1 - range.start)) * charWidth,
    };
}