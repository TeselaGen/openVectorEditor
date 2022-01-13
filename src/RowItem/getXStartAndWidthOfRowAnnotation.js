export default function getXStartAndWidthOfRowAnnotation(
  range,
  bpsPerRow,
  charWidth,
  gapsBefore = 0,
  gapsInside = 0
) {
  const startOffset = range.start % bpsPerRow;
  const toReturn = {
    startOffset,
    xStart: (startOffset + gapsBefore) * charWidth,
    width: getWidth(range, charWidth, gapsInside)
  };
  return toReturn;
}

export function getWidth(range, charWidth, gapsInside = 0) {
  return (range.end + 1 - range.start + gapsInside) * charWidth;
}
