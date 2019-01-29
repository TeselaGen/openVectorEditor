export default function getXStartAndWidthOfRowAnnotation(
  range,
  bpsPerRow,
  charWidth,
  gapsBefore = 0,
  gapsInside = 0,
  gapsBeforeSeqRead,
  gapsBeforeFeatureInSeqRead
) {
  console.log('gapsBeforeSeqRead:',gapsBeforeSeqRead)
  console.log('gapsBeforeFeatureInSeqRead:',gapsBeforeFeatureInSeqRead)
  // const gapsToUse = gapsBeforeFeatureInSeqRead || gapsBefore
  const gapsToUse = gapsBeforeSeqRead || gapsBefore
  let startOffset = range.start % bpsPerRow;
  const toReturn = {
    startOffset,
    // xStart: startOffset * charWidth,
    xStart: (startOffset + gapsToUse) * charWidth,
    width: (range.end + 1 - range.start + gapsInside) * charWidth
  };
  return toReturn;
}
