import React from "react";
import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";
import {
  getPositionFromAngle,
  normalizePositionByRangeLength,
  // invertRange,
  getOverlapsOfPotentiallyCircularRanges,
  isPositionWithinRange,
  getRangeLength
} from "ve-range-utils";
import drawAnnotations from "../CircularView/drawAnnotations";
import calculateTickMarkPositionsForGivenRange from "../utils/calculateTickMarkPositionsForGivenRange";
// import drawDirectedPiePiece from "../CircularView/drawDirectedPiePiece";
// import PositionAnnotationOnCircle from "../CircularView/PositionAnnotationOnCircle";

export default class SimpleCircZoom extends React.Component {
  state = {
    svgWidth: 400
  };
  render() {
    // const {} = this.props
    // const { component } = Axis({
    //   radius: 100,
    //   sequenceLength: 100,
    //   showAxisNumbers: true,
    //   circularAndLinearTickSpacing: 10
    // });
    return (
      <div>
        hello werld
        <h1>yooooo</h1>
        <UncontrolledSliderWithPlusMinusBtns
          onChange={val => {
            // console.log(`val:`, val);
            this.setState({
              svgWidth: val
            });
          }}
          onRelease={val => {
            // console.log(`val:`, val);
            this.setState({
              svgWidth: val
            });
          }}
          title="Adjust Zoom Level"
          style={{ paddingTop: "4px", width: 100 }}
          className="alignment-zoom-slider"
          labelRenderer={false}
          stepSize={1}
          initialValue={400}
          max={800}
          min={300}
        />
        {/* <svg>{component}</svg> */}
        {/* <EvenSimplerFeature></EvenSimplerFeature> */}
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
            svgWidth: this.state.svgWidth,
            svgHeight: this.state.svgWidth,
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

// const VIEW_WIDTH = 400;
class CircularViewWithZoom extends React.Component {
  state = {
    zoomLevel: 3,
    rotationDegrees: 0
  };
  render() {
    const {
      svgWidth = 400,
      svgHeight = 400,
      sequenceLength = 100,
      editorName,
      annotationHeight = 15,
      spaceBetweenAnnotations = 2,
      isProtein
    } = this.props;
    const percentOfCircle = 1 / this.state.zoomLevel;

    // if (percentOfCircle === 1) {
    //   return "normal"
    // }

    // console.log(`percentOfCircle:`, percentOfCircle);
    // const numBpsToShow = Math.ceil(sequenceLength / this.state.zoomLevel);
    const angle = 2 * Math.PI * percentOfCircle;
    // console.log(`angle:`, angle);
    // console.log(`Math.sin(angle / 2):`, Math.sin(angle / 2));

    let radius =
      this.state.zoomLevel === 1
        ? BASE_RADIUS
        : Math.max(BASE_RADIUS, svgWidth / Math.sin(angle / 2) / 2);

    // const saggitaLength = r	±	 √	  r	2 	−	 l	2
    // const saggitaLength =
    //   radius + Math.sqrt(radius * radius - ((VIEW_WIDTH / 2) * VIEW_WIDTH) / 2);

    const rotation = this.state.rotationDegrees * 0.0174533; //get radians

    const rangeToShowStart = getPositionFromAngle(
      rotation - angle / 2,
      sequenceLength
    );
    const rangeToShowEnd = getPositionFromAngle(
      rotation + angle / 2,
      sequenceLength
    );
    // console.log(`numBpsToShow:`, numBpsToShow);
    // console.log(`rangeToShowStart:`, rangeToShowStart);

    const rangeToShow =
      this.state.zoomLevel === 1
        ? { start: 0, end: Math.max(sequenceLength - 1, 0) }
        : {
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
            end: normalizePositionByRangeLength(rangeToShowEnd, sequenceLength)
          };

    const allLabels = [];
    const rangeToShowLength = getRangeLength(rangeToShow, sequenceLength)
    const layers = [
      {
        annotations: [rangeToShow],
        annotationType: "axis",
        // Annotation:
        // allOnSameLevel: false,
        annotationProps: {
          color: "white",
          stroke: "black",
          arrowheadLength: 0,
          annotationHeight: 5
        },
        showLabels: false
      },
      {
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
            start: pos,
            end: pos,
          };
        }),
        annotationType: "axisNumbers",
        Annotation: AxisNumbers,
        // positionBy: positionAxisNumbers,
        allOnSameLevel: true,
        addHeight: true,
        showLabels: false
      },
      {
        annotations: [
          { start: 10, end: 20, name: "thomas" },
          { start: 10, end: 20, name: "thomas" }
        ],
        annotationType: "feature",
        // allOnSameLevel: true,
        showLabels: true
      }
    ].map(layer => {
      const trimmedAnnotations = layer.annotations.flatMap((range) => {
        // console.log(`rangeToShowInverted:`, rangeToShowInverted);
        const trimmedRange = getOverlapsOfPotentiallyCircularRanges(
          range,
          rangeToShow,
          sequenceLength,
          true
        );
        if (!trimmedRange) return [];
        return trimmedRange;
      });

      const returnVal = drawAnnotations({
        ...layer,
        radius,
        annotations: trimmedAnnotations,
        annotationHeight,
        spaceBetweenAnnotations,
        sequenceLength,
        editorName,
        arrowheadLength: 10
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
          viewBox={`${-svgWidth / 2},${-svgHeight / 2 -
            (this.state.zoomLevel === 1
              ? 0
              : radius)},${svgWidth},${svgHeight}`}
          width={svgHeight}
          height={svgWidth}
        >
          <g transform={`rotate(${-this.state.rotationDegrees})`}>{layers}</g>
        </svg>
      </div>
    );
  }
}

// class EvenSimplerFeature extends React.Component {
//   render() {
//     const { svgWidth = 400, svgHeight = 400 } = this.props;
//     return (
//       <svg
//         viewBox={`${-svgWidth / 2},${-svgHeight / 2},${svgWidth},${svgHeight}`}
//         width={svgWidth}
//         height={svgHeight}
//       >
//         <rect fill="black" width="5" height="5"></rect>
//         <path
//           //use PositionAnnotationOnCircle to move the feature back into view via tuckInHeight
//           {...PositionAnnotationOnCircle({
//             sAngle: -1
//             // tuckInHeight: 100
//           })}
//           stroke={"black"}
//           //draw the feature with the exagerated radius
//           d={drawDirectedPiePiece({
//             viewHeight: svgHeight,
//             svgWidth: svgWidth,
//             radius: 100,
//             annotationHeight: 4,
//             totalAngle: 1
//           }).print()}
//         ></path>
//       </svg>
//     );
//   }
// }

function positionCutsites(annotation) {
  return {
    start: annotation.topSnipPosition,
    end: annotation.topSnipPosition
  };
}
function positionAxisNumbers(annotation) {
  return {
    start: annotation.caretPosition,
    end: annotation.caretPosition
  };
}
// function positionCutsites(annotation) {
//   return {
//     start: annotation.topSnipPosition,
//     end: annotation.topSnipPosition
//   };
// }

function AxisNumbers(props) {
  console.log(`props:`,props)
  console.log(`axisnumbas:`);
  return (
    <g>
      <rect width={3} height={7} fill="black"></rect>
      <text>  </text>
    </g>
  );
}
