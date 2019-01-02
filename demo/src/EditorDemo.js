import {  Button, Icon } from "@blueprintjs/core";
import { generateSequenceData } from "ve-sequence-utils";
import React from "react";
import {
  // getCurrentParamsFromUrl,
  setCurrentParamsOnUrl,
  getCurrentParamsFromUrl,
} from "teselagen-react-components";
import _ from "lodash";
import store from "./store";
import { updateEditor } from "../../src/";

import Editor from "../../src/Editor";
import cloneDeep from "lodash/cloneDeep";
import renderToggle from "./utils/renderToggle";

// import { upsertPart } from "../../src/redux/sequenceData";
// import { MenuItem } from "@blueprintjs/core";

// Use the line below because using the full 30 sequences murders Redux dev tools.

const defaultState = {
  readOnly: false,
  showMenuBar: true,
  displayMenuBarAboveTools: true,
  withPreviewMode: false,
  disableSetReadOnly: false,
  showReadOnly: true,
  showCircularity: true,
  overrideToolbarOptions: false,
  menuOverrideExample: false,
  propertiesOverridesExample: false,
  overrideRightClickExample: false,
  showAvailability: true,
  showOptions: true,
  shouldAutosave: false,
  isFullscreen: false,
  forceHeightMode: false,
  onNew: true,
  onSave: true,
  onRename: true,
  onDuplicate: true,
  onDelete: true,
  onCopy: true,
  onPaste: true
};

export default class EditorDemo extends React.Component {
  constructor(props) {
    super(props);
    const editorDemoState = getCurrentParamsFromUrl(props.history.location);
    // localStorage.editorDemoState = props.history.location.search;

    try {
      this.state = {
        ...defaultState,
        ...JSON.parse(editorDemoState || "{}")
      };
    } catch (e) {
      this.state = {
        ...defaultState
      };
    }
    this.resetDefaultState = () => {
      this.setState({
        ...Object.keys(this.state).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {}),
        ...defaultState
      });
      setCurrentParamsOnUrl({}, this.props.history.replace);
      // localStorage.editorDemoState = JSON.stringify(defaultState);
    };
    updateEditor(store, "DemoEditor", {
      readOnly: this.state.readOnly
    });
  }

  componentDidUpdate() {
    if (!_.isEqual(this.state, this.oldState)) {
      setCurrentParamsOnUrl(
        difference(this.state, defaultState),
        this.props.history.replace
      );
      this.oldState = cloneDeep(this.state);
    }
  }

  changeFullscreenMode = e =>
    this.setState({
      isFullscreen: e.target.checked
    });
  changeReadOnly = e =>
    this.setState({
      readOnly: e.target.checked
    });

  propertiesOverridesExample = {
    PropertiesProps: {
      propertiesList: [
        "general",
        "features",
        {
          name: "parts",
          additionalFooterEls: (
            <Button
              onClick={() => {
                window.toastr.success("properties overrides successfull");
              }}
            >
              propertiesProps parts footer button
            </Button>
          )
        },
        "primers",
        "translations",
        "cutsites",
        "orfs",
        "genbank"
      ]
    }
  };
  rightClickOverridesExample = {
    rightClickOverrides: {
      partRightClicked: (items, { annotation }, props) => {
        return [
          ...items,
          {
            text: "My Part Override",
            onClick: () => window.toastr.success("Part Override hit!")
          }
        ];
      }
    }
  };
  menuOverrideExample = {
    menuFilter:
      // Menu customization example
      menuDef => {
        menuDef.push({ text: "Custom", submenu: ["copy"] });
        menuDef[0].submenu
          .find(i => i.text && i.text.includes("Export"))
          .submenu.push({
            text: "Custom export option!",
            onClick: () => window.toastr.success("Custom export hit!")
          });
        menuDef[3].submenu.push({
          text: "My Custom Tool",
          onClick: () => window.toastr.success("Some custom tool")
        });
        return menuDef;
      }
  };
  toolbarOverridesExample = {
    ToolBarProps: {
      //name the tools you want to see in the toolbar in the order you want to see them
      toolList: [
        // 'saveTool',
        {
          name: "downloadTool",
          Icon: <Icon data-test="veDownloadTool" icon="bank-account" />,
          onIconClick: () => {
            window.toastr.success("Download tool hit!");
          }
        },
        {
          name: "undoTool",
          Icon: <Icon icon="credit-card" data-test="my-overridden-tool-123" />,
          onIconClick: () => {
            window.toastr.success("cha-ching");
          },
          disabled: false
        },
        "redoTool",
        "cutsiteTool",
        "featureTool",
        "oligoTool",
        "orfTool",
        {
          name: "alignmentTool",
          onIconClick: () => {
            const { item } = this.props;
            const url = "/alignments/new?seqId=" + item.id;
            window.open(window.location.origin + url);
          }
        },
        "editTool",
        "findTool",
        "visibilityTool"
      ]
    }
  };

  render() {
    const {
      forceHeightMode,
      shouldAutosave,
      isFullscreen,
      withPreviewMode
    } = this.state;

    return (
      <React.Fragment>
        {/* <button onClick={() => {
          const dragSource = document.querySelector(".veTabLinearMap")
    const dropTarget = document.querySelector(".veTabProperties")
          dragMock.dragStart(dragSource).dragEnter(dropTarget).dragOver(dropTarget).delay(500).dragEnd()
        }}>click me!</button> */}
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
              Demo Specific options:
              {renderToggle({
                that: this,
                label: "Show custom tool overrides example",
                type: "overrideToolbarOptions",
                description: (
                  <pre>
                    {`//This is an example of how to pass tool overrides:
ToolBarProps: {
  toolList: [
    {
      name: 'downloadTool',
      onIconClick: () => {
        window.toastr.success("Download tool hit!")
        }
    },
    ...etc`
                      .split("\n")
                      .map((l, i) => (
                        <div key={i}>{l}</div>
                      ))}
                  </pre>
                )
              })}
              {renderToggle({
                that: this,
                label: "Show custom properties overrides example",
                type: "propertiesOverridesExample",
                description: (
                  <pre>
                    {`//This is an example of how to pass Properties overrides
PropertiesProps: {
  propertiesList: [
    "general",
    "features",
    {
      name: "parts",
      additionalFooterEls: (
        <Button
          onClick={() => {
            window.toastr.success(
              "properties overrides successfull"
            )
          }}
        >
          propertiesProps parts footer button
        </Button>
      )
    },
    "primers",
    "translations",
    "cutsites",
    "orfs",
    "genbank"
  ]
}`
                      .split("\n")
                      .map((l, i) => (
                        <div key={i}>{l}</div>
                      ))}
                  </pre>
                )
              })}
              {renderToggle({
                that: this,
                label: "Show custom menu overrides example",
                type: "menuOverrideExample",
                description: (
                  <pre>
                    {`// Menu customization example
menuFilter:
menuDef => {
  menuDef.push({ text: "Custom", submenu: ["copy"] });
  menuDef[0].submenu
    .find(i => i.text && i.text.includes("Export"))
    .submenu.push({
      text: "Custom export option!",
      onClick: () => alert("Custom export")
    });
  menuDef[3].submenu.push({
    text: "My Custom Tool",
    onClick: () => alert("Some custom tool")
  });
  return menuDef;
}`
                      .split("\n")
                      .map((l, i) => (
                        <div key={i}>{l}</div>
                      ))}
                  </pre>
                )
              })}
              {renderToggle({
                that: this,
                label: "Show custom right click override example",
                type: "overrideRightClickExample",
                description: (
                  <pre>
                    {`//This is an example of how to pass rightClick overrides:
rightClickOverrides: {
  partRightClicked: (items, { annotation }, props) => {
    return [
      ...items,
      {
        text: "My Part Override",
        onClick: () => window.toastr.success("Part Override hit!")
      }
    ];
  }
}`
                      .split("\n")
                      .map((l, i) => (
                        <div key={i}>{l}</div>
                      ))}
                  </pre>
                )
              })}
              {renderToggle({
                that: this,
                type: "forceHeightMode",
                label: "Force Height 500px",
                description: "You can force a height for the editor by passing height:500 (same for width) "
              })}
              Editor Options:
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
              {renderToggle({ that: this, type: "displayMenuBarAboveTools" })}
              {renderToggle({ that: this, type: "disableSetReadOnly" })}
              {renderToggle({ that: this, type: "showReadOnly" })}
              {renderToggle({ that: this, type: "showCircularity" })}
              {renderToggle({ that: this, type: "showAvailability" })}
              {renderToggle({ that: this, type: "isFullscreen" })}
              <div>Editor Handlers: </div>
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
            displayMenuBarAboveTools={this.state.displayMenuBarAboveTools}
            {...this.state.onNew && {
              onNew: () => window.toastr.success("onNew callback triggered")
            }}
            {...this.state.onSave && {
              onSave: function(
                event,
                sequenceDataToSave,
                editorState,
                onSuccessCallback
              ) {
                window.toastr.success("onSave callback triggered");
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
              onRename: () =>
                window.toastr.success("onRename callback triggered")
            }}
            {...this.state.onDuplicate && {
              onDuplicate: () =>
                window.toastr.success("onDuplicate callback triggered")
            }}
            {...this.state.onDelete && {
              onDelete: () =>
                window.toastr.success("onDelete callback triggered")
            }}
            {...this.state.onCopy && {
              onCopy: function(event, copiedSequenceData, editorState) {
                window.toastr.success("onCopy callback triggered");
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
                window.toastr.success("onPaste callback triggered");
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
            isFullscreen={isFullscreen}
            shouldAutosave={shouldAutosave}
            {...forceHeightMode && { height: 500 }}
            withPreviewMode={withPreviewMode}
            disableSetReadOnly={this.state.disableSetReadOnly}
            showReadOnly={this.state.showReadOnly}
            showCircularity={this.state.showCircularity}
            showAvailability={this.state.showAvailability}
            {...this.state.overrideRightClickExample &&
              this.rightClickOverridesExample}
            {...this.state.propertiesOverridesExample &&
              this.propertiesOverridesExample}
            {...this.state.overrideToolbarOptions &&
              this.toolbarOverridesExample}
            {...this.state.menuOverrideExample && this.menuOverrideExample}
          />
          {/* </div> */}
        </div>
      </React.Fragment>
    );
  }
}

function exampleConversion(seq) {
  return seq;
}

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
function difference(object, base) {
  function changes(object, base) {
    return _.transform(object, function(result, value, key) {
      if (!_.isEqual(value, base[key])) {
        result[key] =
          _.isObject(value) && _.isObject(base[key])
            ? changes(value, base[key])
            : value;
      }
    });
  }
  return changes(object, base);
}
