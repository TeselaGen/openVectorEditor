import React from "react";
import IntervalTree from "node-interval-tree";
import { sortBy, noop } from "lodash";
import { getRangeLength } from "@teselagen/range-utils";
import getRangeAngles from "./getRangeAnglesSpecial";
import getYOffset from "./getYOffset";
import withHover from "../helperComponents/withHover";
import PositionAnnotationOnCircle from "./PositionAnnotationOnCircle";
import getAnnotationNameAndStartStopString from "../utils/getAnnotationNameAndStartStopString";
import Feature from "./Feature";
import getAnnotationClassnames from "../utils/getAnnotationClassnames";
// import { normalizeAngleRange } from "./normalizeAngleRange";
// import { normalizeAngle } from "./normalizeAngle";

//annotations coming in can be positioned either by caretPosition or range
function drawAnnotations(props) {
  const {
    readOnly,
    annotationType,
    radius,
    noHover,
    isProtein,
    type,
    annotations,
    annotationHeight,
    noTitle,
    spaceBetweenAnnotations,
    sequenceLength,
    showCicularViewInternalLabels,
    // reverseAnnotations, //set true when drawing annotations that use the drawDirectedPiePiece function because that function returns things that need to be flipped
    // editorName,
    getColor,
    useStartAngle, //use the startAngle instead of the centerAngle to position the labels
    onClick = noop,
    noHeight,
    positionBy, //by default the annotation.start and annotation.end are used to position the annotation on the circle, but passing a function here gives an option to override that
    allOnSameLevel, //by default overlapping annotations are given different yOffsets. Setting this to true prevents that and positions all annotations on the same level (no y-offsets given). Cutsites for example just get drawn all on the same level
    onRightClicked = noop,
    onDoubleClick = noop,
    showLabels,
    hideAnnotation,
    // rotationRadians,
    labelOptions,
    annotationProps,
    fontStyle
    // isZoomedIn,
    // visibleAngleRange
  } = props;
  const totalAnnotationHeight = annotationHeight + spaceBetweenAnnotations;
  const featureITree = new IntervalTree();
  let maxYOffset = 0;
  const svgGroup = [];
  const labels = {};

  if (!Object.keys(annotations).length) return null;
  sortBy(annotations, (a) => {
    return -getRangeLength(a, sequenceLength);
  })
    .map((annotation) => {
      const { startAngle, endAngle, totalAngle, centerAngle, locationAngles } =
        getRangeAngles(
          positionBy ? positionBy(annotation) : annotation,
          sequenceLength
        );
      const spansOrigin = startAngle > endAngle;
      const annotationCopy = {
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
        const expandedEndAngle = spansOrigin
          ? endAngle + 2 * Math.PI
          : endAngle;
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
    .forEach(function (annotation, index) {
      annotation.yOffset = maxYOffset - annotation.yOffset;
      function _onClick(event) {
        onClick && onClick({ event, annotation });
        annotation.onClick && annotation.onClick({ event, annotation });
      }
      function onContextMenu(event) {
        onRightClicked({ event, annotation });
        if (annotation.onRightClick) {
          annotation.onRightClick({ event, annotation });
        }
      }
      function _onDoubleClick(event) {
        onDoubleClick && onDoubleClick({ event, annotation });
        if (annotation.onDoubleClick) {
          annotation.onDoubleClick({ event, annotation });
        }
      }

      const {
        startAngle,
        endAngle,
        totalAngle,
        centerAngle,
        locationAngles,
        ...rest
      } = annotation;

      const _annotationProps = {
        ...annotationProps,
        ...rest
      };

      const titleText = getAnnotationNameAndStartStopString(annotation, {
        isProtein,
        readOnly
      });

      const classNames = getAnnotationClassnames(annotation, {
        viewName: "CircularView",
        type,
        isProtein,
        readOnly
      });

      const annotationRadius =
        radius + annotation.yOffset * totalAnnotationHeight;
      const name =
        annotation.name ||
        (annotation.restrictionEnzyme && annotation.restrictionEnzyme.name);
      let ellipsizedName;
      // let spaceBeforeName = 0;
      let angleAdjust;

      if (name && showCicularViewInternalLabels) {
        // eslint-disable-next-line no-inner-declarations
        function getEllipsizedName(totalAngle) {
          let ellipsizedName;
          const arcLength =
            2 * Math.PI * (annotationRadius - annotationHeight) * totalAngle; //for arrowhead

          const annLength = Math.max(0, Math.floor(arcLength / 55 - 3));
          ellipsizedName = name.slice(0, annLength);
          if (ellipsizedName && ellipsizedName !== name) {
            if (ellipsizedName.length >= name.length - 2) {
              ellipsizedName = name;
            } else if (ellipsizedName.length > 3) {
              ellipsizedName += "..";
            } else {
              ellipsizedName = undefined;
            }
          }
          return ellipsizedName;
        }
        if (locationAngles) {
          annotation.locationAngles = locationAngles.map((l) => {
            const en = getEllipsizedName(l.totalAngle);
            if (en?.length > (ellipsizedName?.length || 0)) {
              ellipsizedName = en;
            }
            return {
              ...l,
              ellipsizedName: en
            };
          });
        } else {
          ellipsizedName = getEllipsizedName(totalAngle);
        }

        // //tnr: WIP to try to adjust the inline label in the circular view to always show up even when zoomed in
        // if (ellipsizedName && isZoomedIn) {
        //   const nameAngle =
        //     ((ellipsizedName.length + 3) * 55) /
        //     (2 * Math.PI * (annotationRadius - annotationHeight));
        //   const maxAngleAdjust = (totalAngle - nameAngle) / 2;
        //   const idealAngle = normalizeAngle(
        //     -normalizeAngle(rotationRadians) - normalizeAngle(centerAngle)
        //   );
        //   angleAdjust = idealAngle;
        //   if (
        //     Math.min(maxAngleAdjust, idealAngle) !== idealAngle
        //     // &&
        //     // Math.min(maxAngleAdjust, 2 * Math.PI - idealAngle) !==
        //     //   2 * Math.PI - idealAngle
        //   ) {
        //     angleAdjust = -maxAngleAdjust;
        //     if (
        //       normalizeAngle(
        //         normalizeAngle(centerAngle) + normalizeAngle(rotationRadians)
        //       ) > Math.PI
        //     ) {
        //       angleAdjust = -angleAdjust;
        //     }
        //   }
        //   // angleAdjust =idealAngle
        //   angleAdjust = (angleAdjust / Math.PI) * 180;
        //   // if (normalizeAngle(normalizeAngle(centerAngle) + normalizeAngle(rotationRadians)) > Math.PI) {
        //   //   angleAdjust = -angleAdjust;
        //   // }
        // }
      }
      if (showLabels && !ellipsizedName) {
        //add labels to the exported label array (to be drawn by the label component)
        labels[annotation.id] = {
          annotation,
          annotationType,
          annotationCenterAngle: useStartAngle ? startAngle : centerAngle,
          annotationCenterRadius: annotationRadius,
          text: name,
          id: annotation.id,
          title: titleText,
          className: `${classNames} ${annotation.labelClassName || ""}`,
          highPriorityLabel: annotation.highPriorityLabel,
          onClick: _onClick,
          onDoubleClick: _onDoubleClick,
          fontStyle: fontStyle || "normal",
          color:
            annotation.labelColor ||
            (annotationType === "part" ? "#ac68cc" : "black"),
          onContextMenu,
          ...labelOptions
        };
      }
      if (!hideAnnotation) {
        const annotationColor = getColor
          ? getColor(annotation)
          : annotation.color || "#ac68cc";
        DrawAnnotation.displayName = annotationType + "--- DrawAnnotation";
        const CompToUse = noHover ? DrawAnnotationInner : DrawAnnotation;
        svgGroup.push(
          <CompToUse
            {...{
              ...props,
              ...rest,
              ...annotation,
              angleAdjust,
              ellipsizedName,
              name,
              annotationHeight,
              annotationRadius,
              annotationType,
              isProtein,
              noTitle,
              titleText,
              classNames,
              onClick: _onClick,
              onDoubleClick: _onDoubleClick,
              onContextMenu,
              annotation,
              annotationColor,
              totalAngle,
              centerAngle,
              annotationProps: _annotationProps
            }}
            id={annotation.id}
            key={"veAnnotation-" + annotationType + index}
          />
        );
      }
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
    height: noHeight
      ? 0
      : maxYOffset * totalAnnotationHeight + 0.5 * annotationHeight,
    labels
  };
}

export default drawAnnotations;

function DrawAnnotationInner({
  className,
  startAngle,
  endAngle,
  onClick,
  onDoubleClick,
  onContextMenu,
  titleText,
  classNames,
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
  annotationType,
  annotationProps,
  addHeight,
  noTitle,
  useCenter,
  centerAngle,
  perAnnotationProps,
  passAnnotation,
  ellipsizedName,
  angleAdjust,
  rotationRadians
}) {
  const sharedProps = {
    style: noTitle ? undefined : { cursor: "pointer" },
    className: `${className} ${classNames}`,
    onContextMenu: onContextMenu,
    onClick: onClick,
    onDoubleClick: onDoubleClick,
    onMouseLeave,
    onMouseOver
  };
  const title = <title>{titleText}</title>;
  function getInner(
    {
      startAngle,
      endAngle,
      totalAngle,
      isNotLocation,
      containsLocations,
      ellipsizedName: ellipsizedNameLocation
    },
    i
  ) {
    const { transform, revTransform } = PositionAnnotationOnCircle({
      sAngle: useCenter ? centerAngle : startAngle,
      eAngle: useCenter ? centerAngle : endAngle,
      height: addHeight ? annotationRadius : undefined,
      forward: reverseAnnotations ? !annotation.forward : annotation.forward
    });
    return (
      <g
        transform={transform}
        key={
          isNotLocation
            ? "notLocation"
            : "location--" + annotation.id + "--" + i
        }
        // {...(ellipsizedName && ellipsizedName !== name
        //   ? { "data-tip": name }
        //   : {})}
        {...sharedProps}
      >
        {noTitle ? null : title}
        <Annotation
          {...(passAnnotation && { annotation })}
          annotationType={annotationType}
          arrowheadType={annotation.arrowheadType}
          totalAngle={totalAngle}
          centerAngle={centerAngle}
          revTransform={revTransform}
          rotationRadians={rotationRadians}
          ellipsizedName={
            containsLocations ? ellipsizedNameLocation : ellipsizedName
          }
          locationNumber={i}
          angleAdjust={angleAdjust}
          color={annotationColor}
          isProtein={isProtein}
          containsLocations={containsLocations}
          radius={annotationRadius}
          annotationHeight={annotationHeight}
          {...annotationProps}
          {...(perAnnotationProps && perAnnotationProps(annotation))}
        />
      </g>
    );
  }
  return (
    <React.Fragment>
      {getInner({
        startAngle,
        endAngle,
        totalAngle,
        centerAngle,
        containsLocations: !!locationAngles
      })}
      {locationAngles && locationAngles.map(getInner)}
    </React.Fragment>
  );
}

const DrawAnnotation = withHover(DrawAnnotationInner);
