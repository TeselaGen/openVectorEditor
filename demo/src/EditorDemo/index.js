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
import { connectToEditor } from "../../../src";

const MyCustomTab = connectToEditor(({ sequenceData = {} }) => {
  //you can optionally grab additional editor data using the exported connectToEditor function
  return {
    sequenceData
  };
})(function(props) {
  console.info("These are the props passed to our Custom Tab:", props);
  return (
    <div>
      <h3>Hello World, I am a Custom Tab</h3>
      <h4>sequenceLength: {props.sequenceData.sequence.length}</h4>
    </div>
  );
});

const defaultState = {
  hideSingleImport: false,
  readOnly: false,
  showMenuBar: true,
  customizeTabs: false,
  displayMenuBarAboveTools: true,
  withPreviewMode: false,
  disableSetReadOnly: false,
  showReadOnly: true,
  showCircularity: true,
  showGCContent: false,
  GCDecimalDigits: 1,
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
  withVersionHistory: true,
  setDefaultVisibilities: false,
  onNew: true,
  onImport: true,
  onSave: true,
  onSaveAs: false,
  onRename: true,
  onDuplicate: true,
  onSelectionOrCaretChanged: false,
  onCreateNewFromSubsequence: false,
  onDelete: true,
  beforeSequenceInsertOrDelete: false,
  maintainOriginSplit: false,
  maxAnnotationsToDisplayAdjustment: false,
  onCopy: true,
  onPaste: true
};

export default class EditorDemo extends React.Component {
  constructor(props) {
    super(props);
    setupOptions({ that: this, defaultState, props });
    window.ove_updateEditor = vals => {
      updateEditor(store, "DemoEditor", vals);
    };
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
        { name: "Custom", Comp: MyCustomTab },
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
      withVersionHistory,
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
            flexGrow: "1",
            minHeight: 0
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
                icon="refresh"
                style={{ marginLeft: 10, marginRight: 10 }}
                onClick={this.resetDefaultState}
              >
                Reset Demo Defaults
              </Button>

              {renderToggle({
                info: `
You can change the sequence in a given <Editor/> by calling: 
\`\`\`js
updateEditor(store, "DemoEditor", {
  sequenceDataHistory: {},
  sequenceData: generateSequenceData() //update with random seq data!
});
\`\`\`

              `,
                onClick: () => {
                  updateEditor(store, "DemoEditor", {
                    sequenceDataHistory: {},
                    sequenceData: generateSequenceData()
                  });
                },
                isButton: true,
                that: this,
                label: "Randomize Sequence Data"
              })}
              {renderToggle({
                that: this,
                type: "isProtein",
                info: `
The editor supports Amino Acid sequences as well as DNA sequences!
Protein sequence mode is enabled by calling updateEditor with a protein sequenceData object: 
\`\`\`
updateEditor(store, "DemoEditor", {
  readOnly: false,
  sequenceData: tidyUpSequenceData(exampleProteinData, {
    convertAnnotationsFromAAIndices: true
  })
})
\`\`\`
the protein sequenceData object should look like so
\`\`\`
{
	isProtein: true
	//either or both .proteinSequence (aa string) or .sequence (dna string) must be provided if isProtein: true
	//if only .sequence is provided, OVE will automatically compute the amino acids from the provided dna sequence
	//if only .proteinSequence is provided, OVE will automatically compute the degenerate DNA sequence from the provided aa string
	//if both .proteinSequence and .sequence are provided, then OVE will assume that the underlying 
	//dna sequence maps to the provided aa string as long as sequence.length === 3 * proteinSequence.length
	proteinSequence: "mmhlrlfcillaavs...etc"
	sequence: "gtagagagagcca...etc" //optional!
	//if features or parts are provided to the editor, it is assumed that they will indexed to the underlying DNA sequence (0-based inclusive) , not to the AA indices . 
	//You can use the helper util from ve-sequence-utils tidyUpSequenceData to convertAnnotationsFromAAIndices if your protein data has 
	//features/parts coming in as AA-indexed
	features: [{name: "testFeature1", 
		start: 3, //start on AA 1
		end: 5 //end on AA 1 
	}],
	parts: [{
		name: "myFakePart"
		start: 0, //start on AA 0
		end: 11 //end on AA 3 
	}]
}
\`\`\`

The usual onSave, onCopy, onCut handlers will now come back with a .proteinSequence field. 
You'll need to save/manipulate the protein sequence data however you do for dna sequences.

certain dna specific tools and annotations are automatically disabled when isProtein=true :
 - primers
 - orfs
 - translations 
 - cutsites
 - sequence digestions 
 - ...etc


                `,
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

              {renderToggle({
                that: this,
                label: "Customize tool bar",
                type: "overrideToolbarOptions",
                info: `//This is an example of how to pass custom tool overrides:
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
                          },
                          {
                            id: "myCustomTab",
                            name: "My Custom Tab"
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
                info: `//The positions of the tabs shown in the editor can be changed programatically:
\`\`\`js
//override the panelsShown redux state adding your custom tab wherever you see fit:
updateEditor(store, "DemoEditor", {
  panelsShown: [ 
    [ //the first row of tabs
      {
        id: "rail",
        name: "Linear Map",
        active: true
      },
      {
        id: "myCustomTabId",
        name: "My Custom Tab",
        //canClose: true //optionally make it closeable
      }
    ],
    [ //the second row of tabs
      {
        id: "sequence",
        name: "Sequence Map",
      },
      {
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

//create the custom tab component:
const MyCustomTab = connectToEditor(({ sequenceData = {} }) => {
  //you can optionally grab additional editor data using the exported connectToEditor function 
  return {
    sequenceData
  };
})(function(props) {
  console.info("These are the props passed to our Custom Tab:", props);
  return (
    <div>
      <h3>Hello World, I am a Custom Tab</h3>
      <h4>sequenceLength: {props.sequenceData.sequence.length}</h4>
    </div>
  );
});

//and pass the custom tab component to the editor via the panelMap prop such that the key matches the panel id:
<Editor panelMap={{ 
  myCustomTabId: MyCustomTab
}} />
\`\`\`
`
              })}
              {renderToggle({
                that: this,
                label: "Customize property tabs",
                type: "propertiesOverridesExample",
                info: `//The panels shown in the properties tab can be customized. 
                Here is an example of how to pass Properties overrides
\`\`\`js

PropertiesProps: {
  propertiesList: [
    {name: "Custom", Comp: MyCustomTab},
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

const MyCustomTab = connectToEditor(({ sequenceData = {} }) => {
  //you can optionally grab additional editor data using the exported connectToEditor function 
  return {
    sequenceData
  };
})(function(props) {
  console.info("These are the props passed to our Custom Tab:", props);
  return (
    <div>
      <h3>Hello World, I am a Custom Tab</h3>
      <h4>sequenceLength: {props.sequenceData.sequence.length}</h4>
    </div>
  );
});

\`\`\`
`
              })}
              {renderToggle({
                that: this,
                label: "Customize menu bar",
                type: "menuOverrideExample",
                info: `The top menu bar can be customized as desired. 
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
                info: `You'll need to pass an entire component override to the editor like so:
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
                info: `If enabled, right clicking a part will fire a custom alert. 
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
                info:
                  "You can force a height for the editor by passing `height:500` (same for width) "
              })}
              {renderToggle({
                that: this,
                type: "withVersionHistory",
                label: "Include Revision History Tool",
                info: `
To show the version history (File > Revision History), pass two handlers: 
\`\`\`
getSequenceAtVersion: async versionId => {
  //the returned sequenceData should be in Teselagen Json format
  return await getSequenceFromBackendAtId(versionId)
},
getVersionList: async () => {
  return await getVersionListFromBackend()
  //this should return an array with this structure: 
  [
    {
      dateChanged: "12/30/2211",
      editedBy: "Nara",
      revisionType: "Sequence Deletion",
      versionId: 2
    },
    {
      dateChanged: "8/30/2211",
      editedBy: "Ralph",
      revisionType: "Feature Edit",
      versionId: 3
    }
  ];
}
\`\`\`
                  `
              })}
              {renderToggle({
                that: this,
                info: `
You can set default visibilities like so: 
\`\`\
updateEditor(store, "DemoEditor", {
  annotationVisibility: {
    features: false,
    primers: false,
    // parts: false,
    cutsites: false
    // orfTranslations: false
  }
});
\`\`\`
                `,
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
              {renderToggle({
                that: this,
                type: "showWarningFeature",
                label: "Show Warnings/Errors in Editor",
                description: `
Warnings can be displayed directly in the editor like so: 
\`\`\`
sequenceData: {
  ...allTheNormalThings,
  warnings: [
    {
      id: "error1",
      name: "J5 Error",
      message: "I'm a fake error!",
      start: 10,
      end: 400,
      labelColor: "red",
      color: "red"
    },
    {
      id: "error2",
      name: "J5 Warning",
      message: "I'm a fake warning!",
      start: 600,
      end: 950,
      labelColor: "gold",
      color: "yellow"
    }
  ]
}
\`\`\`
`,
                hook: shouldUpdate => {
                  updateEditor(store, "DemoEditor", {
                    sequenceData: {
                      ...exampleSequenceData,
                      warnings: shouldUpdate
                        ? [
                            {
                              id: "error1",
                              name: "J5 Error",
                              message: "I'm a fake error!",
                              start: 10,
                              end: 400,
                              labelColor: "red",
                              color: "red"
                            },
                            {
                              id: "error2",
                              name: "J5 Warning",
                              message: "I'm a fake warning!",
                              start: 600,
                              end: 950,
                              labelColor: "gold",
                              color: "yellow"
                            }
                          ]
                        : []
                    }
                  });
                }
              })}
              {renderToggle({
                that: this,
                type: "showLineageAnnotations",
                label: "Show Lineage Annotations in Editor",
                description: `
Warnings can be displayed directly in the editor like so: 
\`\`\`
sequenceData: {
  ...allTheNormalThings,
  lineageAnnotations: [
    {
      id: "22oing211",
      name: "Lineage Annotation 1",
      start: 900,
      end: 400,
      labelColor: "green",
      color: "green"
    },
    {
      id: "18711jja1",
      name: "Lineage Annotation 2",
      start: 401,
      end: 899,
      labelColor: "blue",
      color: "blue"
    }
  ]
}
\`\`\`
`,

                hook: shouldUpdate => {
                  shouldUpdate &&
                    updateEditor(store, "DemoEditor", {
                      sequenceData: {
                        ...exampleSequenceData,
                        lineageAnnotations: shouldUpdate
                          ? [
                              {
                                id: "22oing211",
                                name: "Lineage Annotation 1",
                                start: 900,
                                end: 400,
                                labelColor: "green",
                                color: "green"
                              },
                              {
                                id: "18711jja1",
                                name: "Lineage Annotation 2",
                                start: 401,
                                end: 899,
                                labelColor: "blue",
                                color: "blue"
                              }
                            ]
                          : []
                      }
                    });
                }
              })}
              {renderToggle({
                that: this,
                type: "showAssemblyPieces",
                label: "Show AssemblyPieces  in Editor",
                description: `
Warnings can be displayed directly in the editor like so: 
\`\`\`
sequenceData: {
  ...allTheNormalThings,
  assemblyPieces: [
    {
      id: "22oing211",
      name: "Assembly Piece 1",
      start: 900,
      end: 400,
      labelColor: "green",
      color: "green"
    },
    {
      id: "18711jja1",
      name: "Assembly Piece 2",
      start: 401,
      end: 899,
      labelColor: "blue",
      color: "blue"
    }
  ]
}
\`\`\`
`,

                hook: shouldUpdate => {
                  updateEditor(store, "DemoEditor", {
                    sequenceData: {
                      ...exampleSequenceData,
                      assemblyPieces: shouldUpdate
                        ? [
                            {
                              id: "22oing211",
                              name: "Assembly Piece 1",
                              start: 900,
                              end: 400,
                              labelColor: "darkorange",
                              color: "darkorange"
                            },
                            {
                              id: "18711jja1",
                              name: "Assembly Piece 2",
                              start: 401,
                              end: 899,
                              labelColor: "darkblue",
                              color: "darkblue"
                            }
                          ]
                        : []
                    }
                  });
                }
              })}
              {renderToggle({
                that: this,
                type: "hideSingleImport",
                description: `You can hide the option to have single files be imported directly into the editor`
              })}
              {renderToggle({
                that: this,
                type: "readOnly",
                hook: readOnly => {
                  updateEditor(store, "DemoEditor", {
                    readOnly
                  });
                },
                description: `The editor can be put into readOnly mode like so: 
\`\`\`
updateEditor(store, "DemoEditor", {
  readOnly
});
\`\`\`
`
              })}
              {renderToggle({
                info: `Any panel can be programatically focused from outside the editor. 
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
                label: "Set A Selection",
                info: `
You can programatically update the editor like so:                 
\`\`\`
updateEditor(store, "DemoEditor", {
  selectionLayer: { start: 30, end: 59 }
});
\`\`\`
              
                `
              })}
              {renderToggle({
                that: this,
                type: "withPreviewMode",
                info: `
passing withPreviewMode=true to <Editor> causes the editor to first show up as a preview with the option to open the full editor (in fullscreen mode by default)
            `
              })}
              {renderToggle({
                that: this,
                type: "shouldAutosave",
                info: `
passing shouldAutosave=true to <Editor> causes the editor to automatically 
trigger the onSave() callback without first waiting for the user to hit "Save"
`
              })}
              {renderToggle({
                that: this,
                type: "showMenuBar",
                info: `
hide or show the menubar (false by default)
`
              })}
              {renderToggle({
                that: this,
                type: "displayMenuBarAboveTools",
                info: `display the menubar above the toolbar or on the same line (true by default)`
              })}
              {renderToggle({
                that: this,
                type: "disableSetReadOnly",
                info: `pass disableSetReadOnly=true to the <Editor> to not give users the option to change between read-only <--> editable mode, false by default`
              })}
              {renderToggle({
                that: this,
                type: "showReadOnly",
                info: `pass showReadOnly=false to the <Editor> to not display the read-only <--> editable mode toggle, true by default`
              })}
              {renderToggle({
                that: this,
                type: "clickOverridesExample",
                info: `
you can pass clickOverrides to the <Editor> like so:
\`\`\`
clickOverrides: {
  featureClicked: ({ event }) => {
    //do whatever 
    window.toastr.success("Feature Click Override Hit!");
    event.stopPropagation();
    return true; //returning truthy stops the regular click action from occurring
  },
  partClicked: () => {
    window.toastr.success("Part Click Override Hit!");
    //by default (aka returning falsy) the usual click action occurs
  }
}
\`\`\`
`
              })}
              {renderToggle({
                that: this,
                type: "showCircularity",
                info: `pass showCircularity=false to the <Editor> to not display the circularity toggle`
              })}
              {renderToggle({
                that: this,
                type: "showAvailability",
                info: `pass showAvailability=false to the <Editor> to not display the availability toggle`
              })}
              {renderToggle({
                that: this,
                type: "showGCContent",
                info: `pass showGCContent=true to the <Editor> to display the %GC content. You'll need to select some DNA bps to see it in the status bar!`
              })}
              {renderToggle({
                that: this,
                type: "maxAnnotationsToDisplayAdjustment",
                info: `pass maxAnnotationsToDisplay={{features: 5}} to the <Editor> to adjust the maximum number of features to display to 5 (for example). Primers, cutsites and parts can also be adjusted`
              })}
              {renderToggle({
                that: this,
                type: "isFullscreen",
                info: `pass isFullscreen=true to the <Editor> to force the editor to fill the window`
              })}

              <strong>Editor Handlers: </strong>
              {renderToggle({
                that: this,
                type: "onNew"
              })}
              {renderToggle({
                that: this,
                type: "onImport"
              })}
              {renderToggle({
                that: this,
                type: "onSave"
              })}
              {renderToggle({
                that: this,
                type: "onSaveAs"
              })}
              {renderToggle({
                that: this,
                type: "alwaysAllowSave"
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
                type: "onSelectionOrCaretChanged"
              })}
              {renderToggle({
                that: this,
                type: "onCreateNewFromSubsequence",
                info:
                  "Passing a onCreateNewFromSubsequence handler will add the option for the user to create a new sequence from a selection of the sequence. The handler implementer will need to handle the actual steps that follow this"
              })}
              {renderToggle({
                that: this,
                type: "onDelete",
                info:
                  "This onDelete callback is for deletion of the *entire* sequence from the menu bar. OVE has no default handler for full sequence delete"
              })}
              {renderToggle({
                that: this,
                label: "beforeSequenceInsertOrDelete (Alter changed sequence)",
                type: "beforeSequenceInsertOrDelete",
                info: `
The beforeSequenceInsertOrDelete handler can be used to 
override the values being used in the insertion/deletion
\`\`\`
beforeSequenceInsertOrDelete: (
  sequenceDataToInsert,
  existingSequenceData,
  caretPositionOrRange,
  // the maintainOriginSplit option will be passed in as TRUE on complement/revComp actions (delete --> insert at start of selection and wrap around origin)
  // and FALSE on replace actions (delete --> insert at end of selection)
  options // {maintainOriginSplit: true} 
) => {
  return {
    // you can return one or more of the following to override the values used
    sequenceDataToInsert: myFilterSequenceDataToInsertFn(sequenceDataToInsert),
    existingSequenceData: myFilterExistingSeqFn(sequenceDataToInsert,caretPositionOrRange),
    caretPositionOrRange: myChangeCaretPosFn(caretPositionOrRange),
    options
  }
}
\`\`\`
`
              })}
              {renderToggle({
                that: this,
                disabled: !this.state.beforeSequenceInsertOrDelete,
                type: "maintainOriginSplit",
                label: "maintainOriginSplit (when pasting text)",
                info: `
This feature requires beforeSequenceInsertOrDelete toggle to be true to be enabled.  See the description and code example for beforeSequenceInsertOrDelete to use this feature.
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
            panelMap={{
              myCustomTab: MyCustomTab
            }}
            style={{
              // display: "flex",
              // flexDirection: "column",
              // flexGrow: 1,
              ...(this.state.showDemoOptions && { paddingLeft: 250 })
            }}
            {...(this.state.readOnly && { readOnly: true })}
            editorName="DemoEditor"
            maxAnnotationsToDisplay={
              this.state.maxAnnotationsToDisplayAdjustment
                ? { features: 5 }
                : {}
            }
            showMenuBar={this.state.showMenuBar}
            hideSingleImport={this.state.hideSingleImport}
            displayMenuBarAboveTools={this.state.displayMenuBarAboveTools}
            {...(this.state.onNew && {
              onNew: () => window.toastr.success("onNew callback triggered")
            })}
            {...(this.state.onImport && {
              onImport: sequence => {
                window.toastr.success(
                  `onImport callback triggered for sequence: ${sequence.name}`
                );
                return sequence;
              }
            })}
            {...(this.state.onSave && {
              onSave: function(
                opts,
                sequenceDataToSave,
                editorState,
                onSuccessCallback
              ) {
                window.toastr.success("onSave callback triggered");
                console.info("opts:", opts);
                console.info("sequenceData:", sequenceDataToSave);
                console.info("editorState:", editorState);
                // To disable the save button after successful saving
                // either call the onSuccessCallback or return a successful promise :)
                onSuccessCallback();
                //or
                // return myPromiseBasedApiCall()
              }
            })}
            {...(this.state.onSaveAs && {
              onSaveAs: function(
                opts,
                sequenceDataToSave,
                editorState,
                onSuccessCallback
              ) {
                window.toastr.success("onSaveAs callback triggered");
                console.info("opts:", opts);
                console.info("sequenceData:", sequenceDataToSave);
                console.info("editorState:", editorState);
                // To disable the save button after successful saving
                // either call the onSuccessCallback or return a successful promise :)
                onSuccessCallback();
                //or
                // return myPromiseBasedApiCall()
              }
            })}
            {...(this.state.alwaysAllowSave && {
              alwaysAllowSave: true
            })}
            {...(this.state.onRename && {
              onRename: newName =>
                window.toastr.success("onRename callback triggered: " + newName)
            })}
            {...(this.state.onDuplicate && {
              onDuplicate: () =>
                window.toastr.success("onDuplicate callback triggered")
            })}
            {...(this.state.onSelectionOrCaretChanged && {
              onSelectionOrCaretChanged: ({ caretPosition, selectionLayer }) =>
                window.toastr.success(
                  `onSelectionOrCaretChanged callback triggered caretPosition:${caretPosition}    selectionLayer: start: ${selectionLayer.start} end:  ${selectionLayer.end} `
                )
            })}
            {...(this.state.onCreateNewFromSubsequence && {
              onCreateNewFromSubsequence: (selectedSeqData, props) => {
                console.info(selectedSeqData, props);
                window.toastr.success(
                  "onCreateNewFromSubsequence callback triggered"
                );
              }
            })}
            {...(this.state.onDelete && {
              onDelete: () =>
                window.toastr.success("onDelete callback triggered")
            })}
            {...(this.state.beforeSequenceInsertOrDelete && {
              beforeSequenceInsertOrDelete: (
                sequenceDataToInsert,
                existingSequenceData,
                caretPositionOrRange,
                options = {
                  maintainOriginSplit: this.state.maintainOriginSplit
                }
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
                  },
                  options
                };
              }
            })}
            {...(this.state.onCopy && {
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
            })}
            {...(this.state.onPaste && {
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
            })}
            handleFullscreenClose={
              !withPreviewMode && this.changeFullscreenMode
            } //don't pass this handler if you're also using previewMode
            isFullscreen={isFullscreen}
            // handleFullscreenClose={() => {
            //   console.info("ya");
            // }} //don't pass this handler if you're also using previewMode
            shouldAutosave={shouldAutosave}
            {...(forceHeightMode && { height: 500 })}
            {...(withVersionHistory && {
              getSequenceAtVersion: versionId => {
                if (versionId === 2) {
                  return {
                    sequence: "thomaswashere"
                  };
                } else if ((versionId = 3)) {
                  return {
                    features: [{ start: 4, end: 6 }],
                    sequence:
                      "GGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacacccccc"
                  };
                } else {
                  console.error("we shouldn't be here...");
                  return {
                    sequence: "taa"
                  };
                }
              },
              getVersionList: () => {
                return [
                  {
                    dateChanged: "12/30/2211",
                    editedBy: "Nara",
                    // revisionType: "Sequence Deletion",
                    versionId: 2
                  },
                  {
                    dateChanged: "8/30/2211",
                    editedBy: "Ralph",
                    // revisionType: "Feature Edit",
                    versionId: 3
                  }
                ];
              }
            })}
            withPreviewMode={withPreviewMode}
            disableSetReadOnly={this.state.disableSetReadOnly}
            showReadOnly={this.state.showReadOnly}
            showCircularity={this.state.showCircularity}
            showGCContent={this.state.showGCContent}
            GCDecimalDigits={this.state.GCDecimalDigits}
            showAvailability={this.state.showAvailability}
            maintainOriginSplit={
              this.state.beforeSequenceInsertOrDelete
                ? this.state.maintainOriginSplit
                : false
            }
            {...(this.state.overrideRightClickExample &&
              this.rightClickOverridesExample)}
            {...(this.state.overrideAddEditFeatureDialog &&
              this.overrideAddEditFeatureDialogExample)}
            {...(this.state.clickOverridesExample &&
              this.clickOverridesExample)}
            {...(this.state.propertiesOverridesExample &&
              this.propertiesOverridesExample)}
            {...(this.state.overrideToolbarOptions &&
              this.toolbarOverridesExample)}
            {...(this.state.menuOverrideExample && this.menuOverrideExample)}
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
