export default function getXStartAndWidthOfRowAnnotation(
  range,
  bpsPerRow,
  charWidth,
  gapsBefore = 0,
  gapsInside = 0
) {
  let startOffset = range.start % bpsPerRow;
  const toReturn = {
    startOffset,
    // xStart: startOffset * charWidth,
    xStart: (startOffset + gapsBefore) * charWidth,
    width: (range.end + 1 - range.start + gapsInside) * charWidth
  };
  return toReturn;
}
