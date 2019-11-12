import React from "react";
import IntervalTree from "node-interval-tree";
import { sortBy, noop } from "lodash";
import { getRangeLength } from "ve-range-utils";
import getRangeAngles from "./getRangeAnglesSpecial";
import getYOffset from "./getYOffset";
import withHover from "../helperComponents/withHover";
import PositionAnnotationOnCircle from "./PositionAnnotationOnCircle";
import getAnnotationNameAndStartStopString from "../utils/getAnnotationNameAndStartStopString";
import Feature from "./Feature";

function drawAnnotations({
  Annotation,
  annotationType,
  radius,
  isProtein,
  annotations,
  annotationHeight,
  spaceBetweenAnnotations,
  sequenceLength,
  reverseAnnotations, //set true when drawing annotations that use the drawDirectedPiePiece function because that function returns things that need to be flipped
  editorName,
  getColor,
  useStartAngle, //use the startAngle instead of the centerAngle to position the labels
  onClick = noop,
  positionBy, //by default the annotation.start and annotation.end are used to position the annotation on the circle, but passing a function here gives an option to override that
  allOnSameLevel, //by default overlapping annotations are given different yOffsets. Setting this to true prevents that and positions all annotations on the same level (no y-offsets given). Cutsites for example just get drawn all on the same level
  onRightClicked = noop,
  showLabels,
  labelOptions,
  annotationProps
}) {
  const totalAnnotationHeight = annotationHeight + spaceBetweenAnnotations;
  const featureITree = new IntervalTree();
  let maxYOffset = 0;
  const svgGroup = [];
  const labels = {};

  if (!Object.keys(annotations).length) return null;
  sortBy(annotations, a => {
    return -getRangeLength(a, sequenceLength);
  })
    .map(annotation => {
      let {
        startAngle,
        endAngle,
        totalAngle,
        centerAngle,
        locationAngles
      } = getRangeAngles(
        positionBy ? positionBy(annotation) : annotation,
        sequenceLength
      );

      let spansOrigin = startAngle > endAngle;
      let annotationCopy = {
        ...annotation,
        startAngle,
        endAngle,
        locationAngles,
        totalAngle,
        centerAngle,
        yOffset: 0
      };
      if (!allOnSameLevel) {
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
      }

      return annotationCopy;
    })
    .forEach(function(annotation, index) {
      annotation.yOffset = maxYOffset - annotation.yOffset;
      function _onClick(event) {
        onClick({ event, annotation });
        if (annotation.onClick) {
          annotation.onClick({ event, annotation });
        }
      }
      function onContextMenu(event) {
        onRightClicked({ event, annotation });
        if (annotation.onRightClick) {
          annotation.onRightClick({ event, annotation });
        }
      }

      const {
        startAngle,
        endAngle,
        totalAngle,
        centerAngle,
        locationAngles
      } = annotation;

      const titleText = getAnnotationNameAndStartStopString(annotation);

      const annotationRadius =
        radius + annotation.yOffset * totalAnnotationHeight;
      const name =
        annotation.name ||
        (annotation.restrictionEnzyme && annotation.restrictionEnzyme.name);
      if (showLabels) {
        //add labels to the exported label array (to be drawn by the label component)
        labels[annotation.id] = {
          annotationType,
          annotationCenterAngle: useStartAngle ? startAngle : centerAngle,
          annotationCenterRadius: annotationRadius,
          text: name,
          id: annotation.id,
          title: titleText,
          className: annotation.labelClassName || "",
          onClick: _onClick,
          color:
            annotation.labelColor ||
            (annotationType === "part" ? "purple" : "black"),
          onContextMenu,
          ...labelOptions
        };
      }

      let annotationColor = getColor
        ? getColor(annotation)
        : annotation.color || "purple";

      DrawAnnotation.displayName = annotationType + "--- DrawAnnotation";
      svgGroup.push(
        <DrawAnnotation
          {...{
            isProtein,
            titleText,
            editorName,
            annotationType,
            showLabels,
            Annotation,
            labelCenter: centerAngle,
            startAngle,
            endAngle,
            locationAngles,
            reverseAnnotations,
            onClick: _onClick,
            onContextMenu,
            annotation,
            totalAngle,
            annotationColor,
            annotationRadius,
            annotationHeight,
            annotationProps
          }}
          id={annotation.id}
          key={"veAnnotation-" + annotationType + index}
        />
      );
    });
  return {
    component: (
      <g
        className={"veAnnotations-" + annotationType}
        key={"veAnnotations-" + annotationType}
      >
        {svgGroup}
      </g>
    ),
    height: maxYOffset * totalAnnotationHeight + 0.5 * annotationHeight,
    labels
  };
}

export default drawAnnotations;

const DrawAnnotation = withHover(function({
  className,
  startAngle,
  endAngle,
  onClick,
  onContextMenu,
  titleText,
  locationAngles,
  annotation,
  reverseAnnotations,
  Annotation = Feature,
  totalAngle,
  annotationColor,
  isProtein,
  annotationRadius,
  annotationHeight,
  onMouseLeave,
  onMouseOver,
  annotationProps
}) {
  const sharedProps = {
    style: { cursor: "pointer" },
    className: className,
    onContextMenu: onContextMenu,
    onClick: onClick,
    onMouseLeave,
    onMouseOver
  };
  const title = <title>{titleText}</title>;
  return (
    <React.Fragment>
      <g
        {...PositionAnnotationOnCircle({
          sAngle: startAngle,
          eAngle: endAngle,
          forward: reverseAnnotations ? !annotation.forward : annotation.forward
        })}
        {...sharedProps}
      >
        {title}
        <Annotation
          {...(locationAngles &&
            locationAngles.length && { containsLocations: true })}
          totalAngle={totalAngle}
          color={annotationColor}
          isProtein={isProtein}
          radius={annotationRadius}
          annotationHeight={annotationHeight}
          {...annotationProps}
        />
      </g>
      );
      {locationAngles &&
        locationAngles.map(({ startAngle, endAngle, totalAngle }, i) => {
          return (
            <g
              key={"location--" + annotation.id + "--" + i}
              {...PositionAnnotationOnCircle({
                sAngle: startAngle,
                eAngle: endAngle,
                forward: reverseAnnotations
                  ? !annotation.forward
                  : annotation.forward
              })}
              {...sharedProps}
            >
              {title}
              <Annotation
                totalAngle={totalAngle}
                color={annotationColor}
                radius={annotationRadius}
                annotationHeight={annotationHeight}
              />
            </g>
          );
        })}
    </React.Fragment>
  );
});
