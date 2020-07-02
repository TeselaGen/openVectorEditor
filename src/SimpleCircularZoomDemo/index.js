import React from "react";
import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";
import exampleSequenceData from "../../demo/src/exampleData/exampleSequenceData";
import CircularViewWithZoom from "../CircularView/CircularViewWithZoom";

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
          onChange={(val) => {
            // console.log(`val:`, val);
            this.setState({
              svgWidth: val
            });
          }}
          onRelease={(val) => {
            // console.log(`val:`, val);
            this.setState({
              svgWidth: val
            });
          }}
          title="Adjust Zoom Level"
          style={{ paddingTop: "4px", width: 120 }}
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
            sequenceData: exampleSequenceData

            // sequenceData: {
            //   // annotationLabelVisibility: {
            //   //   parts: false,
            //   //   features: false,
            //   //   cutsites: false,
            //   //   primers: false
            //   // },
            //   // annotationVisibility: {
            //   //   axis: sequenceData.circular
            //   // }
            //   ...(this.state.noSequence
            //     ? {
            //         noSequence: true,
            //         size: this.state.limitLengthTo50Bps ? 50 : 164
            //       }
            //     : {
            //         sequence: this.state.limitLengthTo50Bps
            //           ? "GGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAaga"
            //           : "GGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacacccccc"
            //       }),
            //   name: "Test Seq",
            //   circular: true, //toggle to true to change this!
            //   features: [
            //     {
            //       name: "Feat 1",
            //       id: "fakeId1",
            //       color: "green",
            //       start: 1,
            //       end: 20
            //     },
            //     {
            //       name: "Feat 1",
            //       id: "fakeId2",
            //       color: "green",
            //       start: 1,
            //       end: 20
            //     },
            //     {
            //       name: "Feat 1",
            //       id: "fakeId3",
            //       color: "green",
            //       start: 1,
            //       end: 20
            //     },
            //     {
            //       name: "Feat 1",
            //       id: "fakeId4",
            //       color: "green",
            //       start: 1,
            //       end: 20
            //     },
            //     {
            //       name: "Feat 1",
            //       id: "fakeId5",
            //       color: "green",
            //       start: 1,
            //       end: 20
            //     }
            //   ],
            //   parts: [
            //     {
            //       name: "Part 1",
            //       id: "fakeId1",
            //       start: 10,
            //       end: 20,
            //       ...(this.state.togglePartColor && { color: "override_red" })
            //     },
            //     {
            //       name: "Part 2",
            //       id: "fakeId2",
            //       start: 25,
            //       end: 30,
            //       ...(this.state.togglePartColor && { color: "override_blue" })
            //     }
            //   ]
            // }
          }}
        />
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

// function positionCutsites(annotation) {
//   return {
//     start: annotation.topSnipPosition,
//     end: annotation.topSnipPosition
//   };
// }
// function positionAxisNumbers(annotation) {
//   return {
//     start: annotation.caretPosition,
//     end: annotation.caretPosition
//   };
// }
// function positionCutsites(annotation) {
//   return {
//     start: annotation.topSnipPosition,
//     end: annotation.topSnipPosition
//   };
// }
