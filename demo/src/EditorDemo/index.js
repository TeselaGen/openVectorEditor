import { Button, Icon } from "@blueprintjs/core";
import { generateSequenceData, tidyUpSequenceData } from "ve-sequence-utils";
import React from "react";
import { isRangeOrPositionWithinRange } from "ve-range-utils";

import store from "./../store";
import { updateEditor, actions } from "../../../src/";

import Editor from "../../../src/Editor";
import renderToggle from "./../utils/renderToggle";
import { setupOptions, setParamsIfNecessary } from "./../utils/setupOptions";
import exampleSequenceData from "./../exampleData/exampleSequenceData";
import AddEditFeatureOverrideExample from "./AddEditFeatureOverrideExample";
import exampleProteinData from "../exampleData/exampleProteinData";

// import { upsertPart } from "../../../src/redux/sequenceData";
// import { MenuItem } from "@blueprintjs/core";

// Use the line below because using the full 30 sequences murders Redux dev tools.

const defaultState = {
  readOnly: false,
  showMenuBar: true,
  customizeTabs: false,
  displayMenuBarAboveTools: true,
  withPreviewMode: false,
  disableSetReadOnly: false,
  showReadOnly: true,
  showCircularity: true,
  overrideToolbarOptions: false,
  menuOverrideExample: false,
  propertiesOverridesExample: false,
  overrideRightClickExample: false,
  overrideAddEditFeatureDialog: false,
  clickOverridesExample: false,
  showAvailability: true,
  showDemoOptions: true,
  shouldAutosave: false,
  isFullscreen: false,
  isProtein: false,
  forceHeightMode: false,
  setDefaultVisibilities: false,
  onNew: true,
  onSave: true,
  onRename: true,
  onDuplicate: true,
  onDelete: true,
  beforeSequenceInsertOrDelete: false,
  onCopy: true,
  onPaste: true
};

export default class EditorDemo extends React.Component {
  constructor(props) {
    super(props);
    setupOptions({ that: this, defaultState, props });

    updateEditor(store, "DemoEditor", {
      readOnly: false,
      sequenceData: exampleSequenceData
    });
  }
  componentDidUpdate() {
    setParamsIfNecessary({ that: this, defaultState });
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
      partRightClicked: items => {
        return [
          ...items,
          {
            text: "My Part Override",
            onClick: () => window.toastr.success("Part Override Hit!")
          }
        ];
      }
    }
  };
  clickOverridesExample = {
    clickOverrides: {
      featureClicked: ({ event }) => {
        window.toastr.success("Feature Click Override Hit!");
        event.stopPropagation();
        return true; //returning truthy stops the regular click action from occurring
      },
      partClicked: () => {
        window.toastr.success("Part Click Override Hit!");
        //by default (aka returning falsy) the usual click action occurs
      }
    }
  };
  overrideAddEditFeatureDialogExample = {
    AddOrEditFeatureDialogOverride: AddEditFeatureOverrideExample
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
        "versionHistoryTool",
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

  setLinearPanelAsActive = () => {
    store.dispatch(
      actions.setPanelAsActive("rail", { editorName: "DemoEditor" })
    );
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
          {renderToggle({ that: this, type: "showDemoOptions" })}
        </div>

        <div
          style={{
            display: "flex",
            position: "relative",
            // flexDirection: "column",
            flexGrow: "1"
          }}
        >
          {this.state.showDemoOptions && (
            <div
              data-test="optionContainer"
              style={{
                // background: "white",
                zIndex: 1000,
                position: "absolute",
                overflowY: "auto",
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
              <strong>Demo Specific options:</strong>
              {renderToggle({
                that: this,
                label: "Customize tool bar",
                type: "overrideToolbarOptions",
                description: `//This is an example of how to pass custom tool overrides:
\`\`\`
ToolBarProps: {
  toolList: [
    {
      name: 'downloadTool',
      onIconClick: () => {
        window.toastr.success("Download tool hit!")
        }
    },
    ...etc
  }
\`\`\`
                  `
              })}
              {renderToggle({
                that: this,
                label: "Customize tabs",
                type: "customizeTabs",
                hook: shouldUpdate => {
                  shouldUpdate &&
                    updateEditor(store, "DemoEditor", {
                      panelsShown: [
                        [
                          {
                            id: "rail",
                            name: "Linear Map",
                            active: true
                          }
                        ],
                        [
                          {
                            id: "sequence",
                            name: "Sequence Map"
                          },
                          {
                            id: "alignmentTool",
                            name: "New Alignment",
                            canClose: true
                          },
                          {
                            id: "digestTool",
                            name: "New Digest",
                            canClose: true
                          },
                          {
                            // fullScreen: true,
                            active: true,
                            id: "circular",
                            name: "Circular Map"
                          },
                          {
                            id: "properties",
                            name: "Properties"
                          }
                        ]
                      ]
                    });
                },
                description: `//The positions of the tabs shown in the editor can be changed programatically:
\`\`\`js
updateEditor(store, "DemoEditor", {
  panelsShown: [
    [
      {
        id: "rail",
        name: "Linear Map",
        active: true
      }
    ],
    [
      {
        id: "sequence",
        name: "Sequence Map",
        
      },
      {
        id: "alignmentTool",
        name: "New Alignment",
        canClose: true
      },
      {
        id: "digestTool",
        name: "New Digest",
        canClose: true
      },
      {
        // fullScreen: true,
        active: true,
        id: "circular",
        name: "Circular Map"
      },
      {
        id: "properties",
        name: "Properties"
      }
    ]
  ]
})
\`\`\`
`
              })}
              {renderToggle({
                that: this,
                label: "Customize properties tab",
                type: "propertiesOverridesExample",
                description: `//The panels shown in the properties tab can be customized. 
                Here is an example of how to pass Properties overrides
\`\`\`js
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
}
\`\`\`
`
              })}
              {renderToggle({
                that: this,
                label: "Customize menu bar",
                type: "menuOverrideExample",
                description: `The top menu bar can be customized as desired. 
                Here is an example of how to do that:
\`\`\`\
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
\`\`\`
}`
              })}
              {renderToggle({
                that: this,
                label: "Customize Add/Edit Feature Dialog",
                type: "overrideAddEditFeatureDialog",
                description: `You'll need to pass an entire component override to the editor like so:
\`\`\`
<Editor AddOrEditFeatureDialogOverride={MyCustomComponent}/>
\`\`\`
-  You can override the parts and primers dialog in the same way.
-  This API is not accessible unless using the React version of the code (UMD does not work)
                  `
              })}
              {renderToggle({
                that: this,
                label: "Customize Right Click Menus",
                type: "overrideRightClickExample",
                description: `If enabled, right clicking a part will fire a custom alert. 
Here is an example of how to pass rightClick overrides:
\`\`\`
rightClickOverrides: {
  partRightClicked: (items, { annotation }, props) => {
    return [
      ...items,
      {
        text: "My Part Override",
        onClick: () => window.toastr.success("Part Override Hit!")
      }
    ];
  }
}
\`\`\`
                `
              })}
              {renderToggle({
                that: this,
                type: "forceHeightMode",
                label: "Force Height 500px",
                description:
                  "You can force a height for the editor by passing `height:500` (same for width) "
              })}
              {renderToggle({
                that: this,
                type: "setDefaultVisibilities",
                label: "Set Default Visibilities",
                hook: shouldUpdate => {
                  shouldUpdate &&
                    updateEditor(store, "DemoEditor", {
                      annotationVisibility: {
                        features: false,
                        primers: false,
                        // parts: false,
                        cutsites: false
                        // orfTranslations: false
                      }
                    });
                }
              })}
              <strong>Editor Options:</strong>
              {renderToggle({
                that: this,
                type: "readOnly",
                hook: readOnly => {
                  updateEditor(store, "DemoEditor", {
                    readOnly
                  });
                }
              })}
              {renderToggle({
                description: `Any panel can be programatically focused from outside the editor. 
Here is how to do that for the linear view:
\`\`\`js
store.dispatch(
  actions.setPanelAsActive("rail", { editorName: "DemoEditor" })
); 
\`\`\`
other options are: 
\`\`\`
"digestTool"
"circular"
"rail"
"sequence"
"properties"
\`\`\`
              `,
                onClick: this.setLinearPanelAsActive,
                isButton: true,
                that: this,
                label: "Focus Linear View"
              })}
              {renderToggle({
                onClick: () => {
                  updateEditor(store, "DemoEditor", {
                    selectionLayer: { start: 30, end: 59 }
                  });
                },
                isButton: true,
                that: this,
                label: "Set A Selection"
              })}
              {renderToggle({ that: this, type: "withPreviewMode" })}
              {renderToggle({ that: this, type: "shouldAutosave" })}
              {renderToggle({ that: this, type: "showMenuBar" })}
              {renderToggle({ that: this, type: "displayMenuBarAboveTools" })}
              {renderToggle({ that: this, type: "disableSetReadOnly" })}
              {renderToggle({ that: this, type: "showReadOnly" })}
              {renderToggle({ that: this, type: "clickOverridesExample" })}
              {renderToggle({ that: this, type: "showCircularity" })}
              {renderToggle({ that: this, type: "showAvailability" })}
              {renderToggle({ that: this, type: "isFullscreen" })}
              {renderToggle({
                that: this,
                type: "isProtein",
                hook: isProtein => {
                  isProtein
                    ? updateEditor(store, "DemoEditor", {
                        readOnly: false,
                        sequenceData: tidyUpSequenceData(exampleProteinData, {
                          convertAnnotationsFromAAIndices: true
                        })
                      })
                    : updateEditor(store, "DemoEditor", {
                        readOnly: false,
                        sequenceData: exampleSequenceData
                      });
                }
              })}
              <strong>Editor Handlers: </strong>
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
                type: "onDelete",
                description:
                  "This onDelete callback is for deletion of the *entire* sequence from the menu bar. OVE has no default handler for full sequence delete"
              })}
              {renderToggle({
                that: this,
                label: "beforeSequenceInsertOrDelete (Alter changed sequence)",
                type: "beforeSequenceInsertOrDelete",
                description: `
The beforeSequenceInsertOrDelete handler can be used to 
override the values being used in the insertion/deletion
\`\`\`
beforeSequenceInsertOrDelete: (
  sequenceDataToInsert,
  existingSequenceData,
  caretPositionOrRange
) => {
  return {
    // you can return one or more of the following to override the values used
    sequenceDataToInsert: myFilterSequenceDataToInsertFn(sequenceDataToInsert),
    existingSequenceData: myFilterExistingSeqFn(sequenceDataToInsert,caretPositionOrRange),
    caretPositionOrRange: myChangeCaretPosFn(caretPositionOrRange)
  }
}
\`\`\`
`
              })}
              {renderToggle({
                that: this,
                type: "onCopy"
              })}
              {renderToggle({
                that: this,
                type: "onPaste"
              })}
              <br />
              <br />
            </div>
          )}
          {/* <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              ...(this.state.showDemoOptions && { paddingLeft: 250 })
            }}
          > */}
          <Editor
            style={{
              // display: "flex",
              // flexDirection: "column",
              // flexGrow: 1,
              ...(this.state.showDemoOptions && { paddingLeft: 250 })
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
            {...this.state.beforeSequenceInsertOrDelete && {
              beforeSequenceInsertOrDelete: (
                sequenceDataToInsert,
                existingSequenceData,
                caretPositionOrRange
              ) => {
                window.toastr.info("beforeSequenceInsertOrDelete triggered");
                if (!sequenceDataToInsert.size) return; //if it is a delete, just return early
                return {
                  //override the sequenceDataToInsert
                  sequenceDataToInsert: {
                    ...sequenceDataToInsert,
                    parts: [
                      ...sequenceDataToInsert.parts,
                      {
                        name: "CHANGED_SEQUENCE",
                        start: 0,
                        end: sequenceDataToInsert.size - 1
                      }
                    ]
                  },
                  //override the existingSequenceData
                  existingSequenceData: {
                    ...existingSequenceData,
                    ...["parts", "features", "primers"].reduce((acc, key) => {
                      const annotations = existingSequenceData[key];
                      acc[key] = annotations.filter(
                        a =>
                          !isRangeOrPositionWithinRange(
                            caretPositionOrRange,
                            a,
                            existingSequenceData.size
                          )
                      );
                      return acc;
                    }, {})
                  }
                };
              }
            }}
            {...this.state.onCopy && {
              onCopy: function(/* event, copiedSequenceData, editorState */) {
                window.toastr.success("onCopy callback triggered");

                // console.info(editorState);
                // //the copiedSequenceData is the subset of the sequence that has been copied in the teselagen sequence format
                // const clipboardData = event.clipboardData;
                // clipboardData.setData(
                //   "text/plain",
                //   copiedSequenceData.sequence
                // );
                // clipboardData.setData(
                //   "application/json",
                //   //for example here you could change teselagen parts into jbei parts
                //   JSON.stringify(copiedSequenceData)
                // );
                // event.preventDefault();
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
            {...this.state.overrideAddEditFeatureDialog &&
              this.overrideAddEditFeatureDialogExample}
            {...this.state.clickOverridesExample && this.clickOverridesExample}
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
