import React from "react";
import {
  Button,
  Intent
} from "@blueprintjs/core";
import { tidyUpSequenceData } from "ve-sequence-utils";

import withEditorProps from "../withEditorProps";
import { DataTable } from "../../node_modules/teselagen-react-components/lib";
import Editor from "../Editor";
import FillWindow from "../Editor/FillWindow";

const SIDE_PANEL_WIDTH = 350


export class VersionHistoryView extends React.Component {
  state = { selectedVersion: undefined };
  componentDidMount = () => {
    this.props.vectorEditorInitialize(
      {
        sequenceData: tidyUpSequenceData({
          sequence: "gTAGAGACAAGA"
        })
      },
      {
        editorName: "veVersionHistoryView"
      }
    );
  };
  onRowSelect = ([row]) => {
    // todohistory
    // console.log("selected a row");
    // console.log('row:',row)

    this.setState({ selectedVersion: row });
  };
  getEntities = () => {
    return [
      {
        dateChanged: "Current",
        editedBy: "n/a",
        revisionType: "n/a"
      },
      {
        dateChanged: "thomas",
        editedBy: "thomas",
        revisionType: "thomas"
      }
    ];
  };
  revertToSelectedVersion = () => {
    // todohistory
    // console.log("this.state.selectedVersion:", this.state.selectedVersion);
  };
  goBack = () => {
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
                <h2> Revision History</h2>
                <DataTable
                  noPadding
                  isSingleSelect
                  noFullscreenButton
                  onRowSelect={this.onRowSelect}
                  maxHeight={400}
                  formName={"featureProperties"}
                  noRouter
                  compact
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

export default withEditorProps(VersionHistoryView);
