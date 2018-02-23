export default function getXStartAndWidthOfRowAnnotation(
  range,
  bpsPerRow,
  charWidth,
  gapsBefore,
  gapsInside
) {
  // 24 bps long:
  //
  // if (range.end + 1 - range.start > 0 && )
  // (range.end + 1 - range.start) % bpsPerRow
  let startOffset = (range.start + gapsBefore) % bpsPerRow;
  return {
    startOffset,
    xStart: startOffset * charWidth,
    width: (range.end + 1 - range.start + gapsInside) * charWidth
  };
}
