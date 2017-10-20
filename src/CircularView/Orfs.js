import getAnnotationNameAndStartStopString from "../utils/getAnnotationNameAndStartStopString";
import orfFrameToColorMap from "../constants/orfFrameToColorMap";
import drawDirectedPiePiece from "./drawDirectedPiePiece";
import intervalTree2 from "teselagen-interval-tree";
import getRangeAngles from "./getRangeAnglesSpecial";
// import getAngleForPositionMidpoint from "./getAngleForPositionMidpoint";
import getYOffset from "./getYOffset";
// import lruMemoize from "lru-memoize";
import PositionAnnotationOnCircle from "./PositionAnnotationOnCircle";
import React from "react";
import noop from "lodash/noop";
import withHover from "../helperComponents/withHover";

function Orfs({
  radius,
  //configurable
  spaceBetweenAnnotations = 2,
  orfHeight = 6,
  orfClicked = noop,
  //non-configurable
  editorName,
  orfs = {},
  sequenceLength
  // annotationHeight
}) {
  // var orfHeight
  let totalAnnotationHeight = orfHeight + spaceBetweenAnnotations;
  let itree = new intervalTree2(Math.PI);
  let maxYOffset = 0;
  let svgGroup = [];
  let labels = {};
  if (!Object.keys(orfs).length) {
    return null;
  }
  Object.keys(orfs).forEach(function(key, index) {
    let annotation = orfs[key];
    function onClick(event) {
      orfClicked({ event, annotation });
      event.stopPropagation();
    }
    let annotationCopy = { ...annotation };

    let { startAngle, endAngle, totalAngle } = getRangeAngles(
      annotation,
      sequenceLength
    );

    let spansOrigin = startAngle > endAngle;
    //expand the end angle if annotation spans the origin
    let expandedEndAngle = spansOrigin ? endAngle + 2 * Math.PI : endAngle;
    let yOffset1;
    let yOffset2;
    if (spansOrigin) {
      annotationCopy.yOffset = getYOffset(itree, startAngle, expandedEndAngle);
    } else {
      //we need to check both locations to account for annotations that span the origin
      yOffset1 = getYOffset(itree, startAngle, expandedEndAngle);
      yOffset2 = getYOffset(
        itree,
        startAngle + Math.PI * 2,
        expandedEndAngle + Math.PI * 2
      );
      annotationCopy.yOffset = Math.max(yOffset1, yOffset2);
    }

    if (spansOrigin) {
      itree.add(startAngle, expandedEndAngle, undefined, { ...annotationCopy });
    } else {
      //normal orf
      // we need to add it twice to the interval tree to accomodate orfs which span the origin
      itree.add(startAngle, expandedEndAngle, undefined, { ...annotationCopy });
      itree.add(
        startAngle + 2 * Math.PI,
        expandedEndAngle + 2 * Math.PI,
        undefined,
        { ...annotationCopy }
      );
    }

    if (annotationCopy.yOffset > maxYOffset) {
      maxYOffset = annotationCopy.yOffset;
    }
    let annotationRadius =
      radius + annotationCopy.yOffset * totalAnnotationHeight;
    let path = drawDirectedPiePiece({
      radius: annotationRadius,
      annotationHeight: orfHeight,
      totalAngle,
      arrowheadLength: 0.4,
      tailThickness: 0.4
    }).print();

    let color = orfFrameToColorMap[annotation.frame];
    svgGroup.push(
      <DrawOrf
        id={annotation.id}
        key={"orf" + index}
        {...{
          onClick,
          editorName,
          annotation,
          startAngle,
          endAngle,
          color,
          path
        }}
      />
    );
  });
  return {
    component: (
      <g className="veOrfs" key="veOrfs">
        {svgGroup}
      </g>
    ),
    height: maxYOffset * totalAnnotationHeight + 0.5 * orfHeight,
    labels
  };
}

// export default lruMemoize(5, undefined, true)(Orfs);
export default Orfs;

const DrawOrf = withHover(
  ({
    hoverActions,
    hoverProps: { className },
    onClick,
    annotation,
    startAngle,
    endAngle,
    color,
    path
  }) => {
    return (
      <g
        {...hoverActions}
        onClick={onClick}
        className={"Orfs clickable " + className}
      >
        <title>
          {" "}
          {getAnnotationNameAndStartStopString(annotation, {
            startText: "Open Reading Frame:"
          })}{" "}
        </title>
        <PositionAnnotationOnCircle
          sAngle={startAngle}
          eAngle={endAngle}
          forward={!annotation.forward}
        >
          <path
            className="veOrf"
            strokeWidth=".5"
            stroke={color}
            fill={color}
            d={path}
          />
        </PositionAnnotationOnCircle>
        {/*{
              [annotation.forward ? annotation.start : annotation.end,...annotation.internalStartCodonIndices].map(function (position) {
                var circleAngle = getAngleForPositionMidpoint(position, sequenceLength);
                return <PositionAnnotationOnCircle
                  sAngle={ circleAngle }
                  eAngle={ circleAngle }
                  height={ annotationRadius }
                  forward={!annotation.forward}>
                  <circle
                      r={3}
                      strokeWidth=".5"
                      stroke={ color }
                      fill={ color }
                      d={ path }
                    />
                </PositionAnnotationOnCircle>
              })
            }*/}
      </g>
    );
  }
);
