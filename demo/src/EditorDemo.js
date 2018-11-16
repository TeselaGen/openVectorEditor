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
    const defaultState = {
      showMenuBar: true,
      withPreviewMode: false,
      disableSetReadOnly: true,
      showReadOnly: true,
      showCircularity: true,
      showAvailability: true
    };
    this.state = {
      ...defaultState,
      ...JSON.parse(localStorage.editorDemoState || "{}")
    };
    this.resetDefaultState = () => {
      this.setState({
        ...Object.keys(this.state).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {}),
        ...defaultState
      });
      localStorage.editorDemoState = JSON.stringify(defaultState);
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
      <React.Fragment>
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
              <Button
                onClick={() => {
                  updateEditor(store, "DemoEditor", {
                    sequenceDataHistory: {},
                    sequenceData: generateSequenceData()
                  });
                }}
              >
                Change Sequence
              </Button>
              <Button onClick={this.resetDefaultState}>Reset Defaults</Button>
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
              {renderToggle({ that: this, type: "shouldAutosave" })}
              {renderToggle({ that: this, type: "showMenuBar" })}
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
              <div>Optional Handlers: </div>
              {renderToggle({
                that: this,
                type: "onNew"
              })}
              {renderToggle({
                that: this,
                type: "onSave"
              })}
              {renderToggle({
                that: this,
                type: "onRename"
              })}
              {renderToggle({
                that: this,
                type: "onDuplicate"
              })}
              {renderToggle({
                that: this,
                type: "onDelete"
              })}
              {renderToggle({
                that: this,
                type: "onCopy"
              })}
              {renderToggle({
                that: this,
                type: "onPaste"
              })}
            </div>
          )}
          {/* <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              ...(this.state.showOptions && { paddingLeft: 250 })
            }}
          > */}
            <Editor
            style={{
              // display: "flex",
              // flexDirection: "column",
              // flexGrow: 1,
              ...(this.state.showOptions && { paddingLeft: 250 })
            }}
              {...this.state.readOnly && { readOnly: true }}
              editorName="DemoEditor"
              showMenuBar={this.state.showMenuBar}
              {...this.state.onNew && { onNew: () => console.info("onNew") }}
              {...this.state.onSave && {
                onSave: function(
                  event,
                  sequenceDataToSave,
                  editorState,
                  onSuccessCallback
                ) {
                  console.info("onSave");
                  console.info("event:", event);
                  console.info("sequenceData:", sequenceDataToSave);
                  console.info("editorState:", editorState);
                  // To disable the save button after successful saving
                  // either call the onSuccessCallback or return a successful promise :)
                  onSuccessCallback();
                  //or
                  // return myPromiseBasedApiCall()
                }
              }}
              {...this.state.onRename && {
                onRename: () => console.info("onRename")
              }}
              {...this.state.onDuplicate && {
                onDuplicate: () => console.info("onDuplicate")
              }}
              {...this.state.onDelete && {
                onDelete: () => console.info("onDelete")
              }}
              {...this.state.onCopy && {
                onCopy: function(event, copiedSequenceData, editorState) {
                  console.info("onCopy");
                  console.info(editorState);
                  //the copiedSequenceData is the subset of the sequence that has been copied in the teselagen sequence format
                  const clipboardData = event.clipboardData;
                  clipboardData.setData(
                    "text/plain",
                    copiedSequenceData.sequence
                  );
                  clipboardData.setData(
                    "application/json",
                    //for example here you could change teselagen parts into jbei parts
                    JSON.stringify(copiedSequenceData)
                  );
                  event.preventDefault();
                  //in onPaste in your app you can do:
                  // e.clipboardData.getData('application/json')
                }
              }}
              {...this.state.onPaste && {
                onPaste: function(event /* editorState */) {
                  //the onPaste here must return sequenceData in the teselagen data format
                  console.info("onPaste");
                  const clipboardData = event.clipboardData;
                  let jsonData = clipboardData.getData("application/json");
                  if (jsonData) {
                    jsonData = JSON.parse(jsonData);
                    if (jsonData.isJbeiSeq) {
                      jsonData = exampleConversion(jsonData);
                    }
                  }
                  const sequenceData = jsonData || {
                    sequence: clipboardData.getData("text/plain")
                  };
                  return sequenceData;
                }
              }}
              handleFullscreenClose={
                !withPreviewMode && this.changeFullscreenMode
              } //don't pass this handler if you're also using previewMode
              isFullscreen={fullscreenMode}
              {...forceHeightMode && { height: 500 }}
              withPreviewMode={withPreviewMode}
              disableSetReadOnly={this.state.disableSetReadOnly}
              showReadOnly={this.state.showReadOnly}
              showCircularity={this.state.showCircularity}
              showAvailability={this.state.showAvailability}
            />
          {/* </div> */}
        </div>
      </React.Fragment>
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

function exampleConversion(seq) {
  return seq;
}
