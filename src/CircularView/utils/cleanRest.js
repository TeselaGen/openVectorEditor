import { omit } from "lodash";

export function cleanRest(rest) {
  //the 0 angle returns the 0,1 point on the unit circle instead of the 1,0 point like normal
  return omit(rest, [
    "isProtein",
    "labelColor",
    "yOffset",
    "forward",
    "annotationTypePlural"
  ]);
}
