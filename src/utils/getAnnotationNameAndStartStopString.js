import { upperFirst } from "lodash";
import { getSingular } from "./annotationTypes";

export default function getAnnotationNameAndStartStopString(
  { name, start, end, type, message, annotationTypePlural },
  { startText } = {}
) {
  let typeToUse = annotationTypePlural
    ? upperFirst(getSingular(annotationTypePlural)) +
      (annotationTypePlural === "features" ? ` (${type})` : "")
    : "";

  return `${startText ? startText : ""} ${typeToUse ? typeToUse + " -" : ""} ${
    name ? name : ""
  } - Start: ${start + 1} End: ${end + 1} ${message ? "\n" + message : ""}`;
}
