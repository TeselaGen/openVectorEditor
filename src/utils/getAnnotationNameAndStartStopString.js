export default function getAnnotationNameAndStartStopString(
  { name, start, end, type, message, annotationTypePlural },
  { startText, isPart } = {}
) {
  let typeToUse = type;
  if (isPart) {
    typeToUse = "Part";
  }
  if (annotationTypePlural === "warnings") {
    typeToUse = "";
  }
  return `${startText ? startText : ""} ${typeToUse ? typeToUse + " -" : ""} ${
    name ? name : ""
  } Start: ${start + 1} End: ${end + 1} ${message ? "\n" + message : ""}`;
}
