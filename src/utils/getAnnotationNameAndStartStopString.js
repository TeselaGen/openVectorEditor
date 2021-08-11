import { upperFirst } from "lodash";
import { getSingular } from "./annotationTypes";

export default function getAnnotationNameAndStartStopString(
  {
    name,
    start,
    end,
    type,
    message,
    annotationTypePlural,
    overlapsSelf,
    isWrappedAddon
  },
  { startText, isProtein } = {}
) {
  const typeToUse = annotationTypePlural
    ? upperFirst(getSingular(annotationTypePlural)) +
      (annotationTypePlural === "features" ? ` (${type})` : "")
    : "";

  if (isWrappedAddon) {
    const oldEnd = end;
    end = start - 1;
    start = oldEnd + 1;
  }
  return `${startText ? startText : ""} ${typeToUse ? typeToUse + " -" : ""} ${
    name ? name : ""
  } - Start: ${isProtein ? (start + 3) / 3 : start + 1} ${
    overlapsSelf ? "(wraps full sequence) " : ""
  }End: ${isProtein ? (end + 1) / 3 : end + 1} ${
    message ? "\n" + message : ""
  }`;
}
