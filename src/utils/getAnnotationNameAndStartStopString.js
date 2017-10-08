export default function getAnnotationNameAndStartStopString(
  { name, start, end },
  additionalOpts = {}
) {
  let { startText } = additionalOpts;
  return `${startText ? startText : ""} ${name ? name : ""} Start: ${start + 1} End: ${end + 1} `;
}
