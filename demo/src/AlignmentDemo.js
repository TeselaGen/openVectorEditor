import React from "react";
import { connect } from "react-redux";
import { times } from "lodash";
import store from "./store";
import alignmentRunData from "./exampleData/alignmentRunData.json";
import { addAlignment, AlignmentView } from "../../src/";
import { selectionLayerUpdate } from "../../src/redux/selectionLayer";
import {
  getCombinedActions,
  fakeActionOverrides
} from "../../src/withEditorProps/index";
import { caretPositionUpdate } from "../../src/redux/caretPosition";
// import { MenuItem } from "@blueprintjs/core";

const basicActions = { selectionLayerUpdate, caretPositionUpdate };
export default connect(null, dispatch => {
  return {
    ...getCombinedActions(
      times(alignmentRunData.alignmentTracks.length, i => "alignmentView" + i),
      basicActions,
      fakeActionOverrides,
      dispatch
    )
  };
})(
  class StandaloneDemo extends React.Component {
    componentDidMount() {
      addAlignment(store, "MppViewer", alignmentRunData);
      // addAlignment(store, "MppViewer", {...alignmentRunData, alignmentTracks: alignmentRunData.alignmentTracks.slice(0,10)});
    }
    render() {
      const { selectionLayerUpdate, caretPositionUpdate } = this.props;
      return (
        <AlignmentView
          {...{
            editorName: "MppViewer",
            id: alignmentRunData.id,
            dimensions: {
              width: 1500
            },
            minimapLaneHeight: 10,
            minimapLaneSpacing: 2,
            // hideBottomBar: true,
            linearViewOptions: ({ index, alignmentVisibilityToolOptions }) => {
              const toReturn = {
                tickSpacing: 10,
                rightClickOverrides: {
                  selectionLayerRightClicked: (items, opts, props) => {
                    if (0) props(props ^ props);
                    return [{ text: "Create Diversity Region" }];
                  }
                  // partRightClicked: () => {}
                },
                selectionLayerUpdate,
                caretPositionUpdate
              };
              if (index === alignmentRunData.alignmentTracks.length - 1) {
                Object.assign(toReturn, {
                  linearViewAnnotationVisibilityOverrides: {
                    ...alignmentVisibilityToolOptions.alignmentAnnotationVisibility,
                    axis: true
                  }
                });
              }
              return toReturn;
            }
          }}
        />
      );
    }
  }
);
