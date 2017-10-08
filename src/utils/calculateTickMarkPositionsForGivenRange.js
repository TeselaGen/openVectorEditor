import norm from "ve-range-utils/normalizePositionByRangeLength";
import getRangeLength from "ve-range-utils/getRangeLength";

export default function calculateTickMarkPositionsForGivenRange({
  tickSpacing,
  range,
  sequenceLength
}) {
  let rangeLength = getRangeLength(range, sequenceLength);

  let firstTickOffsetFromRangeStart;
  if (range.start > range.end) {
    // range spans origin, so make sure the 0 bp is included!
    firstTickOffsetFromRangeStart =
      (sequenceLength - range.start) % tickSpacing + 1;
  } else {
    firstTickOffsetFromRangeStart = tickSpacing - range.start % tickSpacing;
  }
  let tickMarks = [];
  if (range.start === 0) tickMarks.push(0);
  for (
    let tick = firstTickOffsetFromRangeStart - 1;
    tick < rangeLength;
    tick += tickSpacing
  ) {
    tickMarks.push(norm(tick, sequenceLength));
  }
  return tickMarks;
}
