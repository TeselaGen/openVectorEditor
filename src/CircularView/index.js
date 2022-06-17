import VeWarning from "../helperComponents/VeWarning";
import Labels from "./Labels";
import SelectionLayer from "./SelectionLayer";
import Caret from "./Caret";
import Axis from "./Axis";
import Orf from "./Orf";
import Feature from "./Feature";
import Primer from "./Primer";
import Cutsite from "./Cutsite";
import sortBy from "lodash/sortBy";
import {
  normalizePositionByRangeLength,
  getPositionFromAngle
} from "ve-range-utils";
import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import withEditorInteractions from "../withEditorInteractions";
import Part from "./Part";
import drawAnnotations from "./drawAnnotations";
import "./style.css";
import draggableClassnames from "../constants/draggableClassnames";
import { getOrfColor } from "../constants/orfFrameToColorMap";
import { getSingular } from "../utils/annotationTypes";
import { upperFirst, map } from "lodash";

import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";
import useAnnotationLimits from "../utils/useAnnotationLimits";
import {
  getClientX,
  getClientY,
  getParedDownWarning,
  pareDownAnnotations
} from "../utils/editorUtils";
import { getAllSelectionLayers } from "../utils/selectionLayer";
import classNames from "classnames";

function noop() {}

// function toDegrees(radians) {
//     return radians / 2 / Math.PI * 360
// }

export function CircularView(props) {
  const [limits] = useAnnotationLimits();
  const [rotationRadians, setRotationRadians] = useState(0);
  const circRef = useRef();
  function getNearestCursorPositionToMouseEvent(
    event,
    sequenceLength,
    callback
  ) {
    const clientX = getClientX(event);
    const clientY = getClientY(event);
    if (!clientX) {
      return;
    }
    const boundingRect = circRef.current.getBoundingClientRect();
    //get relative click positions
    const clickX = clientX - boundingRect.left - boundingRect.width / 2;
    const clickY = clientY - boundingRect.top - boundingRect.height / 2;

    //get angle
    let angle = Math.atan2(clickY, clickX) + Math.PI / 2 - rotationRadians;
    if (angle < 0) angle += Math.PI * 2; //normalize the angle if necessary
    let nearestCaretPos =
      sequenceLength === 0
        ? 0
        : normalizePositionByRangeLength(
            getPositionFromAngle(angle, sequenceLength, true),
            sequenceLength
          ); //true because we're in between positions
    if (props.sequenceData && props.sequenceData.isProtein) {
      nearestCaretPos = Math.round(nearestCaretPos / 3) * 3;
    }
    callback({
      event,
      doNotWrapOrigin: !(props.sequenceData && props.sequenceData.circular),
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
  let {
    //set defaults for all of these vars
    width = 400,
    height = 400,
    scale = 1,
    noRedux,
    sequenceData = {},
    hideName = false,
    editorName,
    withRotateCircularView,
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
    maxAnnotationsToDisplay,
    searchLayerRightClicked = noop,
    selectionLayerRightClicked = noop,
    searchLayerClicked = noop,
    instantiated,
    noWarnings,
    labelLineIntensity,
    fontHeightMultiplier,
    hoveredId,
    labelSize,
    nameFontSizeCircularView = 14
  } = props;

  const { sequence = "atgc", circular } = sequenceData;
  const sequenceLength = sequence.length;
  const sequenceName = hideName ? "" : sequenceData.name || "";
  circularAndLinearTickSpacing =
    circularAndLinearTickSpacing ||
    (sequenceLength < 10
      ? 1
      : sequenceLength < 50
      ? Math.ceil(sequenceLength / 5)
      : Math.ceil(sequenceLength / 100) * 10);

  const baseRadius = 80;
  const innerRadius = baseRadius - annotationHeight / 2; //tnr: -annotationHeight/2 because features are drawn from the center
  let radius = baseRadius;
  let annotationsSvgs = [];
  let labels = {};

  const { isProtein } = sequenceData;
  //RENDERING CONCEPTS:
  //-"Circular" annotations get a radius, and a curvature based on their radius:
  //<CircularFeature>
  //-Then we rotate the annotations as necessary (and optionally flip them):
  //<PositionAnnotationOnCircle>

  const layersToDraw = [
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
      fontStyle: "italic",
      Comp: Cutsite,
      useStartAngle: true,
      allOnSameLevel: true,
      positionBy: positionCutsites,
      isAnnotation: true
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
      spaceBefore: 10,
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
      spaceBefore: 15
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
      labelLineIntensity: labelLineIntensity,
      labelSize: labelSize,
      fontHeightMultiplier: fontHeightMultiplier,
      textScalingFactor: 700 / Math.min(width, height)
    }
  ];
  const paredDownMessages = [];

  const output = layersToDraw
    .map((opts) => {
      const {
        layerName,
        maxToDisplay,
        Comp,
        fontStyle,
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
        noRedux,
        isProtein,
        onClick: props[singularName + "Clicked"],
        onDoubleClick: props[singularName + "DoubleClicked"],
        onRightClicked: props[singularName + "RightClicked"],
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
          (maxAnnotationsToDisplay
            ? maxAnnotationsToDisplay[layerName]
            : limits[layerName]) || 50;
        const [annotations, paredDown] = isAnnotation
          ? pareDownAnnotations(
              sequenceData["filtered" + nameUpper] ||
                sequenceData[layerName] ||
                {},
              maxToShow
            )
          : [];

        if (paredDown) {
          paredDownMessages.push(
            getParedDownWarning({
              nameUpper,
              maxToShow,
              isAdjustable: !maxAnnotationsToDisplay
            })
          );
        }
        results = drawAnnotations({
          Annotation: Comp || Feature,
          fontStyle: fontStyle,
          hoveredId: hoveredId,
          annotationType: singularName,
          type: singularName,
          reverseAnnotations: true,
          showLabels: !(annotationLabelVisibility[layerName] === false),
          annotations,
          annotationHeight,
          spaceBetweenAnnotations,
          ...sharedProps,
          ...props[singularName + "Options"]
        });
      } else {
        //we're drawing axis/selectionLayer/caret/etc (something that doesn't live on the seqData)
        results = Comp({
          rotationRadians: rotationRadians,
          ...(passLabels && { labels }),
          ...sharedProps
        });
      }
      if (results) {
        // //update the radius, labels, and svg
        radius += results.height || 0;
        //tnr: we had been storing labels as a keyed-by-id object but that caused parts and features with the same id to override eachother
        labels = [...map(labels), ...map(results.labels || {})];
        comp = results.component || results;
      }
      radius += spaceAfter;
      // console.warn('radius after draw:',JSON.stringify(radius,null,4))
      return {
        result: comp,
        zIndex
      };
    })
    .filter(function (i) {
      return !!i;
    });

  annotationsSvgs = sortBy(output, "zIndex").reduce(function (arr, { result }) {
    return arr.concat(result);
  }, []);

  //debug hash marks
  // annotationsSvgs = annotationsSvgs.concat([0,50,100,150,190].map(function (pos) {
  //     return <text key={pos} transform={`translate(0,${-pos})`}>{pos}</text>
  // }))

  function drawSelectionLayer() {
    //DRAW SELECTION LAYER
    return getAllSelectionLayers({
      additionalSelectionLayers,
      searchLayers,
      selectionLayer
    })
      .map(function (selectionLayer, index) {
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
      .filter((el) => {
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
  const bpTitle = isProtein
    ? `${Math.floor(sequenceLength / 3)} AAs`
    : `${sequenceLength} bps`;
  return (
    <div
      style={{
        width: widthToUse,
        height: heightToUse
      }}
      // tabIndex="0"
      className={classNames("veCircularView", props.className)}
    >
      {withRotateCircularView && (
        <RotateCircularView
          editorName={editorName}
          setRotationRadians={setRotationRadians}
        ></RotateCircularView>
      )}
      <Draggable
        // enableUserSelectHack={false} //needed to prevent the input bubble from losing focus post user drag
        bounds={{ top: 0, left: 0, right: 0, bottom: 0 }}
        onDrag={(event) => {
          getNearestCursorPositionToMouseEvent(
            event,
            sequenceLength,
            editorDragged
          );
        }}
        onStart={(event) => {
          getNearestCursorPositionToMouseEvent(
            event,
            sequenceLength,
            editorDragStarted
          );
        }}
        onStop={editorDragStopped}
      >
        <div>
          <svg
            key="circViewSvg"
            onClick={(event) => {
              instantiated &&
                getNearestCursorPositionToMouseEvent(
                  event,
                  sequenceLength,
                  editorClicked
                );
            }}
            onContextMenu={(e) => {
              getNearestCursorPositionToMouseEvent(
                e,
                sequenceLength,
                backgroundRightClicked
              );
            }}
            style={{ overflow: "visible", display: "block" }}
            width={widthToUse}
            height={heightToUse}
            ref={circRef}
            className="circularViewSvg"
            viewBox={`-${radius * scale} -${radius * scale} ${
              radius * 2 * scale
            } ${radius * 2 * scale}`}
          >
            {annotationsSvgs}
            {!hideName && (
              <foreignObject
                x={(-innerRadius * scale) / 2}
                y={(-innerRadius * scale) / 2}
                width={innerRadius * scale}
                height={innerRadius * scale}
                transform={`rotate(-${(rotationRadians * 180) / Math.PI})`}
              >
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  key="circViewSvgCenterText"
                  className="veCircularViewMiddleOfVectorText"
                >
                  <div
                    title={sequenceName}
                    className="veCircularViewTextWrapper"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: "3",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: innerRadius * scale,
                      maxHeight: innerRadius * scale - 15,
                      fontSize: nameFontSizeCircularView
                    }}
                  >
                    {sequenceName}
                    {/* <span>{}</span> */}
                  </div>
                  <span title={bpTitle} style={{ fontSize: 10 }}>
                    {bpTitle}
                  </span>
                </div>
              </foreignObject>
            )}
          </svg>
          <div className="veWarningContainer">
            {!circular && !noWarnings && (
              <VeWarning
                data-test="ve-warning-circular-to-linear"
                intent="warning"
                tooltip={
                  "Warning! You're viewing a linear sequence in the Circular Map. Click on 'Linear Map' to view the linear sequence in a more intuitive way."
                }
              />
            )}
            {!noWarnings && paredDownMessages}
          </div>
        </div>
      </Draggable>
    </div>
  );
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

function RotateCircularView({ setRotationRadians, editorName }) {
  return (
    <div style={{ zIndex: 900, position: "absolute" }}>
      <UncontrolledSliderWithPlusMinusBtns
        onChange={(val) => {
          const el = document.querySelector(
            `.veEditor.${editorName} .circularViewSvg`
          );
          el.style.transform = `rotate(${val}deg)`;
          el.classList.add("veHideLabels");
        }}
        onRelease={(val) => {
          setRotationRadians((val * Math.PI) / 180);
          const el = document.querySelector(
            `.veEditor.${editorName} .circularViewSvg`
          );
          el.classList.remove("veHideLabels");
        }}
        leftIcon="arrow-left"
        rightIcon="arrow-right"
        title="Rotate"
        style={{ paddingTop: "4px", width: 120 }}
        className="ove-slider"
        labelRenderer={false}
        stepSize={3}
        initialValue={0}
        max={360}
        min={0}
      ></UncontrolledSliderWithPlusMinusBtns>
    </div>
  );
}
