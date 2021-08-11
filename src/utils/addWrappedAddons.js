import { flatMap } from "lodash";

export function addWrappedAddons(anns) {
  return flatMap(anns, (ann) => {
    if (ann.overlapsSelf) {
      return [
        ann,
        {
          ...ann,
          start: ann.end + 1,
          end: ann.start - 1,
          isWrappedAddon: true,
          rangeTypeOverride: "middle" //we add this rangeTypeOverride here to get the wrapping piece to draw differently than normal
        }
      ];
    }
    return [ann];
  });
}
