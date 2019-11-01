import React from "react";
import pluralize from "pluralize";
import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";
import {
  getPositionFromAngle,
  normalizePositionByRangeLength,
  // invertRange,
  getOverlapsOfPotentiallyCircularRanges,
  getRangeLength
} from "ve-range-utils";
import drawAnnotations from "../CircularView/drawAnnotations";
import calculateTickMarkPositionsForGivenRange from "../utils/calculateTickMarkPositionsForGivenRange";
import shouldFlipText from "../CircularView/shouldFlipText";
import { divideBy3 } from "../utils/proteinUtils";
import { flatMap, startCase } from "lodash";
import withEditorInteractions from "../withEditorInteractions";
import { getOrfColor } from "../constants/orfFrameToColorMap";
import { pareDownAnnotations } from "../utils/editorUtils";
import VeWarning from "../helperComponents/VeWarning";
import Draggable from "react-draggable";
import draggableClassnames from "../constants/draggableClassnames";

const BASE_RADIUS = 70;
const sharedAnnotationProps = {
  showLabels: true,
  maxToDisplay: 50
};

// const VIEW_WIDTH = 400;
class CircularViewWithZoom extends React.Component {
  getNearestCursorPositionToMouseEvent(event, sequenceLength, callback) {
    if (!event.clientX) {
      return;
    }
    let boundingRect = this.refs.circularView.getBoundingClientRect();
    //get relative click positions
    let clickX = event.clientX - boundingRect.left - boundingRect.width / 2;
    let clickY = event.clientY - boundingRect.top - boundingRect.height / 2;

    //get angle
    let angle = Math.atan2(clickY, clickX) + Math.PI / 2;
    if (angle < 0) angle += Math.PI * 2; //normalize the angle if necessary
    let nearestCaretPos =
      sequenceLength === 0
        ? 0
        : normalizePositionByRangeLength(
            getPositionFromAngle(angle, sequenceLength, true),
            sequenceLength
          ); //true because we're in between positions
    if (this.props.sequenceData && this.props.sequenceData.isProtein) {
      nearestCaretPos = Math.round(nearestCaretPos / 3) * 3;
    }
    callback({
      event,
      className: event.target.parentNode.className.animVal,
      shiftHeld: event.shiftKey,
      nearestCaretPos,
      selectionStartGrabbed: event.target.parentNode.classList.contains(
        draggableClassnames.selectionStart
      ),
      selectionEndGrabbed: event.target.parentNode.classList.contains(
        draggableClassnames.selectionEnd
      )
    });
  }
  state = {
    zoomLevel: 3,
    rotationDegrees: 0
  };
  cachedLayers = {};
  memoedDrawAnnotations = p => {
    const layerKey =
      p.radius +
      p.rotation +
      p.annotationType +
      p.annotations.reduce(
        (acc, a) => (acc += a.name + "-" + a.start + "-" + a.end),
        ""
      );
    if (this.cachedLayers[layerKey]) {
      return this.cachedLayers[layerKey];
    }
    const r = drawAnnotations(p);
    this.cachedLayers[layerKey] = r;
    return r;
  };
  render() {
    const {
      width = 400,
      height = 400,
      // sequenceLength = 100,
      editorName,
      maxAnnotationsToDisplay = {},
      sequenceData,
      editorDragged,
      editorDragStarted,
      editorDragStopped,
      instantiated,
      editorClicked,
      backgroundRightClicked,
      annotationVisibility,
      selectionLayer = { start: -1, end: -1 },
      searchLayers = [],
      additionalSelectionLayers = [],
      annotationHeight = 15,
      spaceBetweenAnnotations = 2,
      isProtein
    } = this.props;
    const percentOfCircle = 1 / this.state.zoomLevel;
    const sequenceLength = sequenceData.sequence.length;
    const svgWidth = Math.max(Number(width) || 300);
    const svgHeight = Math.max(Number(height) || 300);
    // if (percentOfCircle === 1) {
    //   return "normal"
    // }

    // const numBpsToShow = Math.ceil(sequenceLength / this.state.zoomLevel);
    const angle = 2 * Math.PI * percentOfCircle;

    let radius =
      this.state.zoomLevel === 1
        ? BASE_RADIUS
        : Math.max(BASE_RADIUS, svgWidth / Math.sin(angle / 2) / 2);

    const initialRadius = radius;

    const rotation = this.state.rotationDegrees * 0.0174533; //get radians
    const rangeToShowStart = getPositionFromAngle(
      rotation - angle / 2,
      sequenceLength
    );
    const rangeToShowEnd = getPositionFromAngle(
      rotation + angle / 2,
      sequenceLength
    );
    const rangeToShow =
      this.state.zoomLevel === 1
        ? { start: 0, end: Math.max(sequenceLength - 1, 0) }
        : {
            start: normalizePositionByRangeLength(
              rangeToShowStart,
              sequenceLength
            ),
            end: normalizePositionByRangeLength(rangeToShowEnd, sequenceLength)
          };

    const allLabels = [];
    const paredDownMessages = [];
    const rangeToShowLength = getRangeLength(rangeToShow, sequenceLength);
    const layers = [
      {
        annotationType: "feature",
        ...sharedAnnotationProps,
        spaceAfter: 22
      },
      {
        annotationType: "axisNumbers",
        annotations: calculateTickMarkPositionsForGivenRange({
          range: rangeToShow,
          tickSpacing:
            rangeToShowLength < 10
              ? 1
              : rangeToShowLength < 50
              ? Math.ceil(rangeToShowLength / 5)
              : Math.ceil(rangeToShowLength / 100) * 10,
          sequenceLength,
          isProtein
        }).map(pos => {
          return {
            tickPosition: pos,
            start: pos,
            end: pos
          };
        }),
        annotationProps: {
          hideNumbers: !annotationVisibility.axisNumbers
        },
        Annotation: AxisNumbers,
        passAnnotation: true,
        allOnSameLevel: true,
        addHeight: true,
        showLabels: false,
        spaceBefore: annotationVisibility.axisNumbers ? 0 : -10,
        spaceAfter: -5,
        show: annotationVisibility.axis
      },
      {
        annotationType: "axis",
        annotations: [rangeToShow],
        annotationProps: {
          color: "white",
          stroke: "black",
          arrowheadLength: 0
        },
        annotationHeight: 5,
        spaceAfter: 10,
        showLabels: false,
        show: annotationVisibility.axis
      },
      {
        annotationType: "selectionLayer",
        annotationProps: {
          color: "blue",
          stroke: "black",
          arrowheadLength: 0
        },
        drawProps: ({ radius }) => ({
          radius:
            initialRadius + (radius - initialRadius) / 2 - annotationHeight / 2,
          annotationHeight: radius - initialRadius
        }),
        annotations: [
          ...additionalSelectionLayers,
          ...searchLayers,
          ...(Array.isArray(selectionLayer) ? selectionLayer : [selectionLayer])
        ].filter(s => {
          return s.start >= 0 && s.end >= 0 && sequenceLength > 0;
        }),
        allOnSameLevel: true,
        noHeight: true
      },
      {
        annotationType: "cutsite",
        annotationProps: {
          // color: "white",
          stroke: "black",
          arrowheadLength: 0
        },
        addHeight: true,
        Annotation: Cutsites,
        useStartAngle: true,
        allOnSameLevel: true,
        maxToDisplay: 100
      },

      {
        annotationType: "part",
        ...sharedAnnotationProps,
        spaceAfter: 10
      },

      {
        annotationType: "orf",
        getColor: getOrfColor,
        perAnnotationProps: a => ({
          stroke: a.color
        }),
        annotationProps: {
          tailThickness: 0.4
        },
        maxToDisplay: 50
      },
      ...["lineageAnnotation", "assemblyPiece", "warning"].map(t => ({
        annotationType: t,
        ...sharedAnnotationProps,
        spaceBefore: 10
      }))
    ].map(
      ({
        spaceAfter = 0,
        drawProps,
        maxToDisplay,
        alwaysShow,
        noHeight,
        isAnnotation,
        spaceBefore = 0,
        ...layer
      }) => {
        const layerNamePlural = pluralize(layer.annotationType);
        if (annotationVisibility[layerNamePlural] === false) {
          return null;
        }
        const trimmedAnnotations = flatMap(
          layer.annotations || sequenceData[layer.annotationType + "s"] || [],
          range => {
            const trimmedRange = getOverlapsOfPotentiallyCircularRanges(
              range,
              rangeToShow,
              sequenceLength,
              true
            );
            if (!trimmedRange || !trimmedRange.length) return [];
            return { ...range, ...trimmedRange };
          }
        );
        // layer.annotationType === "cutsite" &&
        //   console.log(`trimmedAnnotations:`, trimmedAnnotations);
        const maxToShow =
          maxAnnotationsToDisplay[layerNamePlural] || maxToDisplay;
        let [trimmedAndParedAnns, paredDown] = maxToShow
          ? pareDownAnnotations(trimmedAnnotations, maxToShow)
          : [trimmedAnnotations];

        if (paredDown) {
          paredDownMessages.push(
            <VeWarning
              key={layerNamePlural}
              data-test={`ve-warning-max${startCase(layerNamePlural)}ToDisplay`}
              tooltip={`Warning: More than ${maxToShow} ${startCase(
                layerNamePlural
              )}. Only displaying ${maxToShow}`}
            />
          );
        }
        radius += spaceBefore;
        const returnVal = drawAnnotations({
          // const returnVal = this.memoedDrawAnnotations({
          annotationProps: {
            ...layer.annotationProps,
            isProtein
          },
          rotation,
          radius,
          annotations: trimmedAndParedAnns,
          annotationHeight,
          spaceBetweenAnnotations,
          sequenceLength,
          onClick: this.props[layer.annotationType + "Clicked"],
          onRightClicked: this.props[layer.annotationType + "RightClicked"],
          editorName,
          arrowheadLength: 10,
          ...(drawProps && drawProps({ radius })),
          ...layer
        });
        if (!returnVal) return null;
        const { component, height, labels } = returnVal;
        radius += noHeight ? 0 : height;
        radius += spaceAfter;
        allLabels.push(labels);

        return component;
      }
    );
    return (
      <div>
        <div>
          <DrawName
            {...{
              isZoomed: this.state.zoomLevel !== 1,
              sequenceName: sequenceData.name,
              isProtein,
              sequenceLength,
              innerRadius: BASE_RADIUS
            }}
          />
          <Warnings
            {...{
              circular: sequenceData.circular,
              paredDownMessages
            }}
          />
          <Draggable
            // enableUserSelectHack={false} //needed to prevent the input bubble from losing focus post user drag
            bounds={{ top: 0, left: 0, right: 0, bottom: 0 }}
            onDrag={event => {
              this.getNearestCursorPositionToMouseEvent(
                event,
                sequenceLength,
                editorDragged
              );
            }}
            onStart={event => {
              this.getNearestCursorPositionToMouseEvent(
                event,
                sequenceLength,
                editorDragStarted
              );
            }}
            onStop={editorDragStopped}
          >
            <svg
              onClick={event => {
                instantiated &&
                  this.getNearestCursorPositionToMouseEvent(
                    event,
                    sequenceLength,
                    editorClicked
                  );
              }}
              onContextMenu={e => {
                this.getNearestCursorPositionToMouseEvent(
                  e,
                  sequenceLength,
                  backgroundRightClicked
                );
              }}
              ref="circularView"
              className="circularViewSvg"
              viewBox={`${-svgWidth / 2},${-svgHeight / 2 -
                (this.state.zoomLevel === 1
                  ? 0
                  : initialRadius + BASE_RADIUS * 2)},${svgWidth},${svgHeight}`}
              width={svgHeight}
              height={svgWidth}
            >
              <g transform={`rotate(${-this.state.rotationDegrees})`}>
                {layers}
              </g>
            </svg>
          </Draggable>
        </div>
        <div style={{ position: "absolute", left: 10, top: 5 }}>
          <UncontrolledSliderWithPlusMinusBtns
            onChange={val => {
              this.setState({
                zoomLevel: val
              });
            }}
            onRelease={val => {
              this.setState({
                zoomLevel: val
              });
            }}
            title="Adjust Zoom Level"
            style={{ paddingTop: "4px", width: 100 }}
            className="alignment-zoom-slider"
            labelRenderer={false}
            stepSize={1}
            initialValue={1}
            max={14}
            min={1}
          />
          <UncontrolledSliderWithPlusMinusBtns
            onChange={val => {
              this.setState({
                rotationDegrees: val
              });
            }}
            onRelease={val => {
              this.setState({
                rotationDegrees: val
              });
            }}
            leftIcon="arrow-left"
            rightIcon="arrow-right"
            title="Adjust Zoom Level"
            style={{ paddingTop: "4px", width: 100 }}
            className="alignment-zoom-slider"
            labelRenderer={false}
            stepSize={3}
            initialValue={0}
            max={360}
            min={0}
          />
        </div>
      </div>
    );
  }
}

export default withEditorInteractions(CircularViewWithZoom);

function AxisNumbers({
  rotation,
  textHeightOffset = 11,
  annotation,
  isProtein,
  hideNumbers
}) {
  const shouldFlip = shouldFlipText(annotation.startAngle - rotation);
  return (
    <g>
      <rect width={1} height={5} fill="black"></rect>
      {!hideNumbers && (
        <text
          transform={
            (shouldFlip ? "rotate(180)" : "") +
            ` translate(0, ${
              shouldFlip ? -textHeightOffset : textHeightOffset
            })`
          }
          style={{
            textAnchor: "middle",
            dominantBaseline: "central",
            fontSize: "small"
          }}
        >
          {divideBy3(annotation.tickPosition + 1, isProtein) + ""}
        </text>
      )}
    </g>
  );
}
function Cutsites() {
  return <rect width={2} height={10} fill="black"></rect>;
}

function DrawName({
  isZoomed,
  sequenceName,
  isProtein,
  sequenceLength,
  innerRadius
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: isZoomed ? undefined : "100%",
        bottom: isZoomed ? 25 : undefined,

        pointerEvents: "none"
      }}
    >
      <div
        key="circViewSvgCenterText"
        className="veCircularViewMiddleOfVectorText"
        style={{ width: innerRadius, textAlign: "center" }}
      >
        <span>{sequenceName} </span>
        <br />
        <span style={{ fontSize: 10 }}>
          {isProtein
            ? `${Math.floor(sequenceLength / 3)} AAs`
            : `${sequenceLength} bps`}
        </span>
      </div>
    </div>
  );
}

function Warnings({ circular, paredDownMessages }) {
  return (
    <div className="veCircularViewWarningContainer">
      {!circular && (
        <VeWarning
          data-test="ve-warning-circular-to-linear"
          intent="warning"
          tooltip={
            "Warning! You're viewing a linear sequence in the Circular Map. Click on 'Linear Map' to view the linear sequence in a more intuitive way."
          }
        />
      )}
      {paredDownMessages}
    </div>
  );
}
