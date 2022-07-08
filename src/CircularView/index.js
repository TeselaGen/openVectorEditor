import { ZoomCircularViewSlider } from "./ZoomCircularViewSlider";
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
  getPositionFromAngle,
  getRangeLength,
  getOverlapsOfPotentiallyCircularRanges
} from "ve-range-utils";
import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import withEditorInteractions from "../withEditorInteractions";
import drawAnnotations from "./drawAnnotations";
import "./style.css";
import draggableClassnames from "../constants/draggableClassnames";
import { getOrfColor } from "../constants/orfFrameToColorMap";
import { getSingular } from "../utils/annotationTypes";
import { upperFirst, map, flatMap } from "lodash";

import useAnnotationLimits from "../utils/useAnnotationLimits";
import {
  getClientX,
  getClientY,
  getParedDownWarning,
  pareDownAnnotations
} from "../utils/editorUtils";
import { getAllSelectionLayers } from "../utils/selectionLayer";
import classNames from "classnames";
import calculateTickMarkPositionsForGivenRange from "../utils/calculateTickMarkPositionsForGivenRange";
import { RotateCircularView } from "./RotateCircularView";
import { AxisNumbers } from "./AxisNumbers";
import { positionCutsites } from "./positionCutsites";
import { usePinch } from "@use-gesture/react";
import { CircularZoomMinimap } from "./CircularZoomMinimap";

function noop() {}
const BASE_RADIUS = 70;

export function CircularView(props) {
  const [limits] = useAnnotationLimits();
  const [rotationRadians, setRotationRadians] = useState(0);
  const [_zoomLevel, setZoomLevel] = useState(2);
  let zoomLevel = _zoomLevel;
  let smallZoom = 1;
  if (_zoomLevel < 1) {
    smallZoom = _zoomLevel;
    zoomLevel = 1;
  }
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

  let annotationsSvgs = [];
  let labels = {};

  const { isProtein } = sequenceData;
  const maxZoomLevel = Math.max(5, Math.floor(sequenceLength / 100));

  const percentOfCircle = 1 / zoomLevel;
  const svgWidth = Math.max(Number(width) || 300);
  const svgHeight = Math.max(Number(height) || 300);
  const isZoomed = zoomLevel !== 1;
  const angle = Math.PI * percentOfCircle;
  let radius = !isZoomed
    ? BASE_RADIUS
    : Math.max(BASE_RADIUS, svgWidth / Math.sin(angle / 2) / 2);
  const innerRadius = radius - 10;
  // const innerRadius = radius - 20
  // !isZoomed
  //   ? BASE_RADIUS
  //   : Math.max(BASE_RADIUS - 20, svgWidth / Math.sin(angle / 2) / 2);
  const initialRadius = radius;

  const rotation = 2 * Math.PI - rotationRadians; //get radians
  const rangeToShowStart = getPositionFromAngle(
    rotation - angle / 2,
    sequenceLength
  );
  const rangeToShowEnd = getPositionFromAngle(
    rotation + angle / 2,
    sequenceLength
  );
  const rangeToShow = !isZoomed
    ? { start: 0, end: Math.max(sequenceLength - 1, 0) }
    : {
        start: normalizePositionByRangeLength(rangeToShowStart, sequenceLength),
        end: normalizePositionByRangeLength(rangeToShowEnd, sequenceLength)
      };

  const rangeToShowLength = getRangeLength(rangeToShow, sequenceLength);
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
      layerName: "axisNumbers",
      annotationType: "axisNumbers",
      Annotation: AxisNumbers,
      isAnnotation: true,
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
      }).map((pos) => {
        return {
          name: "Tick Mark",
          tickPosition: pos,
          start: pos,
          end: pos
        };
      }),
      annotationProps: {
        hideNumbers: !annotationVisibility.axisNumbers
      },

      passAnnotation: true,
      allOnSameLevel: true,
      addHeight: true,
      onlyShow: true,
      alwaysShow: true,
      showLabels: false,
      spaceBefore: 0,
      spaceAfter: 0,
      show: annotationVisibility.axis
    },
    {
      zIndex: 0,
      layerName: "axis",
      Annotation: Axis,
      showAxisNumbers: false,
      // showAxisNumbers: !(annotationVisibility.axisNumbers === false),
      circularAndLinearTickSpacing,
      spaceBefore: 10,
      spaceAfter: 5
    },
    {
      zIndex: 15,
      alwaysShow: true,
      layerName: "caret",
      Annotation: drawCaret,
      drawProps: ({ radius }) => ({
        radius: initialRadius - annotationHeight / 2,
        annotationHeight: radius - initialRadius
      })
    },

    {
      zIndex: 10,
      alwaysShow: true,
      layerName: "selectionLayer",
      Annotation: drawSelectionLayer,
      drawProps: ({ radius }) => ({
        radius:
          initialRadius + (radius - initialRadius) / 2 - annotationHeight / 2,
        annotationHeight: radius - initialRadius
      })
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
      Annotation: Cutsite,
      useStartAngle: true,
      allOnSameLevel: true,
      positionBy: positionCutsites,
      isAnnotation: true
    },

    {
      zIndex: 20,
      Annotation: Orf,
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
      Annotation: Primer,
      isAnnotation: true,
      layerName: "primers"
    },
    {
      zIndex: 20,
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
      Annotation: Labels,
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
    .map((layer) => {
      const {
        layerName,
        maxToDisplay,
        Comp,
        Annotation,
        fontStyle,
        alwaysShow,
        isAnnotation,
        spaceBefore = 0,
        spaceAfter = 0,
        zIndex,
        onlyShow,
        passLabels,
        drawProps,
        ...rest
      } = layer;
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
        innerRadius: BASE_RADIUS,
        outerRadius: radius,
        noRedux,
        isProtein,

        onClick: props[singularName + "Clicked"],
        onDoubleClick: props[singularName + "DoubleClicked"],
        onRightClicked: props[singularName + "RightClicked"],
        sequenceLength,
        editorName,
        ...(drawProps && drawProps({ radius })),
        ...rest
      };
      if (isAnnotation) {
        //we're drawing features/cutsites/primers/orfs/etc (something that lives on the seqData)
        if (!map(sequenceData[layerName]).length && !onlyShow) {
          radius -= spaceBefore;
          return null;
        }

        const trimmedAnnotations = flatMap(
          layer.annotations ||
            sequenceData["filtered" + nameUpper] ||
            sequenceData[layerName] ||
            [],
          (range) => {
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

        const maxToShow =
          (maxAnnotationsToDisplay
            ? maxAnnotationsToDisplay[layerName]
            : limits[layerName]) || 50;
        const [trimmedAndParedAnns, paredDown] = maxToShow
          ? pareDownAnnotations(trimmedAnnotations, maxToShow)
          : [trimmedAnnotations];
        // const [annotations, paredDown] = isAnnotation
        //   ? pareDownAnnotations(
        //       layer.annotations ||
        //         sequenceData["filtered" + nameUpper] ||
        //         sequenceData[layerName] ||
        //         {},
        //       maxToShow
        //     )
        //   : [];

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
          rotationRadians,
          Annotation: Annotation || Comp || Feature,
          fontStyle: fontStyle,
          hoveredId: hoveredId,
          annotationType: singularName,
          type: singularName,
          reverseAnnotations: true,
          showLabels: !(annotationLabelVisibility[layerName] === false),
          annotations: trimmedAndParedAnns,
          annotationHeight,
          spaceBetweenAnnotations,
          ...sharedProps,
          ...props[singularName + "Options"]
        });
      } else {
        //we're drawing axis/selectionLayer/caret/etc (something that doesn't live on the seqData)
        results = Annotation({
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
                baseRadius: BASE_RADIUS,
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
  const target = React.useRef();

  usePinch(
    ({ delta: [d], event }) => {
      event.stopPropagation();
      window.document
        .querySelector(`.bp3-icon-${d > 0 ? "plus" : "minus"}`)
        .click();
    },
    {
      target
    }
  );
  return (
    <div
      style={{
        width: widthToUse,
        height: heightToUse
      }}
      onWheel={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.document
          .querySelector(`.bp3-icon-arrow-${e.deltaY < 0 ? "left" : "right"}`)
          .click();
      }}
      className={classNames("veCircularView", props.className)}
    >
      {!hideName && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: isZoomed || smallZoom < 1 ? "end" : "center",
            paddingLeft: isZoomed || smallZoom < 1 ? 20 : 0,
            paddingRight: isZoomed || smallZoom < 1 ? 20 : 0,
            textAlign: "center",

            zIndex: 1
          }}
        >
          <div style={{ marginBottom: isZoomed || smallZoom < 1 ? 80 : 0 }}>
            <div
              title={sequenceName}
              className="veCircularViewTextWrapper"
              style={{
                textAlign: "center",
                display: "-webkit-box",
                WebkitLineClamp: "3",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: isZoomed || smallZoom < 1 ? undefined : innerRadius,
                maxHeight: innerRadius - 15,
                fontSize: nameFontSizeCircularView
              }}
            >
              {sequenceName}
            </div>
            <span title={bpTitle} style={{ fontSize: 10 }}>
              {bpTitle}
            </span>
          </div>
        </div>
      )}

      {withRotateCircularView && (
        <RotateCircularView
          editorName={editorName}
          zoomLevel={zoomLevel}
          maxZoomLevel={maxZoomLevel}
          setRotationRadians={setRotationRadians}
        ></RotateCircularView>
      )}
      <ZoomCircularViewSlider
        // zoomLevel={zoomLevel}
        maxZoomLevel={maxZoomLevel}
        setZoomLevel={setZoomLevel}
      />
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
        <div ref={target}>
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
            style={{
              overflow: "visible",
              display: "block"
              // marginTop: zoomLevel !== 1 ? -200 : 0
            }}
            ref={circRef}
            className="circularViewSvg"
            viewBox={`${-svgWidth / 2 / smallZoom},${
              -svgHeight / 2 / smallZoom -
              (!isZoomed ? 0 : initialRadius + BASE_RADIUS * 2 - 100)
            },${svgWidth / smallZoom},${svgHeight / smallZoom}`}
            width={svgWidth}
            // width={svgHeight}
            height={svgHeight}
            // height={svgWidth}
          >
            <g>
              {annotationsSvgs}
              {/* !hideName && (
                <foreignObject
                  // x={-innerRadius / 2}
                  // y={!isZoomed ? -innerRadius / 2 : -radius}
                  width={innerRadius}
                  height={innerRadius}
                  transform={`rotate(${(-rotationRadians * 180) / Math.PI})`}
                >
                  <div
                    xmlns="http://www.w3.org/1999/xhtml"
                    key="circViewSvgCenterText"
                    className="veCircularViewMiddleOfVectorText"
                    style={{
                      height: isZoomed ? undefined : "100%",
                      bottom: isZoomed ? 25 : undefined
                    }}
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
                        width: innerRadius,
                        maxHeight: innerRadius - 15,
                        fontSize: nameFontSizeCircularView
                      }}
                    >
                      {sequenceName}
                    </div>
                    <span title={bpTitle} style={{ fontSize: 10 }}>
                      {bpTitle}
                    </span>
                  </div>
                </foreignObject>
              ) */}
            </g>
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
          {isZoomed && (
            <CircularZoomMinimap
              rotationRadians={rotationRadians}
              percentOfCircle={percentOfCircle}
            ></CircularZoomMinimap>
          )}
        </div>
      </Draggable>
    </div>
  );
}

export default withEditorInteractions(CircularView);
