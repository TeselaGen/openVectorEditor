import React from "react";
import SelectionLayer from "./SelectionLayer";
import classNames from "classnames";
import { observer } from "mobx-react";

export const CutsiteSelectionLayers = observer(
  function CutsiteSelectionLayersInner({
    ed,
    cutsites,
    annotationCommonProps,
    sequenceHeight,
    alignmentData,
    row
  }) {
    return Object.keys(cutsites)
      .sort((a) => (cutsites[a].id === ed.hoveredAnnotationId ? 1 : -1))
      .map(function (id, index) {
        const cutsite = cutsites[id];
        const isHovered = ed.hoveredAnnotationId === cutsite.id;
        const layer = cutsite.annotation.recognitionSiteRange;
        return (
          layer.start > -1 && (
            <SelectionLayer
              hideTitle
              {...annotationCommonProps}
              {...{
                id: cutsite.id,
                key: "restrictionSiteRange" + index,
                height: row.annotationVisibility.reverseSequence
                  ? sequenceHeight * 2
                  : sequenceHeight,
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
  }
);
