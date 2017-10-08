import getAnnotationNameAndStartStopString from "../../utils/getAnnotationNameAndStartStopString";
import "./style.css";
import Feature from "./Feature";
import drawCircularLabel2 from "../drawCircularLabel2";
import intervalTree2 from "teselagen-interval-tree";
import getRangeAngles from "../getRangeAnglesSpecial";
import featureColorMap from "../../constants/featureColorMap.json";
import getYOffset from "../getYOffset";
import lruMemoize from "lru-memoize";
import PositionAnnotationOnCircle from "../PositionAnnotationOnCircle";
import React from "react";
import noop from "lodash/noop";

function Features({
  radius,
  showFeatureLabels = true,
  //configurable
  forceInlineFeatureLabels = true,
  forceOuterFeatureLabels = true,
  spaceBetweenAnnotations = 2,
  featureHeight = 10,
  featureClicked = noop,
  //non-configurable
  HoverHelper,
  features = {},
  sequenceLength
}) {
  let totalAnnotationHeight = featureHeight + spaceBetweenAnnotations;
  let featureITree = new intervalTree2(Math.PI);
  let maxYOffset = 0;
  let svgGroup = [];
  let labels = {};
  Object.keys(features).forEach(function(key, index) {
    let annotation = features[key];
    function onClick(event) {
      featureClicked({ event, annotation });
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

    annotationRadius = radius + annotationCopy.yOffset * totalAnnotationHeight;
    //check if annotation name will fit
    let labelAngle = annotation.name.length * 9 / annotationRadius;
    if (!forceOuterFeatureLabels && showFeatureLabels) {
      labelFits = labelAngle < totalAngle;
      if (!labelFits || forceInlineFeatureLabels) {
        //if the label doesn't fit within the annotation, draw it to the side
        expandedEndAngle += labelAngle; //expand the end angle because we're treating the label as part of the annotation
        //calculate the new center angle of the label
        labelCenter = endAngle + labelAngle / 2;
        //and calculate a new y offset
        //we need to check both locations to account for annotations that span the origin
        yOffset1 = getYOffset(featureITree, startAngle, expandedEndAngle);
        yOffset2 = getYOffset(
          featureITree,
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

    if (!labelFits && showFeatureLabels) {
      //add labels to the exported label array (to be drawn by the label component)
      labels[annotation.id] = {
        annotationCenterAngle: centerAngle,
        annotationCenterRadius: annotationRadius,
        text: annotation.name,
        id: annotation.id,
        className: "veFeatureLabel",
        onClick
      };
    }
    if (spansOrigin) {
      featureITree.add(startAngle, expandedEndAngle, undefined, {
        ...annotationCopy
      });
    } else {
      //normal feature
      // we need to add it twice to the interval tree to accomodate features which span the origin
      featureITree.add(startAngle, expandedEndAngle, undefined, {
        ...annotationCopy
      });
      featureITree.add(
        startAngle + 2 * Math.PI,
        expandedEndAngle + 2 * Math.PI,
        undefined,
        { ...annotationCopy }
      );
    }

    if (annotationCopy.yOffset > maxYOffset) {
      maxYOffset = annotationCopy.yOffset;
    }

    let annotationColor = annotation.color || "#BBBBBB";
    if (annotation.type) {
      if (featureColorMap[annotation.type]) {
        annotationColor = featureColorMap[annotation.type];
      }
    }

    if (!annotation.id) debugger;
    svgGroup.push(
      <HoverHelper
        id={annotation.id}
        key={"Features" + index}
        passJustOnMouseOverAndClassname
      >
        <g onClick={onClick} className="Features clickable">
          <title>
            {getAnnotationNameAndStartStopString(annotation)}
          </title>
          <PositionAnnotationOnCircle
            key={"feature" + index}
            sAngle={startAngle}
            eAngle={endAngle}
            forward={!annotation.forward}
          >
            <Feature
              totalAngle={totalAngle}
              color={annotationColor}
              key={"feature" + index}
              radius={annotationRadius}
              annotationHeight={featureHeight}
            />
          </PositionAnnotationOnCircle>
          {labelFits &&
            showFeatureLabels &&
            <PositionAnnotationOnCircle
              key={"inlineLabel" + index}
              sAngle={labelCenter + Math.PI} //add PI because drawCircularLabel is drawing 180
              eAngle={labelCenter + Math.PI}
            >
              {drawCircularLabel2({
                centerAngle: labelCenter, //used to flip label if necessary
                radius: annotationRadius,
                height: featureHeight,
                text: annotation.name,
                id: annotation.id
              })}
            </PositionAnnotationOnCircle>}
        </g>
      </HoverHelper>
    );
  });
  return {
    component: (
      <g className="veFeatures" key="veFeatures">
        {svgGroup}
      </g>
    ),
    height: maxYOffset * totalAnnotationHeight + 0.5 * featureHeight,
    labels
  };
}

export default lruMemoize(5, undefined, true)(Features);
