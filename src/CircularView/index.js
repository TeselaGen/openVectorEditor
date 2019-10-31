import VeWarning from "../helperComponents/VeWarning";
// import PassThrough from "../utils/PassThrough";
import Labels from "./Labels";
import SelectionLayer from "./SelectionLayer";
import Caret from "./Caret";
import Axis from "./Axis";
import Orf from "./Orf";
import Feature from "./Feature";
import Primer from "./Primer";
// import DeletionLayer from "./DeletionLayer";
// import ReplacementLayer from "./ReplacementLayer";
import Cutsite from "./Cutsite";
import sortBy from "lodash/sortBy";
// import PositionAnnotationOnCircle from "./PositionAnnotationOnCircle";
// import getAngleForPositionMidpoint from "./getAngleForPositionMidpoint";
import {
  normalizePositionByRangeLength,
  getPositionFromAngle,
  getRangeLength
} from "ve-range-utils";
import React from "react";
import Draggable from "react-draggable";
import withEditorInteractions from "../withEditorInteractions";
import Part from "./Part";
import drawAnnotations from "./drawAnnotations";
import "./style.css";
import draggableClassnames from "../constants/draggableClassnames";
import { getOrfColor } from "../constants/orfFrameToColorMap";
import { getSingular } from "../utils/annotationTypes";
import { upperFirst, map } from "lodash";

function noop() {}

// function toDegrees(radians) {
//     return radians / 2 / Math.PI * 360
// }

export class CircularView extends React.Component {
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

  render() {
    let {
      //set defaults for all of these vars
      width = 400,
      height = 400,
      scale = 1,
      sequenceData = {},
      hideName = false,
      editorName,
      selectionLayer = { start: -1, end: -1 },
      annotationHeight = 15,
      spaceBetweenAnnotations = 2,
      annotationVisibility = {},
      annotationLabelVisibility = {},
      caretPosition = -1,
      circularAndLinearTickSpacing,
      editorDragged = noop,
      editorDragStarted = noop,
      editorClicked = noop,
      backgroundRightClicked = noop,
      searchLayers = [],
      editorDragStopped = noop,
      additionalSelectionLayers = [],
      maxAnnotationsToDisplay = {},
      searchLayerRightClicked = noop,
      selectionLayerRightClicked = noop,
      searchLayerClicked = noop,
      instantiated
    } = this.props;
    let { sequence = "atgc", circular } = sequenceData;
    let sequenceLength = sequence.length;
    let sequenceName = hideName ? "" : sequenceData.name || "";
    circularAndLinearTickSpacing =
      circularAndLinearTickSpacing ||
      (sequenceLength < 10
        ? 1
        : sequenceLength < 50
        ? Math.ceil(sequenceLength / 5)
        : Math.ceil(sequenceLength / 100) * 10);

    const baseRadius = 80;
    let innerRadius = baseRadius - annotationHeight / 2; //tnr: -annotationHeight/2 because features are drawn from the center
    let radius = baseRadius;
    let annotationsSvgs = [];
    let labels = {};

    const { isProtein } = sequenceData;
    //RENDERING CONCEPTS:
    //-"Circular" annotations get a radius, and a curvature based on their radius:
    //<CircularFeature>
    //-Then we rotate the annotations as necessary (and optionally flip them):
    //<PositionAnnotationOnCircle>

    let layersToDraw = [
      { zIndex: 10, layerName: "sequenceChars" },
      {
        zIndex: 20,
        layerName: "features",
        isAnnotation: true,
        // spaceBefore: 10,
        spaceAfter: 5
      },
      {
        zIndex: 0,
        layerName: "axis",
        Comp: Axis,
        showAxisNumbers: !(annotationVisibility.axisNumbers === false),
        circularAndLinearTickSpacing,
        spaceBefore: 0,
        spaceAfter: 0
      },

      { zIndex: 15, alwaysShow: true, layerName: "caret", Comp: drawCaret },

      {
        zIndex: 10,
        alwaysShow: true,
        layerName: "selectionLayer",
        Comp: drawSelectionLayer
      },
      {
        zIndex: 20,
        layerName: "replacementLayers",
        isAnnotation: true,
        spaceAfter: 20
      },
      {
        zIndex: 20,
        layerName: "deletionLayers",
        isAnnotation: true,
        spaceAfter: 20
      },
      {
        zIndex: 10,
        layerName: "cutsites",
        Comp: Cutsite,
        useStartAngle: true,
        allOnSameLevel: true,
        positionBy: positionCutsites,
        isAnnotation: true,
        maxToDisplay: 100
      },

      {
        zIndex: 20,
        Comp: Orf,
        showLabels: false,
        getColor: getOrfColor,
        layerName: "orfs",
        isAnnotation: true,
        spaceBefore: 10
      },
      {
        spaceBefore: 5,
        spaceAfter: 5,
        zIndex: 20,
        Comp: Primer,
        isAnnotation: true,
        layerName: "primers"
      },
      {
        zIndex: 20,
        Comp: Part,
        layerName: "parts",
        isAnnotation: true,
        spaceBefore: 5
      },
      {
        zIndex: 20,
        layerName: "lineageAnnotations",
        isAnnotation: true,
        spaceBefore: 10,
        spaceAfter: 5
      },
      {
        zIndex: 20,
        layerName: "assemblyPieces",
        isAnnotation: true,
        spaceBefore: 10,
        spaceAfter: 5
      },
      {
        zIndex: 20,
        arrowheadLength: 0,
        layerName: "warnings",
        isAnnotation: true,
        spaceBefore: 10,
        spaceAfter: 5
      },
      {
        zIndex: 30,
        alwaysShow: true,
        layerName: "labels",
        Comp: Labels,
        circularViewWidthVsHeightRatio: width / height,
        passLabels: true,
        textScalingFactor: 700 / Math.min(width, height)
      }
    ];
    const paredDownMessages = [];

    let output = layersToDraw
      .map(opts => {
        const {
          layerName,
          maxToDisplay,
          Comp,
          alwaysShow,
          isAnnotation,
          spaceBefore = 0,
          spaceAfter = 0,
          zIndex,
          passLabels,
          ...rest
        } = opts;
        if (!(alwaysShow || annotationVisibility[layerName])) {
          return null;
        }
        //DRAW FEATURES
        let comp;
        let results;

        const singularName = getSingular(layerName);
        const nameUpper = upperFirst(layerName);
        radius += spaceBefore;
        const sharedProps = {
          radius,
          isProtein,
          onClick: this.props[singularName + "Clicked"],
          onRightClicked: this.props[singularName + "RightClicked"],
          sequenceLength,
          editorName,
          ...rest
        };
        if (isAnnotation) {
          //we're drawing features/cutsites/primers/orfs/etc (something that lives on the seqData)
          if (!map(sequenceData[layerName]).length) {
            radius -= spaceBefore;
            return null;
          }

          const maxToShow =
            maxAnnotationsToDisplay[layerName] || maxToDisplay || 50;
          let [annotations, paredDown] = isAnnotation
            ? pareDownAnnotations(
                sequenceData["filtered" + nameUpper] || sequenceData[layerName],
                maxToShow
              )
            : [];

          if (paredDown) {
            paredDownMessages.push(
              <VeWarning
                data-test={`ve-warning-max${nameUpper}ToDisplay`}
                tooltip={`Warning: More than ${maxToShow} ${nameUpper}. Only displaying ${maxToShow}`}
              />
            );
          }
          results = drawAnnotations({
            Annotation: Comp || Feature,
            annotationType: singularName,
            reverseAnnotations: true,
            showLabels: !(annotationLabelVisibility[layerName] === false),
            annotations,
            annotationHeight,
            spaceBetweenAnnotations,
            ...sharedProps,
            ...this.props[singularName + "Options"]
          });
        } else {
          //we're drawing axis/selectionLayer/caret/etc (something that doesn't live on the seqData)
          results = Comp({
            ...(passLabels && { labels }),
            ...sharedProps
          });
        }
        if (results) {
          // //update the radius, labels, and svg
          radius += results.height || 0;
          labels = { ...labels, ...(results.labels || {}) };
          comp = results.component || results;
        }
        radius += spaceAfter;
        // console.warn('radius after draw:',JSON.stringify(radius,null,4))
        return {
          result: comp,
          zIndex
        };
      })
      .filter(function(i) {
        return !!i;
      });

    annotationsSvgs = sortBy(output, "zIndex").reduce(function(
      arr,
      { result }
    ) {
      return arr.concat(result);
    },
    []);

    //debug hash marks
    // annotationsSvgs = annotationsSvgs.concat([0,50,100,150,190].map(function (pos) {
    //     return <text key={pos} transform={`translate(0,${-pos})`}>{pos}</text>
    // }))

    function drawSelectionLayer() {
      //DRAW SELECTION LAYER
      let selectionLayers = [
        ...additionalSelectionLayers,
        ...searchLayers,
        ...(Array.isArray(selectionLayer) ? selectionLayer : [selectionLayer])
      ];
      return selectionLayers
        .map(function(selectionLayer, index) {
          if (
            selectionLayer.start >= 0 &&
            selectionLayer.end >= 0 &&
            sequenceLength > 0
          ) {
            return (
              <SelectionLayer
                {...{
                  index,
                  isDraggable: true,
                  isProtein,
                  key: "veCircularViewSelectionLayer" + index,
                  selectionLayer,
                  onRightClicked: selectionLayer.isSearchLayer
                    ? searchLayerRightClicked
                    : selectionLayerRightClicked,
                  onClick: selectionLayer.isSearchLayer
                    ? searchLayerClicked
                    : undefined,
                  sequenceLength,
                  baseRadius,
                  radius,
                  innerRadius
                }}
              />
            );
          } else {
            return null;
          }
        })
        .filter(el => {
          return !!el;
        });
    }

    function drawCaret() {
      //DRAW CARET
      if (
        caretPosition !== -1 &&
        selectionLayer.start < 0 &&
        sequenceLength >= 0
      ) {
        //only render if there is no selection layer
        return (
          <Caret
            {...{
              caretPosition,
              sequenceLength,
              isProtein,
              innerRadius,
              outerRadius: radius,
              key: "veCircularViewCaret"
            }}
          />
        );
      }
    }

    //tnr: Make the radius have a minimum so the empty yellow axis circle doesn't take up the entire screen
    if (radius < 150) radius = 150;
    const widthToUse = Math.max(Number(width) || 300);
    const heightToUse = Math.max(Number(height) || 300);
    return (
      <div
        style={{
          width: widthToUse,
          height: heightToUse
        }}
        // tabIndex="0"
        className="veCircularView"
      >
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
          <div>
            {!hideName && (
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
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
            )}
            <svg
              key="circViewSvg"
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
              style={{ overflow: "visible", display: "block" }}
              width={widthToUse}
              height={heightToUse}
              ref="circularView"
              className="circularViewSvg"
              viewBox={`-${radius * scale} -${radius * scale} ${radius *
                2 *
                scale} ${radius * 2 * scale}`}
            >
              {annotationsSvgs}
            </svg>
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
          </div>
        </Draggable>
      </div>
    );
  }
}

function pareDownAnnotations(annotations, max) {
  let annotationsToPass = annotations;
  let paredDown = false;
  if (Object.keys(annotations).length > max) {
    paredDown = true;
    let sortedAnnotations = sortBy(annotations, function(annotation) {
      return -getRangeLength(annotation);
    });
    annotationsToPass = sortedAnnotations
      .slice(0, max)
      .reduce(function(obj, item) {
        obj[item.id] = item;
        return obj;
      }, {});
  }
  return [annotationsToPass, paredDown];
}

export default withEditorInteractions(CircularView);

function positionCutsites(annotation) {
  return {
    start: annotation.topSnipPosition,
    end: annotation.topSnipPosition
  };
}

// function drawSequenceChars() {
//   //DRAW CHARS (only if there are fewer than 85 of them)
//   if (
//     sequenceLength < 85 &&
//     sequenceData.sequence &&
//     !sequenceData.noSequence
//   ) {
//     radius += 25;
//     sequenceData.sequence.split("").forEach(function(bp, index) {
//       let tickAngle = getAngleForPositionMidpoint(index, sequenceLength);
//       return (
//         <text
//           {...PositionAnnotationOnCircle({
//             sAngle: tickAngle,
//             eAngle: tickAngle,
//             height: radius
//           })}
//           key={index}
//           transform="rotate(180)"
//           style={{
//             textAnchor: "middle",
//             dominantBaseline: "central",
//             fontSize: "small"
//           }}
//         >
//           {bp}
//         </text>
//       );
//     });
//   }
// }
