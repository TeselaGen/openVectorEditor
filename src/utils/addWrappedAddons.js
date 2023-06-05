import { flatMap } from "lodash";
import { normalizePositionByRangeLength } from "@teselagen/range-utils";

export function addWrappedAddons(anns, seqLen) {
  return flatMap(anns, (ann) => {
    if (ann.overlapsSelf) {
      return [
        ann,
        {
          ...ann,
          start: normalizePositionByRangeLength(ann.end + 1, seqLen),
          end: normalizePositionByRangeLength(ann.start - 1, seqLen),
          isWrappedAddon: true,
          rangeTypeOverride: "middle" //we add this rangeTypeOverride here to get the wrapping piece to draw differently than normal
        }
      ];
    }
    return [ann];
  });
}
