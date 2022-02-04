import React from "react";
import SelectionLayer from "./SelectionLayer";
import { connectToEditor } from "../withEditorProps";
import classNames from "classnames";

export const CutsiteSelectionLayers = connectToEditor(
  ({ hoveredAnnotation }) => ({
    hoveredAnnotation
  })
)(function CutsiteSelectionLayersInner({
  hoveredAnnotation,
  cutsites,
  annotationCommonProps,
  showReverseSequence,
  sequenceHeight,
  alignmentData,
  row
}) {
  return Object.keys(cutsites)
    .sort((a) => (cutsites[a].id === hoveredAnnotation ? 1 : -1))
    .map(function (id, index) {
      const cutsite = cutsites[id];
      const isHovered = hoveredAnnotation === cutsite.id;
      const layer = cutsite.annotation.recognitionSiteRange;
      return (
        layer.start > -1 && (
          <SelectionLayer
            hideTitle
            {...annotationCommonProps}
            {...{
              id: cutsite.id,
              key: "restrictionSiteRange" + index,
              height: showReverseSequence ? sequenceHeight * 2 : sequenceHeight,
              regions: [layer],
              row: alignmentData
                ? { start: 0, end: alignmentData.sequence.length - 1 }
                : row,
              className: classNames("cutsiteLabelSelectionLayer", {
                cutsiteLabelSelectionLayerHovered: isHovered
              }),
              hideCarets: true
            }}
          />
        )
      );
    });
});
