import { normalizePositionByRangeLength } from "@teselagen/range-utils";
import { isNumber } from "lodash";

export default function getXStartAndWidthOfRangeWrtRow({
  range,
  row,
  charWidth,
  sequenceLength,
  gapsBefore = 0,
  gapsInside = 0
}) {
  const xStart =
    ((!isNumber(gapsBefore) ? 0 : gapsBefore) +
      normalizePositionByRangeLength(range.start - row.start, sequenceLength)) *
    charWidth;
  const obj = {
    xStart,
    width:
      (gapsInside +
        normalizePositionByRangeLength(
          range.end + 1 - range.start,
          sequenceLength + 1
        )) *
      charWidth
  };
  return obj;
}
