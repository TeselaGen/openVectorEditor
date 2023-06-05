import { normalizePositionByRangeLength as norm } from "@teselagen/range-utils";
import { getRangeLength } from "@teselagen/range-utils";

export default function calculateTickMarkPositionsForGivenRange({
  tickSpacing: _tickSpacing = 10,
  range,
  sequenceLength,
  isProtein,
  increaseOffset
}) {
  if (sequenceLength === 0) {
    return [];
  }
  let tickSpacing = _tickSpacing;
  if (isProtein) {
    tickSpacing = Math.floor((_tickSpacing / 2) * 3);
  }

  const rangeLength = getRangeLength(range, sequenceLength);

  let spacer = 0;
  if (increaseOffset) {
    spacer = range.start;
  }
  const firstTickOffsetFromRangeStart =
    spacer + tickSpacing - (range.start % tickSpacing);

  const tickMarks = [];
  if (range.start === 0) tickMarks.push(isProtein ? 2 : 0);
  let hasCrossedOrigin;
  for (
    let tick = firstTickOffsetFromRangeStart - 1;
    tick < spacer + rangeLength;
    tick += tickSpacing
  ) {
    let normed = norm(tick, sequenceLength);
    if (!hasCrossedOrigin && normed < tick) {
      if (!(normed % 10) && normed !== 0) {
        tick = tick - 1;
        normed = normed - 1;
      }
      if (normed !== 0) hasCrossedOrigin = true;
    }
    tickMarks.push(normed);
  }
  return tickMarks;
}
