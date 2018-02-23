import { normalizePositionByRangeLength } from "ve-range-utils";

export default function getXStartAndWidthOfRangeWrtRow(
  range,
  row,
  bpsPerRow,
  charWidth,
  sequenceLength,
  gapsBefore,
  gapsInside
) {
  let xStart =
    normalizePositionByRangeLength(range.start - row.start, sequenceLength) *
    charWidth;
  let obj = {
    xStart,
    width:
      normalizePositionByRangeLength(
        range.end + 1 - range.start,
        sequenceLength + 1
      ) * charWidth
  };
  /* eslint-disable no-debugger */

  if (xStart > bpsPerRow * charWidth) debugger;
  /* eslint-enable */

  return obj;
}
