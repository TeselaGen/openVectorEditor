import { getGapMap } from "./getGapMap";

/**
 * this function is used to calculate the number of spaces that come before or inside a range
 */
export let getGaps = () => ({
  gapsBefore: 0,
  gapsInside: 0
});
getGaps = (rangeOrCaretPosition, sequence) => {
  const gapMap = getGapMap(sequence);
  if (typeof rangeOrCaretPosition !== "object") {
    return {
      gapsBefore: gapMap[Math.min(rangeOrCaretPosition, gapMap.length - 1)]
    };
  }
  //otherwise it is a range!
  const { start, end } = rangeOrCaretPosition;
  const toReturn = {
    gapsBefore: gapMap[start],
    gapsInside:
      gapMap[Math.min(end, gapMap.length - 1)] -
      gapMap[Math.min(start, gapMap.length - 1)]
  };

  return toReturn;
};
