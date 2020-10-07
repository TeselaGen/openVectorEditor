import { upperFirst } from "lodash";
import { getSingular } from "./annotationTypes";

export default function getAnnotationNameAndStartStopString(
  { name, start, end, type, message, annotationTypePlural },
  { startText, isProtein } = {}
) {
  let typeToUse = annotationTypePlural
    ? upperFirst(getSingular(annotationTypePlural)) +
      (annotationTypePlural === "features" ? ` (${type})` : "")
    : "";

  return `${startText ? startText : ""} ${typeToUse ? typeToUse + " -" : ""} ${
    name ? name : ""
  } - Start: ${isProtein ? (start + 3) / 3 : start + 1} End: ${
    isProtein ? (end + 1) / 3 : end + 1
  } ${message ? "\n" + message : ""}`;
}
