import React from "react";
import { Button, Intent } from "@blueprintjs/core";
import { tidyUpSequenceData } from "ve-sequence-utils";
import { DataTable } from "teselagen-react-components";

import Editor from "../Editor";
import FillWindow from "../Editor/FillWindow";
import withEditorProps from "../withEditorProps";

const SIDE_PANEL_WIDTH = 350;

// API for 3rd party use:
// getSequenceAtVersion: (versionId) => teselagenSequenceData
// getVersionList: () => [{ versionId: "51241", dateChanged: "12/30/1990", editedBy: "Hector Plahar", revisionType: "Feature Add"}]
// (already provided unless using VersionHistoryView directly) onSave: (event, sequenceDataToSave, editorState, onSuccessCallback) => { //same onSave handler as normal// },
// (not necessary unless using VersionHistoryView directly) exitVersionHistoryView() => {}
// (not necessary unless using VersionHistoryView directly) getCurrentSequenceData: () => teselagenSequenceData  //called upon initialization

export class VersionHistoryView extends React.Component {
  state = { selectedVersion: undefined };
  updateSeqData = sequenceData => {
    this.activeSeqData = sequenceData;
    this.props.vectorEditorInitialize(
      {
        sequenceData:
          (sequenceData && tidyUpSequenceData(sequenceData)) ||
          tidyUpSequenceData({
            sequence: "gTAGAGACAAGA"
          })
      },
      {
        editorName: "veVersionHistoryView"
      }
    );
  };
  componentDidMount = () => {
    this.updateSeqData(this.getCurrentSeqData());
  };
  getCurrentSeqData = async () => {
    if (this.props.getCurrentSequenceData) {
      return await this.props.getCurrentSequenceData();
    } else {
      return this.props.sequenceData;
    }
  };
  onRowSelect = async ([row]) => {
    // const close = showLoadingMask();
    if (row.dateChanged === "Current") {
      this.updateSeqData(await this.getCurrentSeqData());
      this.setState({ selectedVersion: null });
    } else {
      this.updateSeqData(await this.props.getSequenceAtVersion(row.versionId));
      this.setState({ selectedVersion: row });
    }
    // close();
  };
  getEntities = () => {
    return (
      (this.props.getVersionList && [
        {
          dateChanged: "Current"
        },
        ...this.props.getVersionList()
      ]) || [
        {
          dateChanged: "Current",
          editedBy: "n/a",
          revisionType: "n/a",
          versionId: 1
        },
        {
          dateChanged: "12/30/2211",
          editedBy: "thomas",
          revisionType: "thomas",
          versionId: 2
        }
      ]
    );
  };
  revertToSelectedVersion = e => {
    if (!this.props.onSave) {
      return console.error("props.onSave must be passed to VersionHistoryView");
    }
    this.props.onSave(
      e,
      tidyUpSequenceData(this.activeSeqData, { annotationsAsObjects: true }),
      {}
    );
    this.goBack();
  };
  goBack = () => {
    this.props.exitVersionHistoryView && this.props.exitVersionHistoryView();
    this.props.toggleViewVersionHistory();
    // todohistory
    // console.log("go back!");
  };
  render() {
    return (
      <FillWindow>
        {({ width, height }) => {
          return (
            <div
              style={{ width, height, display: "flex" }}
              className={"veVersionHistoryView"}
            >
              <Editor
                style={{
                  flexBasis: "content",
                  // flex: "0 0 200px",
                  flex: "1 1 350px",
                  width: width - SIDE_PANEL_WIDTH
                }}
                noVersionHistory
                fitHeight={true}
                ToolBarProps={{
                  toolList: [
                    "cutsiteTool",
                    "featureTool",
                    "orfTool",
                    "alignmentTool",
                    "inlineFindTool",
                    "visibilityTool"
                  ],
                  contentLeft: (
                    <Button
                      onClick={this.goBack}
                      icon="arrow-left"
                      style={{ marginLeft: 5 }}
                    >
                      Back
                    </Button>
                  )
                }}
                editorName="veVersionHistoryView"
              />
              <div
                style={{
                  borderLeft: "1px solid grey",
                  padding: 3,
                  width: SIDE_PANEL_WIDTH,
                  minWidth: SIDE_PANEL_WIDTH,
                  // flexBasis: 350,
                  // width: 350,
                  // flexGrow: 1,
                  // flex: "2 1 350px",
                  // flexBasis: "content",
                  display: "flex",
                  flexDirection: "column"
                }}
                className={"veVersionHistoryViewSidePanel"}
              >
                <h2 style={{ width: "100%", textAlign: "center" }}>
                  {" "}
                  Past Versions:{" "}
                </h2>
                <DataTable
                  noPadding
                  isSingleSelect
                  noFullscreenButton
                  onRowSelect={this.onRowSelect}
                  maxHeight={400}
                  formName={"featureProperties"}
                  noRouter
                  compact
                  withDisplayOptions
                  hideDisplayOptionsIcon
                  withSearch={false}
                  name="veVersionHistoryView"
                  isInfinite
                  schema={{
                    fields: [
                      {
                        path: "dateChanged",
                        type: "string"
                      },
                      { path: "editedBy", type: "string" },
                      { path: "revisionType", type: "string" }
                    ]
                  }}
                  entities={this.getEntities()}
                />
                <Button
                  style={{ margin: 3 }}
                  intent={Intent.PRIMARY}
                  disabled={!this.state.selectedVersion}
                  onClick={this.revertToSelectedVersion}
                  text="Revert to Selected Version"
                />
              </div>
            </div>
          );
        }}
      </FillWindow>
    );
  }
}

// export default VersionHistoryView;
export default withEditorProps(VersionHistoryView);
