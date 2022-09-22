import { getClientX, getClientY } from "../utils/editorUtils";

export function getTrackFromEvent(event, allTracks) {
  const trackContainers = document.querySelectorAll(
    ".alignmentViewTrackContainer"
  );
  let track;
  trackContainers.forEach((t) => {
    const mouseX = getClientX(event) + document.body.scrollLeft;
    const mouseY = getClientY(event) + document.body.scrollTop;
    if (
      mouseX >= t.getBoundingClientRect().left &&
      mouseX <=
        t.getBoundingClientRect().left + t.getBoundingClientRect().width &&
      mouseY >= t.getBoundingClientRect().top &&
      mouseY <= t.getBoundingClientRect().top + t.getBoundingClientRect().height
    ) {
      const index = t.getAttribute("data-alignment-track-index");
      track = allTracks[index];
      track.index = index;
      return true;
    }
  });
  return track;
}
