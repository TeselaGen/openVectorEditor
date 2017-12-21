import React from "react";
import IntervalTree from "node-interval-tree";
import { sortBy, noop } from "lodash";
import { getRangeLength } from "ve-range-utils";
import getRangeAngles from "../getRangeAnglesSpecial";
import getYOffset from "../getYOffset";
import DrawPart from "./DrawPart";

function Parts({
  radius,
  parts,
  partHeight,
  spaceBetweenAnnotations,
  sequenceLength,
  editorName,
  partClicked = noop,
  partRightClicked = noop,
  showPartLabels = true
}) {
  const totalAnnotationHeight = partHeight + spaceBetweenAnnotations;
  const featureITree = new IntervalTree();
  let maxYOffset = 0;
  const svgGroup = [];
  const labels = {};

  if (!Object.keys(parts).length) return null;
  sortBy(parts, a => {
    return -getRangeLength(a, sequenceLength);
  })
    .map(annotation => {
      let { startAngle, endAngle, totalAngle, centerAngle } = getRangeAngles(
        annotation,
        sequenceLength
      );

      let spansOrigin = startAngle > endAngle;
      let annotationCopy = {
        ...annotation,
        startAngle,
        endAngle,
        totalAngle,
        centerAngle
      };

      //expand the end angle if annotation spans the origin
      let expandedEndAngle = spansOrigin ? endAngle + 2 * Math.PI : endAngle;
      let yOffset1;
      let yOffset2;
      if (spansOrigin) {
        annotationCopy.yOffset = getYOffset(
          featureITree,
          startAngle,
          expandedEndAngle
        );
      } else {
        //we need to check both locations to account for annotations that span the origin
        yOffset1 = getYOffset(featureITree, startAngle, expandedEndAngle);
        yOffset2 = getYOffset(
          featureITree,
          startAngle + Math.PI * 2,
          expandedEndAngle + Math.PI * 2
        );
        annotationCopy.yOffset = Math.max(yOffset1, yOffset2);
      }

      if (spansOrigin) {
        featureITree.insert(startAngle, expandedEndAngle, {
          ...annotationCopy
        });
      } else {
        //normal feature
        // we need to add it twice to the interval tree to accomodate features which span the origin
        featureITree.insert(startAngle, expandedEndAngle, {
          ...annotationCopy
        });
        featureITree.insert(
          startAngle + 2 * Math.PI,
          expandedEndAngle + 2 * Math.PI,

          { ...annotationCopy }
        );
      }

      if (annotationCopy.yOffset > maxYOffset) {
        maxYOffset = annotationCopy.yOffset;
      }
      return annotationCopy;
    })
    .forEach(function(annotation, index) {
      annotation.yOffset = maxYOffset - annotation.yOffset;
      function onClick(event) {
        partClicked({ event, annotation });
      }
      function onContextMenu(event) {
        partRightClicked({ event, annotation });
      }

      const { startAngle, endAngle, totalAngle, centerAngle } = annotation;

      const annotationRadius =
        radius + annotation.yOffset * totalAnnotationHeight;

      if (showPartLabels) {
        //add labels to the exported label array (to be drawn by the label component)
        labels[annotation.id] = {
          annotationCenterAngle: centerAngle,
          annotationCenterRadius: annotationRadius,
          text: annotation.name,
          id: annotation.id,
          className: "vePartLabel",
          onClick,
          onContextMenu
        };
      }

      let annotationColor = annotation.color || "purple";

      /* eslint-disable */

      if (!annotation.id) debugger;
      /* eslint-enable */

      svgGroup.push(
        <DrawPart
          {...{
            editorName,
            showPartLabels,
            labelCenter: centerAngle,
            startAngle,
            endAngle,
            onClick,
            onContextMenu,
            annotation,
            totalAngle,
            annotationColor,
            annotationRadius,
            partHeight
          }}
          id={annotation.id}
          key={"Parts" + index}
        />
      );
    });
  return {
    component: (
      <g className="veParts" key="veParts">
        {svgGroup}
      </g>
    ),
    height: maxYOffset * totalAnnotationHeight + 0.5 * partHeight,
    labels
  };
}

export default Parts;
