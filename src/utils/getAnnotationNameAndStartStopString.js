export default function getAnnotationNameAndStartStopString(
  { name, start, end, type },
  additionalOpts = {}
) {
  let { startText } = additionalOpts;
  return `${startText ? startText : ""} ${type} - ${
    name ? name : ""
  } Start: ${start + 1} End: ${end + 1} `;
}
