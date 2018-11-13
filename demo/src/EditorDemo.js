import { Switch, Button } from "@blueprintjs/core";
import { generateSequenceData } from "ve-sequence-utils";
import React from "react";
import store from "./store";
import { updateEditor } from "../../src/";

import Editor from "../../src/Editor";

// import { upsertPart } from "../../src/redux/sequenceData";
// import { MenuItem } from "@blueprintjs/core";

// Use the line below because using the full 30 sequences murders Redux dev tools.

export default class StandaloneDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      withPreviewMode: false,
      disableSetReadOnly: true,
      showReadOnly: true,
      showCircularity: true,
      showAvailability: true,
      ...JSON.parse(localStorage.editorDemoState || "{}")
    };
    updateEditor(store, "DemoEditor", {
      readOnly: this.state.readOnly
    });
  }

  componentDidUpdate() {
    localStorage.editorDemoState = JSON.stringify(this.state);
  }

  changeFullscreenMode = e =>
    this.setState({
      fullscreenMode: e.target.checked
    });
  changeReadOnly = e =>
    this.setState({
      readOnly: e.target.checked
    });

  render() {
    const { forceHeightMode, fullscreenMode, withPreviewMode } = this.state;

    return (
      <div
        style={{
          display: "flex",
          
          flexDirection: "column",
          flexGrow: "1"
        }}
      >
        <div style={{ paddingTop: 10, display: "flex", flexWrap: "wrap" }}>
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
          {renderToggle({
            that: this,
            type: "readOnly",
            hook: readOnly => {
              updateEditor(store, "DemoEditor", {
                readOnly
              });
            }
          })}
          {renderToggle({ that: this, type: "withPreviewMode" })}
          {renderToggle({ that: this, type: "disableSetReadOnly" })}
          {renderToggle({ that: this, type: "showReadOnly" })}
          {renderToggle({ that: this, type: "showCircularity" })}
          {renderToggle({ that: this, type: "showAvailability" })}
          {renderToggle({ that: this, type: "fullscreenMode" })}
          {renderToggle({
            that: this,
            type: "forceHeightMode",
            description: "Force Height 500px"
          })}
          {renderToggle({
            that: this,
            type: "hasOnSave",
            description: "pass onSave handler to enable saving in the editor "
          })}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1
          }}
        >
          <Editor
            {...this.state.readOnly && { readOnly: true }}
            editorName="DemoEditor"
            showMenuBar
            {...this.state.hasOnSave && {
              onSave: () => {
                console.log("saving");
              }
            }}
            handleFullscreenClose={!withPreviewMode && this.changeFullscreenMode} //don't pass this handler if you're also using previewMode
            isFullscreen={fullscreenMode}
            {...forceHeightMode && { height: 500 }}
            withPreviewMode={withPreviewMode}
            disableSetReadOnly={this.state.disableSetReadOnly}
            showReadOnly={this.state.showReadOnly}
            showCircularity={this.state.showCircularity}
            showAvailability={this.state.showAvailability}
          />
        </div>
      </div>
    );
  }
}

function renderToggle({ that, type, description, hook }) {
  return (
    <div className={"toggle-button-holder"}>
      <Switch
        checked={that.state[type]}
        label={description ? <span>{description}</span> : type}
        style={{ margin: "0px 30px", marginTop: 4 }}
        onChange={() => {
          hook && hook(!that.state[type]);
          that.setState({
            [type]: !that.state[type]
          });
        }}
      />
    </div>
  );
}
