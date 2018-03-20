import React from "react";
import store from "./store";
import alignmentRunData from "./exampleData/alignmentRunData.json";
import { addAlignment, AlignmentView } from "../../src/";

export default class StandaloneDemo extends React.Component {
  componentDidMount() {
    addAlignment(store, "MppViewer", alignmentRunData);
  }
  render() {
    return (
      <AlignmentView
        {...{
          editorName: "MppViewer",
          id: alignmentRunData.id,
          dimensions: {
            width: 900
          },
          minimapLaneHeight: 10,
          minimapLaneSpacing: 2,
          // hideBottomBar: true,
          linearViewOptions: ({ index, alignmentVisibilityToolOptions }) => {
            let toReturn = {
              tickSpacing: 10,
              rightClickOverrides: {
                // selectionLayerRightClicked: (items, opts, props) => {},
                // partRightClicked: () => {}
              }
            };
            if (index === alignmentRunData.alignmentTracks.length - 1) {
              toReturn = {
                ...toReturn,
                linearViewAnnotationVisibilityOverrides: {
                  ...alignmentVisibilityToolOptions.alignmentAnnotationVisibility,
                  axis: true
                }
              };
            }
            return toReturn;
          }
        }}
      />
    );
  }
}
