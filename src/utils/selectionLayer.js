export function getAllSelectionLayers({
  additionalSelectionLayers = [],
  searchLayers = [],
  selectionLayer
}) {
  const selectionLayers = [
    ...additionalSelectionLayers,
    ...searchLayers,
    ...(Array.isArray(selectionLayer) ? selectionLayer : [selectionLayer])
  ];
  const doubleWrappedColor = "#edb2f1";
  // const doubleWrappedColor = "#abdbfb";

  if (selectionLayer.overlapsSelf) {
    selectionLayers.push({
      start: selectionLayer.end + 1,
      end: selectionLayer.start - 1,
      color: selectionLayer.isWrappedAddon ? undefined : doubleWrappedColor
    });
    if (selectionLayer.isWrappedAddon) {
      selectionLayer.color = doubleWrappedColor;
    }
  }
  return selectionLayers;
}
