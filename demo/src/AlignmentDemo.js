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
import jbeiPairwiseAlignmnent232018 from "./exampleData/jbeiPairwiseAlignmnent_23_2018.json";
import { BPSelect } from "teselagen-react-components";

// import { upsertPart } from "../../src/redux/sequenceData";
// import { MenuItem } from "@blueprintjs/core";

// Use the line below because using the full 30 sequences murders Redux dev tools.
alignmentRunData.alignmentTracks = alignmentRunData.alignmentTracks.slice(0, 20);
let alignmentDataToUse = alignmentRunData
// let alignmentDataToUse = jbeiPairwiseAlignmnent232018
const defaultState = {
  showOptions: true,
  alignmentDataToUse: alignmentRunData,
  forceHeightMode: false,
  isFullyZoomedOut: false,
  setMinimapLaneHeight: false,
  setMinimapLaneSpacing: false,
  setAlignmentName: false,
  noClickDragHandlers: false,
  hasTemplate: false,
  noVisibilityOptions: false,
  setTickSpacing: false
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
          alignmentDataToUse.alignmentTracks ? alignmentDataToUse.alignmentTracks.length : alignmentDataToUse.pairwiseAlignments.length,
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

    componentDidUpdate(prevProps, prevState) {
      setParamsIfNecessary({ that: this, defaultState });
      if (this.state.alignmentDataToUse !== prevState.alignmentDataToUse) {
        addAlignment(store, { ...this.state.alignmentDataToUse });
      }
    }

    componentDidMount() {
      addAlignment(store, { ...this.state.alignmentDataToUse });

      if (this.state.alignmentDataToUse.alignmentTracks) {
        this.state.alignmentDataToUse.alignmentTracks.forEach((at, i) => {
          // We need to do this or else the sequence data will be
          // updated with some default sequence data when we select
          // stuff.
          updateEditor(store, "alignmentView" + i, {
            readOnly: true,
            sequenceData: at.alignmentData,
          });
        });
      } else {
        this.state.alignmentDataToUse.pairwiseAlignments.forEach((at, i) => {
          updateEditor(store, "alignmentView" + i, {
            readOnly: true,
            sequenceData: at.alignmentData,
          });
        });
      }
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
                  // height: "100%",
                  minWidth: 250,
                  maxWidth: 250,
                  display: "flex",
                  flexDirection: "column",
                  paddingRight: "5px",
                  borderRight: "1px solid lightgrey"
                }}
              >
            <BPSelect
              onChange={val => {
                val === "msa" ? this.setState({alignmentDataToUse: alignmentRunData}) : this.setState({alignmentDataToUse: jbeiPairwiseAlignmnent232018})
              }}
              options={[
                { label: "Multiple Sequence Alignment", value: "msa" },
                { label: "Pairwise Alignment", value: "pairwise" }
              ]}
            />
            <br/>
                {renderToggle({
                  that: this,
                  type: "forceHeightMode",
                  label: "Force Height 500px",
                  description:
                    "You can force a height for the editor by passing height:500 (same for width)"
                })}
                {renderToggle({
                  that: this,
                  type: "setAlignmentName",
                  label: "Set Alignment Name",
                  description:
                    "You can give the alignment a name by setting alignmentName:'Ref Seq Name'"
                })}
                {renderToggle({
                  that: this,
                  type: "isFullyZoomedOut",
                  label: "View Zoomed-Out Alignment",
                  description:
                    "You can view the alignment zoomed-out by setting isFullyZoomedOut:true"
                })}
                {renderToggle({
                  that: this,
                  type: "setMinimapLaneHeight",
                  label: "Set Minimap Lane Height 13px",
                  description:
                    "You can set a height for the minimap lanes by passing minimapLaneHeight:13"
                })}
                {renderToggle({
                  that: this,
                  type: "setMinimapLaneSpacing",
                  label: "Set Minimap Lane Spacing 3px",
                  description:
                    "You can set a height for the space between minimap lanes by passing minimapLaneSpacing:3"
                })}
                {renderToggle({
                  that: this,
                  type: "noClickDragHandlers",
                  label: "Disable Click-Drag Highlighting",
                  description:
                    "You can disable click-drag highlighting by setting noClickDragHandlers:true"
                })}
                {renderToggle({
                  that: this,
                  type: "hasTemplate",
                  label: "Specify Alignment with Template",
                  description:
                    "You can specify that the first sequence in an alignment is a template sequence by setting hasTemplate:true"
                })}
                {renderToggle({
                  that: this,
                  type: "setTickSpacing",
                  label: "Set Tick Spacing 10 bps",
                  description:
                    "You can set spacing of tick marks on the axis by setting linearViewOptions:{tickSpacing:10}"
                })}
                {renderToggle({
                  that: this,
                  type: "noVisibilityOptions",
                  label: "Disable Visibility Options",
                  description:
                    "You can disable the visibility options menu by setting noVisibilityOptions:true"
                })}
              </div>
            )}
          </div>
          <AlignmentView
            style={{
              ...(this.state.showOptions && { paddingLeft: 250 })
            }}
            {...{
              editorName: "MppViewer",
              id: this.state.alignmentDataToUse.id,
              alignmentType: this.state.alignmentDataToUse.alignmentType,
              height: this.state.forceHeightMode ? 500 : undefined,
              isFullyZoomedOut: this.state.isFullyZoomedOut,
              minimapLaneHeight: this.state.setMinimapLaneHeight ? 13 : undefined,
              minimapLaneSpacing: this.state.setMinimapLaneSpacing ? 3 : undefined,
              alignmentName: this.state.setAlignmentName ? 'Ref Seq Name' : undefined,
              noClickDragHandlers: this.state.noClickDragHandlers,
              hasTemplate: this.state.hasTemplate,
              noVisibilityOptions: this.state.noVisibilityOptions,
              linearViewOptions: {
                tickSpacing: this.state.setTickSpacing ? 10 : undefined
              }
            }}
          />
        </div>
      );
    }
  }
);
