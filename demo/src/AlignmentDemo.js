import React from "react";
import { connect } from "react-redux";
import { times, get } from "lodash";
import store from "./store";
import alignmentRunData from "./exampleData/alignmentRunData.json";
import { addAlignment, AlignmentView, updateEditor } from "../../src/";
import { selectionLayerUpdate } from "../../src/redux/selectionLayer";
import {
  getCombinedActions,
  fakeActionOverrides
} from "../../src/withEditorProps/index";
import { caretPositionUpdate } from "../../src/redux/caretPosition";
// import { upsertPart } from "../../src/redux/sequenceData";
// import { MenuItem } from "@blueprintjs/core";

// Use the line below because using the full 30 sequences murders Redux dev tools.
alignmentRunData.alignmentTracks = alignmentRunData.alignmentTracks.slice(0, 5);

const basicActions = { selectionLayerUpdate, caretPositionUpdate };
export default connect(
  state => {
    // Use the state of the first alignment state to get the selection
    // data.
    const alignmentState = state.VectorEditor.alignmentView0;
    return {
      selectionLayer: get(alignmentState, "selectionLayer", {})
    };
  },
  dispatch => {
    return {
      ...getCombinedActions(
        times(
          alignmentRunData.alignmentTracks.length,
          i => "alignmentView" + i
        ),
        basicActions,
        fakeActionOverrides,
        dispatch
      )
    };
  }
)(
  class StandaloneDemo extends React.Component {
    componentDidMount() {
      addAlignment(store, { ...alignmentRunData });

      alignmentRunData.alignmentTracks.forEach((at, i) => {
        // We need to do this or else the sequence data will be
        // updated with some default sequence data when we select
        // stuff.
        updateEditor(store, "alignmentView" + i, {
          readOnly: true,
          sequenceData: at.alignmentData,
          annotationVisibility: {
            features: false,
            translations: false,
            parts: true,
            orfs: false,
            orfTranslations: false,
            cdsFeatureTranslations: true,
            axis: false,
            cutsites: false,
            primers: false,
            reverseSequence: false,
            lineageLines: false,
            axisNumbers: false
          }
        });
      });
    }
    render() {
      return (
        <AlignmentView
          {...{
            editorName: "MppViewer",
            id: alignmentRunData.id,
            minimapLaneHeight: 10,
            minimapLaneSpacing: 2,
            linearViewOptions: ({ index, alignmentVisibilityToolOptions }) => {
              const toReturn = {
                // tickSpacing: 10,
                ignoreYWhenSelecting: true,
                linearViewAnnotationVisibilityOverrides: {
                  ...alignmentVisibilityToolOptions.alignmentAnnotationVisibility,
                  parts: true
                }
              };
              if (index === alignmentRunData.alignmentTracks.length - 1) {
                toReturn.linearViewAnnotationVisibilityOverrides.axis = true;
              }

              return toReturn;
            }
          }}
        />
      );
    }
  }
);
