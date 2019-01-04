import { setupOptions, setParamsIfNecessary } from "./utils/setupOptions";
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
import renderToggle from "./utils/renderToggle";

// import { upsertPart } from "../../src/redux/sequenceData";
// import { MenuItem } from "@blueprintjs/core";

// Use the line below because using the full 30 sequences murders Redux dev tools.
alignmentRunData.alignmentTracks = alignmentRunData.alignmentTracks.slice(0, 5);
const defaultState = {
  showOptions: true
};

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
  class AlignmentDemo extends React.Component {
    constructor(props) {
      super(props);
      setupOptions({ that: this, defaultState, props });
      updateEditor(store, "DemoEditor", {
        readOnly: this.state.readOnly
      });
    }

    componentDidUpdate() {
      setParamsIfNecessary({ that: this, defaultState });
    }

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
        <div>
          <div style={{ width: 250 }}>
            {renderToggle({ that: this, type: "showOptions" })}
          </div>

          <div
            style={{
              display: "flex",
              position: "relative",
              // flexDirection: "column",
              flexGrow: "1"
            }}
          >
            {this.state.showOptions && (
              <div
                data-test="optionContainer"
                style={{
                  // background: "white",
                  zIndex: 1000,
                  position: "absolute",
                  left: 0,
                  paddingTop: 10,
                  width: 250,
                  height: "100%",
                  minWidth: 250,
                  maxWidth: 250,
                  display: "flex",
                  flexDirection: "column",
                  paddingRight: "5px",
                  borderRight: "1px solid lightgrey"
                }}
              >
                {renderToggle({
                  that: this,
                  type: "forceHeightMode",
                  label: "Force Height 500px",
                  description:
                    "You can force a height for the editor by passing height:500 (same for width) "
                })}
              </div>
            )}
          </div>
          <AlignmentView
            style={{
              // display: "flex",
              // flexDirection: "column",
              // flexGrow: 1,
              ...(this.state.showOptions && { paddingLeft: 250 })
            }}
            {...{
              editorName: "MppViewer",
              id: alignmentRunData.id,
              minimapLaneHeight: 10,
              height: this.state.forceHeightMode ? 500 : undefined,
              minimapLaneSpacing: 2,
              linearViewOptions: ({
                index,
                alignmentVisibilityToolOptions
              }) => {
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
        </div>
      );
    }
  }
);
