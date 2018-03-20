import withHover from "../../helperComponents/withHover";
import getAnnotationNameAndStartStopString from "../../utils/getAnnotationNameAndStartStopString";
import "./style.css";
import Primer from "./Primer";
import drawCircularLabel2 from "../drawCircularLabel2";
import IntervalTree from "node-interval-tree";
import getRangeAngles from "../getRangeAnglesSpecial";

import getYOffset from "../getYOffset";
// import lruMemoize from "lru-memoize";
import PositionAnnotationOnCircle from "../PositionAnnotationOnCircle";
import React from "react";
import noop from "lodash/noop";

function Primers({
  radius,
  //configurable
  forceInlinePrimerLabels = true,
  forceOuterPrimerLabels = true,
  spaceBetweenAnnotations = 2,
  showPrimerLabels = true,
  primerHeight = 10,
  primerClicked = noop,
  primerRightClicked = noop,
  //non-configurable
  editorName,
  primers = {},
  sequenceLength
}) {
  if (!Object.keys(primers).length) return null;
  let totalAnnotationHeight = primerHeight + spaceBetweenAnnotations;
  let primerITree = new IntervalTree();
  let maxYOffset = 0;
  let svgGroup = [];
  let labels = {};
  Object.keys(primers).forEach(function(key, index) {
    let annotation = primers[key];
    function onClick(event) {
      primerClicked({ event, annotation });
      event.stopPropagation();
    }
    function onContextMenu(event) {
      primerRightClicked({ event, annotation });
      event.stopPropagation();
    }
    let annotationCopy = { ...annotation };
    let annotationRadius;
    let labelFits;

    let { startAngle, endAngle, totalAngle, centerAngle } = getRangeAngles(
      annotation,
      sequenceLength
    );

    let spansOrigin = startAngle > endAngle;
    let labelCenter = centerAngle;
    //expand the end angle if annotation spans the origin
    let expandedEndAngle = spansOrigin ? endAngle + 2 * Math.PI : endAngle;
    let yOffset1;
    let yOffset2;
    if (spansOrigin) {
      annotationCopy.yOffset = getYOffset(
        primerITree,
        startAngle,
        expandedEndAngle
      );
    } else {
      //we need to check both locations to account for annotations that span the origin
      yOffset1 = getYOffset(primerITree, startAngle, expandedEndAngle);
      yOffset2 = getYOffset(
        primerITree,
        startAngle + Math.PI * 2,
        expandedEndAngle + Math.PI * 2
      );
      annotationCopy.yOffset = Math.max(yOffset1, yOffset2);
    }

    annotationRadius = radius + annotationCopy.yOffset * totalAnnotationHeight;
    //check if annotation name will fit
    let labelAngle = annotation.name.length * 9 / annotationRadius;
    if (!forceOuterPrimerLabels && showPrimerLabels) {
      labelFits = labelAngle < totalAngle;
      if (!labelFits || forceInlinePrimerLabels) {
        //if the label doesn't fit within the annotation, draw it to the side
        expandedEndAngle += labelAngle; //expand the end angle because we're treating the label as part of the annotation
        //calculate the new center angle of the label
        labelCenter = endAngle + labelAngle / 2;
        //and calculate a new y offset
        //we need to check both locations to account for annotations that span the origin
        yOffset1 = getYOffset(primerITree, startAngle, expandedEndAngle);
        yOffset2 = getYOffset(
          primerITree,
          startAngle + Math.PI * 2,
          expandedEndAngle + Math.PI * 2
        );
        annotationCopy.yOffset = Math.max(yOffset1, yOffset2);
        labelFits = true;
        // calculate the radius again
        annotationRadius =
          radius + annotationCopy.yOffset * totalAnnotationHeight;
      }
    }
    // calculate the (potentially new) labelCenter

    // if (yOffset > 5) {
    //     //don't push the annotation onto the pile
    //     return
    // }

    if (!labelFits && showPrimerLabels) {
      //add labels to the exported label array (to be drawn by the label component)
      labels[annotation.id] = {
        annotationCenterAngle: centerAngle,
        annotationCenterRadius: annotationRadius,
        text: annotation.name,
        id: annotation.id,
        className: "vePrimerLabel",
        onClick,
        onContextMenu
      };
    }
    if (spansOrigin) {
      primerITree.insert(startAngle, expandedEndAngle, {
        ...annotationCopy
      });
    } else {
      //normal primer
      // we need to add it twice to the interval tree to accomodate primers which span the origin
      primerITree.insert(startAngle, expandedEndAngle, {
        ...annotationCopy
      });
      primerITree.insert(
        startAngle + 2 * Math.PI,
        expandedEndAngle + 2 * Math.PI,
        { ...annotationCopy }
      );
    }

    if (annotationCopy.yOffset > maxYOffset) {
      maxYOffset = annotationCopy.yOffset;
    }
    /* eslint-disable */

    if (!annotation.id) debugger;
    /* eslint-enable */

    svgGroup.push(
      <DrawPrimer
        id={annotation.id}
        key={"Primers" + index}
        {...{
          onClick,
          onContextMenu,
          editorName,
          annotation,
          startAngle,
          endAngle,
          totalAngle,
          annotationRadius,
          labelFits,
          showPrimerLabels,
          labelCenter,
          primerHeight
        }}
      />
    );
  });
  return {
    component: (
      <g className="vePrimers" key="vePrimers">
        {svgGroup}
      </g>
    ),
    height: maxYOffset * totalAnnotationHeight + 0.5 * primerHeight,
    labels
  };
}

// export default lruMemoize(5, undefined, true)(Primers);
export default Primers;

const DrawPrimer = withHover(
  ({
    hoverActions,
    hoverProps: { className },
    onClick,
    onContextMenu,
    annotation,
    startAngle,
    endAngle,
    totalAngle,
    annotationRadius,
    labelFits,
    showPrimerLabels,
    labelCenter,
    primerHeight
  }) => {
    return (
      <g
        {...hoverActions}
        onClick={onClick}
        onContextMenu={onContextMenu}
        className={"Primers clickable" + className}
      >
        <title>{getAnnotationNameAndStartStopString(annotation)}</title>
        <PositionAnnotationOnCircle
          sAngle={startAngle}
          eAngle={endAngle}
          forward={!annotation.forward}
        >
          <Primer
            totalAngle={totalAngle}
            color={annotation.color}
            radius={annotationRadius}
            annotationHeight={primerHeight}
          />
        </PositionAnnotationOnCircle>
        {labelFits &&
          showPrimerLabels && (
            <PositionAnnotationOnCircle
              sAngle={labelCenter + Math.PI} //add PI because drawCircularLabel is drawing 180
              eAngle={labelCenter + Math.PI}
            >
              {drawCircularLabel2({
                centerAngle: labelCenter, //used to flip label if necessary
                radius: annotationRadius,
                height: primerHeight,
                text: annotation.name,
                id: annotation.id
              })}
            </PositionAnnotationOnCircle>
          )}
      </g>
    );
  }
);
