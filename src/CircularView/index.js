import VeWarning from "../helperComponents/VeWarning";
import getRangeLength from "ve-range-utils/getRangeLength";
// import PassThrough from "../utils/PassThrough";
import _Labels from "./Labels";
import _SelectionLayer from "./SelectionLayer";
import _Caret from "./Caret";
import _Axis from "./Axis";
import LineageLines from "./LineageLines";
import _Orfs from "./Orfs";
import _Features from "./Features";
import _Primers from "./Primers";
import DeletionLayers from "./DeletionLayers";
import ReplacementLayers from "./ReplacementLayers";
import _Cutsites from "./Cutsites";
import sortBy from "lodash/sortBy";
import PositionAnnotationOnCircle from "./PositionAnnotationOnCircle";
import getAngleForPositionMidpoint from "./getAngleForPositionMidpoint";
import normalizePositionByRangeLength from "ve-range-utils/normalizePositionByRangeLength";
import getPositionFromAngle from "ve-range-utils/getPositionFromAngle";
import React from "react";
import Draggable from "react-draggable";
import withEditorInteractions from "../withEditorInteractions";
import "./style.css";
import draggableClassnames from "../constants/draggableClassnames";
function noop() {}

let defaultSequenceData = {
  features: [],
  primers: [],
  orfs: [],
  sequence: "",
  cutsites: [],
  name: ""
};

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
    let nearestCaretPos = normalizePositionByRangeLength(
      getPositionFromAngle(angle, sequenceLength, true),
      sequenceLength
    ); //true because we're in between positions

    callback({
      className: event.target.className.animVal,
      shiftHeld: event.shiftKey,
      nearestCaretPos,
      selectionStartGrabbed: event.target.classList.contains(
        draggableClassnames.selectionStart
      ),
      selectionEndGrabbed: event.target.classList.contains(
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
      editorDragStopped = noop,
      featureClicked = noop,
      selectionLayerRightClicked = noop,
      primerClicked = noop,
      deletionLayerClicked = noop,
      replacementLayerClicked = noop,
      orfClicked = noop,
      cutsiteClicked = noop,
      featureOptions = {},
      additionalSelectionLayers = [],
      componentOverrides = {},
      maxAnnotationsToDisplay = {},
      lineageLines = [],
      deletionLayers = {},
      replacementLayers = {},
      instantiated
      // modifyLayers = function (layers) {
      //   return layers
      // },
    } = this.props;
    let {
      Labels = _Labels,
      SelectionLayer = _SelectionLayer,
      Caret = _Caret,
      Axis = _Axis,
      Features = _Features,
      Primers = _Primers,
      Orfs = _Orfs,
      Cutsites = _Cutsites
    } = componentOverrides;
    let sequenceDataToUse = {
      ...defaultSequenceData,
      ...sequenceData
    };
    let { sequence = "atgc" } = sequenceDataToUse;
    let sequenceLength = sequence.length;
    let sequenceName = hideName ? "" : sequenceDataToUse.name || "";
    circularAndLinearTickSpacing =
      circularAndLinearTickSpacing ||
      (sequenceLength < 10
        ? 1
        : sequenceLength < 50
          ? Math.ceil(sequenceLength / 5)
          : Math.ceil(sequenceLength / 100) * 10);
    let {
      features: showFeatures = true,
      primers: showPrimers = true,
      // translations: showTranslations = true,
      // parts: showParts = true,
      orfs: showOrfs = true,
      cutsites: showCutsites = true,
      // firstCut: showFirstCut = true,
      axis: showAxis = true,
      lineageLines: showLineageLines = true,
      axisNumbers: showAxisNumbers = false
      // sequence: showSequence = true,
      // reverseSequence: showReverseSequence = true,
    } = annotationVisibility;
    let { features: showFeatureLabels = true } = annotationLabelVisibility;
    let {
      features: maxFeaturesToDisplay = 50,
      primers: maxPrimersToDisplay = 50,
      // translations: maxTranslationsToDisplay = 50,
      // parts: maxPartsToDisplay = 50,
      orfs: maxOrfsToDisplay = 50,
      cutsites: maxCutsitesToDisplay = 100
    } = maxAnnotationsToDisplay;
    let paredDownOrfs;
    let paredDownCutsites;
    let paredDownFeatures;
    let paredDownPrimers;

    const baseRadius = 80;
    let innerRadius = baseRadius - annotationHeight / 2; //tnr: -annotationHeight/2 because features are drawn from the center
    let radius = baseRadius;
    let annotationsSvgs = [];
    let labels = {};

    //RENDERING CONCEPTS:
    //-"Circular" annotations get a radius, and a curvature based on their radius:
    //<CircularFeature>
    //-Then we rotate the annotations as necessary (and optionally flip them):
    //<PositionAnnotationOnCircle>

    let layersToDraw = [
      { layer: drawSequenceChars, zIndex: 10, layerName: "SequenceChars" },
      {
        layer: drawFeatures,
        zIndex: 20,
        layerName: "Features",
        spaceBefore: 10
      },
      { layer: drawPrimers, zIndex: 20, layerName: "Primers" },
      { layer: drawCaret, zIndex: 15, layerName: "Caret" },
      { layer: drawSelectionLayer, zIndex: 10, layerName: "SelectionLayer" },
      {
        layer: drawAxis,
        zIndex: 0,
        layerName: "Axis",
        spaceBefore: 0,
        spaceAfter: 0
      },
      {
        layer: drawReplacementLayers,
        zIndex: 20,
        layerName: "ReplacementLayers",
        spaceAfter: 20
      },
      {
        layer: drawDeletionLayers,
        zIndex: 20,
        layerName: "DeletionLayers",
        spaceAfter: 20
      },
      { layer: drawLineageLines, zIndex: 0, layerName: "LineageLines" },
      { layer: drawCutsites, zIndex: 10, layerName: "Cutsites" },
      { layer: drawOrfs, zIndex: 20, layerName: "Orfs", spaceBefore: 10 },
      { layer: drawLabels, zIndex: 30, layerName: "Labels" }
    ];

    let output = layersToDraw
      .map(function({
        layer,
        // layerName,
        spaceBefore = 0,
        spaceAfter = 0,
        zIndex
      }) {
        //   console.warn('-------------------------------------')
        //   console.warn('layerName:',JSON.stringify(layerName,null,4))
        //   console.warn('radius before draw:',JSON.stringify(radius,null,4))
        radius += spaceBefore;
        let result = layer();
        if (!result) {
          radius -= spaceBefore;
          return null;
        }
        radius += spaceAfter;
        // console.warn('radius after draw:',JSON.stringify(radius,null,4))
        return {
          result,
          // layer({
          //   radius,
          //   baseRadius,
          //   innerRadius,
          //   labels,
          //   annotationsSvgs,
          // }),
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

    function drawFeatures() {
      //DRAW FEATURES
      if (showFeatures) {
        let [annotationsToPass, paredDown] = pareDownAnnotations(
          sequenceDataToUse.features,
          maxFeaturesToDisplay
        );
        paredDownFeatures = paredDown;
        let results = Features({
          showFeatureLabels,
          radius,
          featureClicked,
          features: annotationsToPass,
          annotationHeight,
          spaceBetweenAnnotations,
          sequenceLength,
          editorName,
          ...featureOptions
        });
        if (!results) return null;
        //update the radius, labels, and svg
        radius += results.height;
        labels = { ...labels, ...results.labels };
        return results.component;
      }
    }

    function drawPrimers() {
      //DRAW FEATURES
      if (showPrimers) {
        let [annotationsToPass, paredDown] = pareDownAnnotations(
          sequenceDataToUse.primers,
          maxPrimersToDisplay
        );
        paredDownPrimers = paredDown;
        let results = Primers({
          radius,
          primerClicked,
          primers: annotationsToPass,
          annotationHeight,
          spaceBetweenAnnotations,
          sequenceLength,
          editorName
        });
        if (!results) return null;

        //update the radius, labels, and svg
        radius += results.height;
        labels = { ...labels, ...results.labels };
        return results.component;
      }
    }

    function drawDeletionLayers() {
      let results = DeletionLayers({
        radius,
        deletionLayerClicked,
        deletionLayers,
        annotationHeight,
        spaceBetweenAnnotations,
        sequenceLength,
        editorName
      });
      if (!results) return null;
      //update the radius, labels, and svg
      radius += results.height;
      labels = { ...labels, ...results.labels };
      return results.component;
    }

    function drawReplacementLayers() {
      let results = ReplacementLayers({
        radius,
        replacementLayerClicked,
        replacementLayers,
        annotationHeight,
        spaceBetweenAnnotations,
        sequenceLength,
        editorName
      });
      if (!results) return null;
      //update the radius, labels, and svg
      radius += results.height;
      labels = { ...labels, ...results.labels };
      return results.component;
    }

    function drawOrfs() {
      //DRAW FEATURES
      if (showOrfs) {
        let [annotationsToPass, paredDown] = pareDownAnnotations(
          sequenceDataToUse.orfs,
          maxOrfsToDisplay
        );
        paredDownOrfs = paredDown;
        let results = Orfs({
          radius,
          orfClicked,
          orfs: annotationsToPass,
          annotationHeight,
          spaceBetweenAnnotations,
          sequenceLength,
          editorName,
          ...featureOptions
        });
        if (!results) return null;

        //update the radius, labels, and svg
        radius += results.height;
        labels = { ...labels, ...results.labels };
        return results.component;
      }
    }

    function drawSequenceChars() {
      //DRAW CHARS (only if there are fewer than 85 of them)
      if (sequenceLength < 85) {
        radius += 25;
        sequenceDataToUse.sequence.split("").forEach(function(bp, index) {
          let tickAngle = getAngleForPositionMidpoint(index, sequenceLength);
          return (
            <PositionAnnotationOnCircle
              key={index}
              sAngle={tickAngle}
              eAngle={tickAngle}
              height={radius}
            >
              <text
                transform={`rotate(180)`}
                style={{
                  textAnchor: "middle",
                  dominantBaseline: "central",
                  fontSize: "small"
                }}
              >
                {bp}
              </text>
            </PositionAnnotationOnCircle>
          );
        });
      }
    }

    function drawAxis() {
      if (showAxis) {
        let axisResult = Axis({
          showAxisNumbers,
          radius,
          sequenceLength,
          circularAndLinearTickSpacing
        });
        //update the radius, and svg
        radius += axisResult.height;
        return axisResult.component;
      }
    }

    function drawLineageLines() {
      if (showLineageLines) {
        let results = LineageLines({
          radius,
          sequenceLength,
          annotationHeight: 6,
          editorName,
          lineageLines
          // lineageLines: [{start: 10, end:2000,},{start: 201, end:9,}],
        });
        if (!results) return null;
        //update the radius, and svg
        radius += results.height;
        return results.component;
      }
    }

    function drawCutsites() {
      //DRAW CUTSITES
      if (showCutsites) {
        let [annotationsToPass, paredDown] = pareDownAnnotations(
          sequenceDataToUse.cutsites,
          maxCutsitesToDisplay
        );
        paredDownCutsites = paredDown;
        let results = Cutsites({
          cutsites: annotationsToPass,
          radius,
          annotationHeight,
          sequenceLength,
          editorName,
          cutsiteClicked
        });
        if (!results) return null;
        //update the radius, labels, and svg
        radius += results.height;
        labels = { ...labels, ...results.labels };
        return results.component;
      }
    }

    function drawSelectionLayer() {
      //DRAW SELECTION LAYER
      let selectionLayers = [
        ...additionalSelectionLayers,
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
                  key: "veCircularViewSelectionLayer" + index,
                  selectionLayer,
                  selectionLayerRightClicked,
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
        sequenceLength > 0
      ) {
        //only render if there is no selection layer
        return (
          <Caret
            {...{
              caretPosition,
              sequenceLength,
              innerRadius,
              outerRadius: radius,
              key: "veCircularViewCaret"
            }}
          />
        );
      }
    }
    function drawLabels() {
      let results = Labels({
        editorName,
        circularViewWidthVsHeightRatio: width / height,
        labels,
        outerRadius: radius
      });
      if (!results) return null;
      radius += results.height;
      return results.component;
    }
    return (
      <div tabIndex="0" className={"veCircularView"}>
        <Draggable
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
            <div
              style={{
                position: "absolute",
                width,
                height,
                pointerEvents: "none"
              }}
            >
              <div
                key="circViewSvgCenterText"
                className={"veCircularViewMiddleOfVectorText"}
                style={{ width: innerRadius, textAlign: "center" }}
              >
                <span>{sequenceName} </span>
                <br />
                <span style={{ fontSize: 10 }}>
                  ({sequenceLength + " bps"})
                </span>
              </div>
            </div>
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
              style={{ overflow: "visible" }}
              width={width}
              height={height}
              ref="circularView"
              className={"circularViewSvg"}
              viewBox={`-${radius * scale} -${radius * scale} ${radius *
                2 *
                scale} ${radius * 2 * scale}`}
            >
              {annotationsSvgs}
            </svg>
            <div className={"veCircularViewWarningContainer1"}>
              {paredDownOrfs && (
                <VeWarning
                  message={`Warning: More than ${maxOrfsToDisplay} Open Reading Frames. Displaying only the largest ${maxOrfsToDisplay}`}
                />
              )}
              {paredDownCutsites && (
                <VeWarning
                  message={`Only the first ${maxCutsitesToDisplay} cut sites will be displayed. Filter the display by cut site by selecting your desired Restriction Enzyme type `}
                />
              )}
              {paredDownFeatures && (
                <VeWarning
                  message={`Warning: More than ${maxFeaturesToDisplay} Features. Displaying only the largest ${maxFeaturesToDisplay}`}
                />
              )}
              {paredDownPrimers && (
                <VeWarning
                  message={`Warning: More than ${maxPrimersToDisplay} Primers. Displaying only the largest ${maxPrimersToDisplay}`}
                />
              )}
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

// function (messages) {
//   messages.forEach(function ([displayMessage, message]) {
//     displayMessage &&
//   })
// }

export default withEditorInteractions(CircularView);
