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
  { startText, isProtein, readOnly } = {}
) {
  const typeToUse = (() => {
    if (annotationTypePlural) {
      const singularKey = getSingular(annotationTypePlural);
      if (singularKey === "cutsite") {
        return (
          "Cut site" + (annotationTypePlural === "features" ? ` (${type})` : "")
        );
      }
      if (singularKey === "orf") {
        return (
          "ORF" + (annotationTypePlural === "features" ? ` (${type})` : "")
        );
      }
      return (
        upperFirst(getSingular(annotationTypePlural)) +
        (annotationTypePlural === "features" ? ` (${type})` : "")
      );
    }
    return "";
  })();

  if (isWrappedAddon) {
    const oldEnd = end;
    end = start - 1;
    start = oldEnd + 1;
  }
  return `${startText ? startText : ""} ${typeToUse ? typeToUse + " -" : ""} ${
    name ? name : ""
  } - Start: ${isProtein ? (start + 3) / 3 : start + 1} End: ${
    isProtein ? (end + 1) / 3 : end + 1
  } ${overlapsSelf ? "(Overlaps Self) " : ""}${message ? "\n" + message : ""} ${
    readOnly
      ? ""
      : annotationTypePlural === "cutsites"
      ? `

 click --> top cut position
 alt/option+click --> bottom cut position
 cmd/ctrl+click --> recognition range`
      : `

alt/option+click --> jump row view to start/end
double click --> edit`
  }`;
}
