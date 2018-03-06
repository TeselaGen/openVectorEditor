export default function getAnnotationNameAndStartStopString(
  { name, start, end, type },
  { startText, isPart } = {}
) {
  let typeToUse = type;
  if (isPart) {
    typeToUse = "Part";
  }
  return `${startText ? startText : ""} ${typeToUse ? typeToUse + " -" : ""} ${
    name ? name : ""
  } Start: ${start + 1} End: ${end + 1} `;
}
