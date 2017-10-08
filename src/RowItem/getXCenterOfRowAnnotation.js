import getXStartAndWidthOfRangeWrtRow from "./getXStartAndWidthOfRangeWrtRow";

export default function getXCenterOfRowAnnotation(
  range,
  row,
  bpsPerRow,
  charWidth,
  sequenceLength
) {
  let result = getXStartAndWidthOfRangeWrtRow(
    range,
    row,
    bpsPerRow,
    charWidth,
    sequenceLength
  );
  let xStart = result.xStart;
  let width = result.width;
  return xStart + width / 2;
}
