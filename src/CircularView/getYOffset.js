export default function getYOffset(iTree, start, end) {
  //get all potentially overlapping annotations

  let potentiallyOverlappingAnnotations = iTree.search(start, end);
  //we don't want to render the new annotation on top of any of these potentially overlapping annotations
  let potentialPositionsForNewAnnotation = potentiallyOverlappingAnnotations.map(
    () => true
  );
  potentiallyOverlappingAnnotations.forEach(function(otherAnnotation) {
    potentialPositionsForNewAnnotation[otherAnnotation.yOffset] = false;
  });
  //get first occurence of empty yOffset
  let yOffset = potentialPositionsForNewAnnotation.indexOf(true);
  //if there are no empty slots, make a new slot
  return yOffset > -1 ? yOffset : potentialPositionsForNewAnnotation.length;
}
