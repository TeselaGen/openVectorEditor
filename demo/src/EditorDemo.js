import { Switch, Button } from "@blueprintjs/core";
import { generateSequenceData } from "ve-sequence-utils";
import React from "react";
import { connect } from "react-redux";
import { times, get } from "lodash";
import store from "./store";
import alignmentRunData from "./exampleData/alignmentRunData.json";
import { updateEditor } from "../../src/";
import { selectionLayerUpdate } from "../../src/redux/selectionLayer";
import {
  getCombinedActions,
  fakeActionOverrides
} from "../../src/withEditorProps/index";
import { caretPositionUpdate } from "../../src/redux/caretPosition";
import Editor from "../../src/Editor";

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
    // componentDidMount() {
    //   addAlignment(store, { ...alignmentRunData });

    //   alignmentRunData.alignmentTracks.forEach((at, i) => {
    //     // We need to do this or else the sequence data will be
    //     // updated with some default sequence data when we select
    //     // stuff.
    //     updateEditor(store, "alignmentView" + i, {
    //       readOnly: true,
    //       sequenceData: at.alignmentData,
    //       annotationVisibility: {
    //         features: false,
    //         translations: false,
    //         parts: true,
    //         orfs: false,
    //         orfTranslations: false,
    //         cdsFeatureTranslations: true,
    //         axis: false,
    //         cutsites: false,
    //         primers: false,
    //         reverseSequence: false,
    //         lineageLines: false,
    //         axisNumbers: false
    //       }
    //     });
    //   });
    // }

    constructor(props) {
      super(props);

      this.state = {
        previewMode: false
        // forceHeightMode: false,
      };
    }

    changePreviewMode = e =>
      this.setState({
        previewMode: e.target.checked
      });
    changeFullscreenMode = e =>
      this.setState({
        fullscreenMode: e.target.checked
      });
    changeForceHeightMode = e =>
      this.setState({
        forceHeightMode: e.target.checked
      });

    render() {
      const { forceHeightMode, fullscreenMode, previewMode } = this.state;

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: "1"
          }}
        >
          <div style={{ paddingTop: 10, display: "flex" }}>
            <Button
              onClick={() => {
                updateEditor(store, "DemoEditor", {
                  sequenceDataHistory: {},
                  sequenceData: generateSequenceData()
                });
              }}
            >
              {" "}
              Change Sequence
            </Button>
            <Switch
              checked={previewMode}
              label="Preview Mode"
              onChange={this.changePreviewMode}
              style={{ margin: "0px 30px", marginTop: 4 }}
            />
            <Switch
              checked={fullscreenMode}
              label="Fullscreen Mode"
              onChange={this.changeFullscreenMode}
              style={{ margin: "0px 30px", marginTop: 4 }}
            />
            <Switch
              checked={forceHeightMode}
              label="Force Height 500px"
              onChange={this.changeForceHeightMode}
              style={{ margin: "0px 30px", marginTop: 4 }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1
            }}
          >
            <Editor
              editorName="DemoEditor"
              showMenuBar
              handleFullscreenClose={this.changeFullscreenMode}
              isFullscreen={fullscreenMode}
              {...forceHeightMode && { height: 500 }}
              withPreviewMode={previewMode}
            />
          </div>
        </div>
      );
    }
  }
);
