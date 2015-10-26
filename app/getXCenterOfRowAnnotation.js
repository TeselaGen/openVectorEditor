import getXStartAndWidthOfRowAnnotation from './getXStartAndWidthOfRowAnnotation';
import ac from 've-api-check';
// ac.throw([ac.string,ac.bool],arguments);
export default function getXCenterOfRowAnnotation(range, bpsPerRow, charWidth) {
    ac.throw([ac.range, ac.posInt, ac.number], arguments);
    var result = getXStartAndWidthOfRowAnnotation(range, bpsPerRow, charWidth);
    var xStart = result.xStart;
    var width = result.width;
    return xStart + width / 2;
}
