import React from "react";
import Axis from "../CircularView/Axis";
import SimpleCircularOrLinearView from "../SimpleCircularOrLinearView";
import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";
import { range } from "rxjs";
import {
  getPositionFromAngle,
  modulatePositionByRange,
  normalizePositionByRangeLength,
  trimRangeByAnotherRange,
  getRangeAngles,
  adjustRangeToRotation,
  adjustRangeToDeletionOfAnotherRange,
  invertRange
} from "ve-range-utils/lib";
import getAngleForPositionMidpoint from "../CircularView/getAngleForPositionMidpoint";
import drawAnnotations from "../CircularView/drawAnnotations";

export default class SimpleCircZoom extends React.Component {
  state = {};
  render() {
    // const {} = this.props
    const { component } = Axis({
      radius: 100,
      sequenceLength: 100,
      showAxisNumbers: true,
      circularAndLinearTickSpacing: 10
    });
    return (
      <div>
        hello werld
        <h1>yooooo</h1>
        <svg>{component}</svg>
        <CircularViewWithZoom
          {...{
            ...(this.state.hideNameAndInfo && { hideName: true }),
            ...(this.state.hoverPart && { hoveredId: "fakeId1" }),
            ...(this.state.changeSize && { height: 500, width: 500 }),
            // annotationVisibility: {
            //   cutsites: this.state.showCutsites
            // }

            ...(this.state.toggleSelection && {
              selectionLayer: { start: 2, end: 30 }
            }),
            partClicked: () => {
              window.toastr.success("Part Clicked!");
            },
            zoomLevel: 8,
            partRightClicked: () => {
              window.toastr.success("Part Right Clicked!");
            },

            sequenceData: {
              // annotationLabelVisibility: {
              //   parts: false,
              //   features: false,
              //   cutsites: false,
              //   primers: false
              // },
              // annotationVisibility: {
              //   axis: sequenceData.circular
              // }
              ...(this.state.noSequence
                ? {
                    noSequence: true,
                    size: this.state.limitLengthTo50Bps ? 50 : 164
                  }
                : {
                    sequence: this.state.limitLengthTo50Bps
                      ? "GGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAaga"
                      : "GGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacacccccc"
                  }),
              name: "Test Seq",
              circular: true, //toggle to true to change this!
              features: [
                {
                  name: "Feat 1",
                  id: "fakeId2",
                  color: "green",
                  start: 1,
                  end: 20
                }
              ],
              parts: [
                {
                  name: "Part 1",
                  id: "fakeId1",
                  start: 10,
                  end: 20,
                  ...(this.state.togglePartColor && { color: "override_red" })
                },
                {
                  name: "Part 2",
                  id: "fakeId2",
                  start: 25,
                  end: 30,
                  ...(this.state.togglePartColor && { color: "override_blue" })
                }
              ]
            }
          }}
        />
      </div>
    );
  }
}
const BASE_RADIUS = 50;

const VIEW_WIDTH = 400;
class CircularViewWithZoom extends React.Component {
  state = {
    zoomLevel: 1,
    rotationDegrees: 0
  };
  render() {
    const {
      svgWidth = 400,
      svgHeight = 400,
      sequenceLength = 100,
      editorName,
      annotationHeight = 15,
      spaceBetweenAnnotations = 2
    } = this.props;

    const percentOfCircle = 1 / this.state.zoomLevel;

    const numBpsToShow = Math.ceil(sequenceLength / this.state.zoomLevel);
    const angle = 2 * Math.PI * percentOfCircle;

    let radius = Math.max(BASE_RADIUS, VIEW_WIDTH / Math.sin(angle / 2) / 2);

    // const saggitaLength = r	±	 √	  r	2 	−	 l	2
    const saggitaLength =
      radius + Math.sqrt(radius * radius - ((VIEW_WIDTH / 2) * VIEW_WIDTH) / 2);

    const rotation = this.state.rotationDegrees * 0.0174533; //get radians
console.log(`rotation - angle/2, rotation + angle/2:`,rotation - angle/2, rotation + angle/2)
    const rangeToShowStart = getPositionFromAngle(rotation - angle/2, sequenceLength);
    const rangeToShowEnd = getPositionFromAngle(rotation + angle/2, sequenceLength);
    // console.log(`numBpsToShow:`, numBpsToShow);
    // console.log(`rangeToShowStart:`, rangeToShowStart);

    const rangeToShow = {
      // start: rangeToShowStart,
      // end: getPositionFromAngle(rotation + angle/2, sequenceLength)
      // end: normalizePositionByRangeLength(
      //   rangeToShowStart + numBpsToShow,
      //   sequenceLength
      // )
      start: normalizePositionByRangeLength(
        rangeToShowStart,
        sequenceLength
      ),
      end: normalizePositionByRangeLength(
        rangeToShowEnd,
        sequenceLength
      )
    };
    // console.log(`rangeToShow:`,rangeToShow)
    //   VIEW_WIDTH /
    // we have a circle
    // we want to fit a subsection of that circle into the view window
    // % of circle =  numBpsToShow / sequenceLength * 100 = 1/zoomLevel  * 100
    // const percentOfCircle =  numBpsToShow / sequenceLength * 100
    //angle = 2pi/percent
    // to see .5 of circle, radius = .5 * window width,
    // to see .1 of circle, radius =
    // chord length = 2rsinθ/2
    // window length = 2rsinθ/2 (where θ = % of circle * 2pi)
    // window length / sinθ/2 (where θ = % of circle * 2pi) / 2= r

    const rangeToShowInverted = invertRange(rangeToShow, sequenceLength);

    const allLabels = [];
    const layers = [
      {
        name: "axis",
        annotations: [{ start: 0, end: sequenceLength - 1 }]
      }
    ].map((layer, i) => {
      const {
        annotationType,
        getColor,
        useStartAngle,
        positionBy,
        allOnSameLevel,
        showLabels,
        reverseAnnotations,
        labelOptions,
        annotationProps
      } = layer;

      const trimmedAnnotations = layer.annotations.flatMap((range, i) => {
        // console.log(`rangeToShowInverted:`, rangeToShowInverted);
        const trimmedRange = adjustRangeToDeletionOfAnotherRange(
          range,
          rangeToShowInverted,
          sequenceLength
        );
        //         console.log(`range,
        // // rangeToShow,
        // // sequenceLength,:`,range,
        // rangeToShow,
        // sequenceLength,)
        // console.log(`trimmedRange:`, trimmedRange);
        if (!trimmedRange) return [];

        // const adjustedRange = adjustRangeToRotation(
        //   trimmedRange,
        //   rangeToShowStart,
        //   sequenceLength
        // );
        return trimmedRange;
      });
      // console.log(`trimmedAnnotations:`, trimmedAnnotations);
      const returnVal = drawAnnotations({
        annotationType,
        radius,
        annotations: trimmedAnnotations,
        annotationHeight,
        spaceBetweenAnnotations,
        sequenceLength,
        reverseAnnotations, //set true when drawing annotations that use the drawDirectedPiePiece function because that function returns things that need to be flipped
        editorName,
        getColor,
        useStartAngle, //use the startAngle instead of the centerAngle to position the labels
        positionBy, //by default the annotation.start and annotation.end are used to position the annotation on the circle, but passing a function here gives an option to override that
        allOnSameLevel, //by default overlapping annotations are given different yOffsets. Setting this to true prevents that and positions all annotations on the same level (no y-offsets given). Cutsites for example just get drawn all on the same level
        showLabels,
        labelOptions,
        annotationProps
      });
      if (!returnVal) return null;
      const { component, height, labels } = returnVal;
      radius += height;
      allLabels.push(labels);

      return component;
    });
    return (
      <div>
        <UncontrolledSliderWithPlusMinusBtns
          onChange={val => {
            // console.log(`val:`, val);
            this.setState({
              zoomLevel: val === 3 ? 1 : val
            });
          }}
          onRelease={val => {
            // console.log(`val:`, val);
            this.setState({
              zoomLevel: val === 3 ? 1 : val
            });
          }}
          title="Adjust Zoom Level"
          style={{ paddingTop: "4px", width: 100 }}
          className="alignment-zoom-slider"
          labelRenderer={false}
          stepSize={1}
          initialValue={3}
          max={14}
          min={3}
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
        <svg
          viewBox={`${svgWidth / 2 +
            +radius},${-radius}, ${svgHeight},${svgWidth}`}
          width={svgHeight}
          height={svgWidth}
        >
          {layers}
        </svg>
      </div>
    );
  }
}

function getAnnotationRotationAndHeightTransform({
  height = 0,
  sAngle = 0,
  eAngle = 0,
  forward = true
}) {
  const sAngleDegs = (sAngle * 360) / Math.PI / 2;
  const eAngleDegs = (eAngle * 360) / Math.PI / 2;
  let transform;
  if (forward) {
    transform = `translate(0,${-height}) rotate(${sAngleDegs},0,${height})`;
  } else {
    transform = `scale(-1,1) translate(0,${-height}) rotate(${-eAngleDegs},0,${height}) `;
  }
  return transform;
}
