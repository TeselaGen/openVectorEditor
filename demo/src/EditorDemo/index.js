import { Button, Icon, InputGroup } from "@blueprintjs/core";
import { generateSequenceData, tidyUpSequenceData } from "ve-sequence-utils";
import React from "react";
import { isRangeOrPositionWithinRange } from "ve-range-utils";
import isMobile from "is-mobile";

import store from "./../store";
import { updateEditor, actions } from "../../../src/";

import Editor from "../../../src/Editor";
import renderToggle from "./../utils/renderToggle";
import { setupOptions, setParamsIfNecessary } from "./../utils/setupOptions";
import exampleSequenceData from "./../exampleData/exampleSequenceData";
import AddEditFeatureOverrideExample from "./AddEditFeatureOverrideExample";
import exampleProteinData from "../exampleData/exampleProteinData";
import { connectToEditor } from "../../../src";
import { showConfirmationDialog } from "teselagen-react-components";
import {
  autoAnnotateFeatures,
  autoAnnotateParts,
  autoAnnotatePrimers
} from "../../../addons/AutoAnnotate/src";
import { startCase } from "lodash";
import pluralize from "pluralize";
import { useEffect, useState } from "react";
import _chromData from "../../../scratch/ab1ParsedGFPvv50.json";
import { convertBasePosTraceToPerBpTrace } from "bio-parsers";
// import AddOrEditPrimerDialog from "../../../src/helperComponents/AddOrEditPrimerDialog";
// import _chromData from "../../../scratch/B_reverse.json";
// import example1Ab1 from "../../../scratch/example1.ab1.json";
const chromData = convertBasePosTraceToPerBpTrace(_chromData);

const MyCustomTab = connectToEditor(({ sequenceData = {} }) => {
  //you can optionally grab additional editor data using the exported connectToEditor function
  return {
    sequenceData
  };
})(function (props) {
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
  showMoleculeType: true,
  showGCContentByDefault: false,
  GCDecimalDigits: 1,
  onlyShowLabelsThatDoNotFit: true,
  overrideToolbarOptions: false,
  menuOverrideExample: false,
  propertiesOverridesExample: false,
  overrideRightClickExample: false,
  overrideAddEditFeatureDialog: false,
  clickOverridesExample: false,
  showAvailability: true,
  showCicularViewInternalLabels: true,
  showDemoOptions: !isMobile(),
  shouldAutosave: false,
  generatePng: false,
  allowPanelTabDraggable: true,
  isFullscreen: false,
  isProtein: false,
  forceHeightMode: false,
  adjustCircularLabelSpacing: false,
  nameFontSizeCircularView: false,
  withVersionHistory: true,
  withRotateCircularView: true,
  withZoomCircularView: true,
  setDefaultVisibilities: false,
  onNew: true,
  onImport: true,
  beforeAnnotationCreate: true,
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
  truncateLabelsThatDoNotFit: true,
  withPartTags: true,
  onCopy: true,
  onPaste: true
};

export default class EditorDemo extends React.Component {
  constructor(props) {
    super(props);
    setupOptions({ that: this, defaultState, props });
    window.ove_updateEditor = (vals) => {
      updateEditor(store, "DemoEditor", vals);
    };
    window.ove_getEditorState = () => {
      return store.getState().VectorEditor["DemoEditor"];
    };
    updateEditor(store, "DemoEditor", {
      readOnly: false,
      sequenceData: exampleSequenceData
    });
  }
  componentDidUpdate() {
    setParamsIfNecessary({ that: this, defaultState });
  }

  changeFullscreenMode = (e) =>
    this.setState({
      isFullscreen: e.target.checked
    });
  changeReadOnly = (e) =>
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
      partRightClicked: (items, { annotation }, { sequenceData }) => {
        return [
          ...items,
          {
            text: `My Part Override - ${annotation.name} - ${sequenceData.sequence.length}`,
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
  getCustomAutoAnnotateList = async ({ annotationType, sequenceData }) => {
    // const dataToReturn = await fetch("/my/endpoint/here", { ...someParams });
    await sleep(1000);
    if (annotationType !== "feature") return false;
    await sleep(1000);

    return {
      title: `My ${pluralize(startCase(annotationType))}`,
      list: [
        {
          name: "I cover the full Seq",
          sequence: sequenceData.sequence,
          id: "1"
        },
        { name: "trypto", type: "cds", sequence: "agagagagagaga", id: "9" },
        { name: "prom2", type: "promoter", sequence: "gcttctctctc", id: "10" },
        {
          name: "prom2",
          type: "promoter",
          sequence: "gctt.*ctctctc",
          isRegex: true,
          id: "10"
        }
      ]
    };
  };
  menuOverrideExample = {
    menuFilter:
      // Menu customization example
      (menuDef) => {
        menuDef.push({ text: "Custom", submenu: ["copy"] });
        menuDef[0].submenu
          .find((i) => i.text && i.text.includes("Export"))
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
        "partTool",
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
  extraAnnotationPropsExample = {
    extraAnnotationProps: {
      part: (annotation) => {
        return {
          customName: `${annotation.name} (digest)`,
          fivePrimeOverhang: "tgca",
          threePrimeUnderhang: "gcgc"
        };
      }
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
      passAutoAnnotateHandlers,
      withAutoAnnotateAddon,
      withGetCustomAutoAnnotateList,
      adjustCircularLabelSpacing,
      withVersionHistory,
      shouldAutosave,
      generatePng,
      isFullscreen,
      withPreviewMode
    } = this.state;

    const isNotDna =
      this.state.moleculeType === "RNA" ||
      this.state.moleculeType === "Protein";

    const editorHandlers = [
      renderToggle({
        that: this,
        type: "onNew"
      }),
      renderToggle({
        that: this,
        type: "onImport"
      }),
      renderToggle({
        that: this,
        type: "beforeAnnotationCreate",
        info: "Pass a beforeAnnotationCreate to do additional actions before the annotation is created/edited. Return false to cancel the create/edit. It will be passed all the props the edit annotation dialog receives."
      }),
      renderToggle({
        that: this,
        type: "allowMultipleFeatureDirections",
        label: "allowMultipleFeatureDirections (multiple arrowheadTypes)",
        info: "Pass allowMultipleFeatureDirections=true to the Editor to allow for bidirectional and non-directional features as well as the standard forward and reverse orientations"
      }),
      renderToggle({
        that: this,
        type: "onSave"
      }),
      renderToggle({
        that: this,
        type: "onSaveAs"
      }),
      renderToggle({
        that: this,
        type: "alwaysAllowSave"
      }),
      renderToggle({
        that: this,
        type: "generatePng",
        info: "Passing generatePng=true will cause a .png image of the map to be output for optional download within the onSave handler (It will be returned as part of the first argument of the onSave handler under the key 'pngFile')."
      }),
      renderToggle({
        that: this,
        type: "onRename"
      }),
      renderToggle({
        that: this,
        type: "withGetAdditionalCreateOpts"
      }),
      renderToggle({
        that: this,
        type: "onConfigureFeatureTypesClick"
      }),
      renderToggle({
        that: this,
        type: "onHiddenEnzymeAdd"
      }),
      renderToggle({
        that: this,
        type: "onDuplicate"
      }),
      renderToggle({
        that: this,
        type: "onSelectionOrCaretChanged"
      }),
      renderToggle({
        that: this,
        type: "onCreateNewFromSubsequence",
        info: "Passing a onCreateNewFromSubsequence handler will add the option for the user to create a new sequence from a selection of the sequence. The handler implementer will need to handle the actual steps that follow this"
      }),
      renderToggle({
        that: this,
        type: "onDelete",
        info: "This onDelete callback is for deletion of the *entire* sequence from the menu bar. OVE has no default handler for full sequence delete"
      }),
      renderToggle({
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
      }),
      renderToggle({
        that: this,
        type: "defaultLinkedOligoMessage",
        info: "Pass an overriding oligo message here if you'd like. Requires allowPrimerBasesToBeEdited to be toggled as well on the demo page"
      }),
      renderToggle({
        that: this,
        disabled: !this.state.beforeSequenceInsertOrDelete,
        type: "maintainOriginSplit",
        label: "maintainOriginSplit (when pasting text)",
        info: `
This feature requires beforeSequenceInsertOrDelete toggle to be true to be enabled.  See the description and code example for beforeSequenceInsertOrDelete to use this feature.
\`\`\`
`
      }),
      renderToggle({
        that: this,
        type: "onCopy"
      }),
      renderToggle({
        that: this,
        type: "onPaste"
      })
    ].filter((i) => i);
    return (
      <React.Fragment>
        {/* <AutoAnnotateModal editorName={"DemoEditor"}></AutoAnnotateModal> */}
        {/* <button onClick={() => {
          const dragSource = document.querySelector(".veTabLinearMap")
    const dropTarget = document.querySelector(".veTabProperties")
          dragMock.dragStart(dragSource).dragEnter(dropTarget).dragOver(dropTarget).delay(500).dragEnd()
        }}>click me!</button> */}
        <div style={{ width: 250 }}>
          {renderToggle({
            that: this,
            alwaysShow: true,
            type: "showDemoOptions",
            label: "Show Demo Options",
            hotkey: `cmd+'`
          })}
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
          {
            <div
              data-test="optionContainer"
              className="tgOptionContainer"
              style={{
                ...(!this.state.showDemoOptions && {
                  display: "none",
                  width: 0,
                  height: 0,
                  minWidth: 0,
                  maxWidth: 0
                })
              }}
            >
              <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                <Button
                  icon="refresh"
                  minimal
                  style={{ marginLeft: 10, marginRight: 10, marginBottom: 5 }}
                  onClick={this.resetDefaultState}
                >
                  Reset Demo Defaults
                </Button>
                <InputGroup
                  round
                  rightElement={
                    this.state.searchInput ? (
                      <Button
                        onClick={() => {
                          this.setState({ searchInput: "" });
                        }}
                        minimal
                        small
                        icon="cross"
                      ></Button>
                    ) : null
                  }
                  leftIcon="filter"
                  placeholder="Search Options.."
                  value={this.state.searchInput || ""}
                  onChange={(e) => {
                    this.setState({ searchInput: e.target.value });
                  }}
                />
              </div>

              {renderToggle({
                type: "randomizeSeqData",
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
                isSelect: true,
                options: ["DNA", "RNA", "Protein", "mixedRnaAndDna", "Oligo"],
                that: this,
                label: "Molecule Type:",
                type: "moleculeType",
                info: `
The editor supports Amino Acid sequences and RNA sequences as well as DNA sequences and!

Trigger the different modes with these flags:
isProtein
isRna
isOligo
isMixedRnaAndDna

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
                hook: (val) => {
                  if (val === "Protein") {
                    updateEditor(store, "DemoEditor", {
                      readOnly: false,
                      sequenceData: tidyUpSequenceData(exampleProteinData, {
                        convertAnnotationsFromAAIndices: true
                      })
                    });
                  } else if (val === "RNA") {
                    updateEditor(store, "DemoEditor", {
                      readOnly: false,
                      sequenceData: { ...exampleSequenceData, isRna: true }
                    });
                  } else if (val === "Oligo") {
                    updateEditor(store, "DemoEditor", {
                      readOnly: false,
                      sequenceData: {
                        sequence:
                          "cccccttttttttcacacactactatattagtgagagagacccaca",
                        isOligo: true,
                        circular: false
                      }
                    });
                  } else if (val === "mixedRnaAndDna") {
                    updateEditor(store, "DemoEditor", {
                      readOnly: false,
                      sequenceData: tidyUpSequenceData(
                        {
                          ...exampleSequenceData,
                          sequence: "uuuu" + exampleSequenceData.sequence,
                          isMixedRnaAndDna: true
                        },
                        {}
                      )
                    });
                  } else {
                    if (
                      this.state.sequenceLength !== 5299 ||
                      !this.state.sequenceLength
                    ) {
                      updateEditor(store, "DemoEditor", {
                        readOnly: false,
                        sequenceData: exampleSequenceData
                      });
                    }
                  }
                }
              })}
              {renderToggle({
                isSelect: true,
                type: "sequenceLength",
                info: `
                Select your desired sequence length for random generation
              `,
                that: this,
                label: "Sequence of Length",
                options: [
                  "5299",
                  "10",
                  "20",
                  "50",
                  "100",
                  "1000",
                  "10000",
                  "25000",
                  "45000"
                ],
                hidden:
                  this.state.moleculeType !== "DNA" && this.state.moleculeType,
                hook: (val) => {
                  if (!val) return;
                  updateEditor(store, "DemoEditor", {
                    sequenceDataHistory: {},
                    sequenceData:
                      val === "5299"
                        ? exampleSequenceData
                        : generateSequenceData({
                            isProtein: false,
                            sequenceLength: parseInt(val)
                          })
                  });
                }
              })}

              {renderToggle({
                that: this,
                label: "Truncate Internal Labels That Don't Fit",
                type: "truncateLabelsThatDoNotFit",
                info: `By default truncateLabelsThatDoNotFit=true
This option allows for labels that are too big to usually fit into an annotation to still be drawn, just ellipsized.`
              })}
              {renderToggle({
                that: this,
                type: "smartCircViewLabelRender",
                info: `Only take as much space as necessary when drawing circular view labels`
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
                label: "Focus Properties",
                type: "focusProperties",
                hook: (shouldUpdate) => {
                  shouldUpdate &&
                    updateEditor(store, "DemoEditor", {
                      propertiesTool: {
                        tabId:
                          new URL(
                            `https://1.com?${
                              window.location.href.split("?")[1]
                            }`
                          ).searchParams.get("propertyTab") || "General"
                      },
                      panelsShown: [
                        [
                          {
                            id: "rail",
                            name: "Linear Map",
                            active: true
                          },
                          {
                            id: "circular",
                            name: "Circular Map"
                          }
                        ],
                        [
                          {
                            id: "sequence",
                            name: "Sequence Map"
                          },
                          {
                            id: "properties",
                            name: "Properties",
                            active: true
                          }
                        ]
                      ]
                    });
                },
                info: `//Focus the properties tab and focus on a particular sub tab (parts by default)

                `
              })}
              {renderToggle({
                that: this,
                label: "Focus Digest Tool",
                type: "focusDigestTool",
                hook: (shouldUpdate) => {
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
                            id: "circular",
                            name: "Circular Map"
                          }
                        ],
                        [
                          {
                            id: "sequence",
                            name: "Sequence Map"
                          },
                          {
                            id: "digestTool",
                            name: "New Digest",
                            active: true,
                            canClose: true
                          },
                          {
                            id: "properties",
                            name: "Properties"
                          }
                        ]
                      ]
                    });
                },
                info: `//Focus the properties tab and focus on a particular sub tab (parts by default)`
              })}
              {renderToggle({
                that: this,
                label: "Focus PCR Tool",
                type: "focusPCRTool",
                hook: (shouldUpdate) => {
                  shouldUpdate &&
                    updateEditor(store, "DemoEditor", {
                      panelsShown: [
                        [
                          {
                            id: "pcrTool",
                            name: "New PCR",
                            active: true,
                            canClose: true
                          },
                          {
                            id: "rail",
                            name: "Linear Map"
                          },
                          {
                            id: "circular",
                            name: "Circular Map"
                          }
                        ],
                        [
                          {
                            id: "sequence",
                            active: true,
                            name: "Sequence Map"
                          },

                          {
                            id: "properties",
                            name: "Properties"
                          }
                        ]
                      ]
                    });
                },
                info: `//Focus the properties tab and focus on a particular sub tab (parts by default)`
              })}
              {renderToggle({
                that: this,
                label: "Customize tabs",
                type: "customizeTabs",
                hook: (shouldUpdate) => {
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
\`\`\`
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
                info: "You can force a height for the editor by passing `height:500` (same for width) "
              })}
              {renderToggle({
                that: this,
                type: "adjustCircularLabelSpacing",
                label: "Adjust circular label spacing",
                info: "You can adjust the spacing between labels in circular view as a function of the multiple of the font height by passing `fontHeightMultiplier: 2` (value is restricted to between 1.5 and 3.5; default is 2.4, 2.0 when toggle is true)"
              })}
              {renderToggle({
                that: this,
                type: "nameFontSizeCircularView",
                label: "Configure font size of the name in the circular view",
                info: "You can configure the font size of the name in the circular view to fit names that are of a similar autogenerated length using `nameFontSizeCircularView` (set from 14 to 10 in this case)."
              })}
              {renderToggle({
                that: this,
                type: "withRotateCircularView",
                label: "Show Rotate Circular View",
                info: `withRotateCircularView={true /* default */} note that withZoomCircularView must also be set to false as well for this to work`
              })}
              {renderToggle({
                that: this,
                type: "withZoomCircularView",
                label: "Show Zoom Circular View",
                info: `withZoomCircularView={true /* default */}`
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
\`\`\`
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
                hook: (shouldUpdate) => {
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
      color: "red",
      arrowheadType: "NONE"
    },
    {
      id: "error2",
      name: "J5 Warning",
      message: "I'm a fake warning!",
      start: 600,
      end: 950,
      labelColor: "gold",
      color: "yellow",
      arrowheadType: "NONE"
    }
  ]
}
\`\`\`
`,
                hook: (shouldUpdate) => {
                  updateEditor(store, "DemoEditor", {
                    justPassingPartialSeqData: true,
                    sequenceData: {
                      warnings: shouldUpdate
                        ? [
                            {
                              id: "error1",
                              name: "J5 Error",
                              message: "I'm a fake error!",
                              start: 10,
                              end: 400,
                              labelColor: "red",
                              color: "red",
                              arrowheadType: "NONE"
                            },
                            {
                              id: "error2",
                              name: "J5 Warning",
                              message: "I'm a fake warning!",
                              start: 600,
                              end: 950,
                              labelColor: "gold",
                              color: "yellow",
                              arrowheadType: "NONE"
                            }
                          ]
                        : []
                    }
                  });
                }
              })}
              {renderToggle({
                that: this,
                type: "allowPartOverhangs",
                hook: (shouldUpdate) => {
                  shouldUpdate &&
                    updateEditor(store, "DemoEditor", {
                      justPassingPartialSeqData: true,
                      sequenceData: {
                        parts: [
                          {
                            start: 1,
                            end: 584,
                            fivePrimeOverhang: undefined,
                            fivePrimeUnderhang: "tgca",
                            fivePrimeDigestingEnzyme: "BssHII",
                            threePrimeOverhang: undefined,
                            threePrimeUnderhang: "gcgc",
                            threePrimeDigestingEnzyme: "SapI",
                            name: "Digest Part 1",
                            id: "2asdfgag"
                          },
                          {
                            start: 581,
                            end: 976,
                            fivePrimeOverhang: "cgcg",
                            fivePrimeUnderhang: undefined,
                            fivePrimeDigestingEnzyme: "BssHII",
                            threePrimeOverhang: undefined,
                            threePrimeUnderhang: "gcg",
                            threePrimeDigestingEnzyme: "SapI",
                            name: "Digest Part 2",
                            id: "0wgawawg"
                          }
                        ]
                      }
                    });
                }
              })}
              {renderToggle({
                that: this,
                type: "extraAnnotationPropsExample",
                hook: (shouldUpdate) => {
                  shouldUpdate &&
                    updateEditor(store, "DemoEditor", {
                      justPassingPartialSeqData: true,
                      sequenceData: {
                        parts: [
                          {
                            start: 1,
                            end: 584,
                            name: "Part 1",
                            id: "2asdfgag"
                          }
                        ]
                      }
                    });
                }
              })}
              {renderToggle({
                that: this,
                type: "showLineageAnnotations",
                label: "Show Lineage Annotations in Editor",
                description: `
Lineage Annotations (aka the input parts that went into the assembly) can be displayed directly in the editor like so:
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
      color: "green",
      arrowheadType: "NONE"
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

                hook: (shouldUpdate) => {
                  shouldUpdate &&
                    updateEditor(store, "DemoEditor", {
                      justPassingPartialSeqData: true,
                      sequenceData: {
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
                                color: "blue",
                                arrowheadType: "NONE"
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
Input Parts get turned into assembly pieces by j5, which then have the proper overlaps / overhangs and are ready for assembly
Assembly Pieces can be displayed directly in the editor like so:
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
      color: "green",
      arrowheadType: "NONE",
    },
    {
      id: "18711jja1",
      name: "Assembly Piece 2",
      start: 401,
      end: 899,
      labelColor: "blue",
      color: "blue",
      arrowheadType: "NONE",
    }
  ]
}
\`\`\`
`,

                hook: (shouldUpdate) => {
                  updateEditor(store, "DemoEditor", {
                    justPassingPartialSeqData: true,
                    sequenceData: {
                      assemblyPieces: shouldUpdate
                        ? [
                            {
                              id: "22oing211",
                              name: "Assembly Piece 1",
                              start: 900,
                              end: 400,
                              labelColor: "darkorange",
                              color: "darkorange",
                              arrowheadType: "NONE"
                            },
                            {
                              id: "18711jja1",
                              name: "Assembly Piece 2",
                              start: 401,
                              end: 899,
                              labelColor: "darkblue",
                              color: "darkblue",
                              arrowheadType: "NONE"
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
                type: "overrideManageEnzymes"
              })}
              {renderToggle({
                that: this,
                type: "getAdditionalEditAnnotationComps"
              })}
              {renderToggle({
                that: this,
                type: "longSequenceName",
                hook: (shouldUpdate) => {
                  shouldUpdate &&
                    updateEditor(store, "DemoEditor", {
                      justPassingPartialSeqData: true,
                      sequenceData: {
                        name: `LALALALA I'm a really Long Sequence Name gahhahaghaghaghahg hagahghah lorem ipsum stacato lorem ipsum stacato`
                      }
                    });
                }
              })}
              {this.state.overrideManageEnzymes &&
                renderToggle({
                  that: this,
                  type: "toggleEnzymeGroup"
                })}
              {renderToggle({
                that: this,
                type: "corruptedOverrideManageEnzymes",
                description: `This is just for testing purposes. We want to make sure that corrupted enzyme data doesn't bring down the whole tool.`
              })}
              {renderToggle({
                that: this,
                type: "enzymeGroupsOverride"
              })}
              {renderToggle({
                that: this,
                type: "additionalEnzymes",
                description: `Additional enzymes, including ones that are hidden by default, can be shown by passing the following to the Editor
\`\`\`
additionalEnzymes: {
  specialEnzyme1: {
    name: "specialEnzyme1",
    site: "attttttaaatacccgcg",
    forwardRegex: "attttttaaatacccgcg",
    reverseRegex: "cgcgggtatttaaaaaat",
    topSnipOffset: 9,
    bottomSnipOffset: 10
  },
  Esp3I: {
    name: "Esp3I",
    isType2S: true,
    site: "cgtctc",
    forwardRegex: "cgtctc",
    reverseRegex: "gagacg",
    topSnipOffset: 7,
    bottomSnipOffset: 11
  },
}
\`\`\`
                `
              })}
              {renderToggle({
                that: this,
                type: "allowPartsToOverlapSelf",
                hook: (shouldUpdate) => {
                  shouldUpdate &&
                    updateEditor(store, "DemoEditor", {
                      justPassingPartialSeqData: true,
                      sequenceData: {
                        parts: {
                          101: {
                            start: 10,
                            end: 30,
                            name: "Part 0",
                            id: "101",
                            tags: ["8"]
                          },
                          102: {
                            start: 87,
                            end: 93,
                            forward: true,
                            id: "102",
                            overlapsSelf: true,
                            name: "I wrap myself"
                          }
                        }
                      }
                    });
                },
                description: `If allowPartsToOverlapSelf=true is passed to <Editor/>
                then a new option will appear in the
                Edit/Create Part Dialog that a user can use to create a
                part that "wraps around the whole sequence and back over itself".
                This will cause part.overlapsSelf = true
                `
              })}
              {renderToggle({
                that: this,
                type: "chromatogramExample",
                hook: (shouldUpdate) => {
                  shouldUpdate &&
                    updateEditor(store, "DemoEditor", {
                      annotationVisibility: {
                        chromatogram: true,
                        features: true,
                        primers: false,
                        // parts: false,
                        cutsites: false
                        // orfTranslations: false
                      },
                      //JBEI sequence 'GFPvv50'

                      sequenceData: {
                        id: "1",
                        // chromatogramData: example1Ab1,
                        // sequence: example1Ab1.baseCalls.join(""),
                        chromatogramData: chromData,
                        sequence: chromData.baseCalls.join(""),
                        features: [
                          {
                            id: "yay",
                            name: "feat1",
                            start: 30,
                            end: 80
                          }
                        ],

                        // chromatogramData: chromData,
                        name: "GFPvv50"
                        // sequence:
                        //   "TTGTACACTTTTTTGTTGATATGTCATTCTTGTTGATTACATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGATGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCTCTTATGGTGTTCAATGCTTTTCCCGTTATCCGGATCATATGAAACGGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAACGCACTATATCTTTCAAAGATGACGGGAACTACAAGACGCGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATCGTATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTCGGACACAAACTCGAATACAACTATAACTCACACAATGTATACATCACGGCAGACAAACAAAAGAATGGAATCAAAGCTAACTTCAAAATTCGCCACAACATTGAAGATGGATCTGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCGACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGCGTGACCACATGGTCCTTCTTGAGTTTGTAACTGCTGCTGGGATTACACATGGCATGGATGAGCTCGGCGGCGGCGGCAGCAAGGTCTACGGCAAGGAACAGTTTTTGCGGATGCGCCAGAGCATGTTCCCCGATCGCTAAATCGAGTAAGGATCTCCAGGCATCAAATAAAACGAAAGGCTCAGTCGAAAGACTGGGCCTTTCGTTTTATCTGTTGTTTGTCGGTGAACGCTCTCTACTAGAGTCACACTGGCTCACCTTCGGGTGGGCCTTTCTGCGTTTATACCTAGGGTACGGGTTTTGCTGCCCGCAAACGGGCTGTTCTGGTGTTGCTAGTTTGTTATCAGAATCGCAGATCCCGGCTTCAGCCGGG"
                      },
                      panelsShown: [
                        [
                          {
                            id: "rail",
                            name: "Linear Map"
                          },
                          {
                            id: "sequence",
                            name: "Sequence Map",
                            active: true
                          },
                          {
                            // fullScreen: true,
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
                description: `Show chromatogram data in the editor`
              })}
              {renderToggle({
                that: this,
                type: "readOnly",
                hook: (readOnly) => {
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
                that: this,
                type: "linear",
                disabled:
                  this.state.moleculeType === "RNA" ||
                  this.state.moleculeType === "Protein",
                hook: (linear) => {
                  if (isNotDna) {
                    return;
                  }
                  updateEditor(store, "DemoEditor", {
                    justPassingPartialSeqData: true,
                    sequenceData: { circular: !linear }
                  });
                },
                label: "Toggle Linear",
                description: `The editor can be put into linear mode like so:
\`\`\`
updateEditor(store, "DemoEditor", {
  sequenceData: {...exampleSequenceData, circular: false}
});
\`\`\`
`
              })}
              {renderToggle({
                that: this,
                type: "initialAnnotationToEdit",
                label: "Pass an initial annotation to edit",
                description: `Say for example if you want to pop open the edit-part dialog the first time the user navigates to the sequence editor, you can pass an initialAnnotationToEdit={"part-someidhere"} `
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
                that: this,
                type: "focusLinearView",
                label: "Focus Linear View",
                hook: (show) => {
                  show && this.setLinearPanelAsActive();
                }
              })}
              {renderToggle({
                info: `Triggers a menu toastr message`,
                onClick: () => {
                  window.oveMenuToastrSuccess("Sequence Saving", {
                    loading: true
                  });
                  setTimeout(() => {
                    window.oveMenuToastrSuccess("Sequence Saved");
                  }, 3000);
                },
                isButton: true,
                that: this,
                type: "triggerMenuToastrMessage",
                label: "Trigger menu toastr message"
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
                type: "setASelection",
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
                type: "passAutoAnnotateHandlers",
                info: `
passing an autoAnnotateFeatures=()=>{} (or Primers/Parts) prop to the <Editor> will add a new menu item to the tools section which will trigger the passed callback
`
              })}
              {renderToggle({
                that: this,
                label: "Enable autoAnnotateAddon",
                type: "withAutoAnnotateAddon",
                info: `Use this like so:
\`\`\`
import {
  autoAnnotateFeatures,
  autoAnnotateParts,
  autoAnnotatePrimers
} from "ove-auto-annotate";

<Editor
  {...{ autoAnnotateFeatures, autoAnnotateParts, autoAnnotatePrimers, ...etc }}
/>;
 \`\`\`
 or if you're using umd: see usage example here: https://github.com/TeselaGen/openVectorEditor/blob/master/addons/README.md
`
              })}
              {renderToggle({
                that: this,
                label: "getCustomAutoAnnotateList (requires autoAnnotateAddon)",
                type: "withGetCustomAutoAnnotateList",
                info: `
The autoAnnotateAddon must be enabled for this to work
\`\`\`
getCustomAutoAnnotateList = async ({annotationType, sequenceData}) => {
  const dataToReturn = await fetch("/my/endpoint/here", {...someParams})

  return {
    title: 'My Annotations',
    list: [
  { name: "trypto", type: "cds", sequence: "agagagagagaga", id: "9" },
  { name: "prom2", type: "promoter", sequence: "gcttctctctc", id: "10" },
  {
    name: "prom2",
    type: "promoter",
    sequence: "gctt.*ctctctc",
    isRegex: true,
    id: "10"
  }
]
}
}
 \`\`\`
 or if you're using umd: see usage example here: https://github.com/TeselaGen/openVectorEditor/blob/master/addons/README.md
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
                type: "showMoleculeType",
                info: `pass showMoleculeType=false to the <Editor> to not display the molecule type status item`
              })}
              {renderToggle({
                that: this,
                type: "showAvailability",
                info: `pass showAvailability=false to the <Editor> to not display the availability toggle`
              })}
              {renderToggle({
                that: this,
                type: "showCicularViewInternalLabels",
                info: `pass showCicularViewInternalLabels=false to the <Editor> to not allow labels to be rendered inside the annotations on the circular view`
              })}
              {renderToggle({
                that: this,
                label: "Show GC Content by default",
                type: "showGCContentByDefault",
                info: `pass showGCContentByDefault=true to the <Editor/> to display the %GC content by default (note this will still allow the user to override that preference)`
              })}
              {renderToggle({
                that: this,
                info: `When enabled only labels that can't fit inside their annotation will be external.`,
                type: "onlyShowLabelsThatDoNotFit"
              })}
              {renderToggle({
                that: this,
                type: "maxAnnotationsToDisplayAdjustment",
                info: `pass maxAnnotationsToDisplay={{features: 5}} to the <Editor> to adjust the maximum number of features to display to 5 (for example). Primers, cutsites and parts can also be adjusted. Passing this option will disable the user from being able to manually adjust the annotation limits via the view > limits menu`
              })}
              {renderToggle({
                that: this,
                type: "onPreviewModeFullscreenClose",
                info: `handle for when fullscreenMode is exited`
              })}
              {renderToggle({
                that: this,
                type: "withPartTags",
                info: `Passing allPartTags to the <Editor/> allows the tags to be rendered in the Edit Part dialog. You can optionally pass a editTagsLink prop too!
                \`\`\`
                editTagsLink={<Button style={{height: 30}} icon="edit" href={"google.com"}></Button>}
                allPartTags={[{
                id: "1",
                name: "status",
                description: "the status of the part",
                color: "blue",
                tagOptions: [
                  {
                    id: "2",
                    name: "ready",
                    description: "this part is ready to use in a design",
                    color: "green"
                  },
                  {
                    id: "3",
                    name: "in progress",
                    description: "this part is being worked on",
                    color: "orange"
                  },
                  {
                    id: "4",
                    name: "broken",
                    description: "this part is broken",
                    color: "orange"
                  }
                ]
              },
              {
                id: "5",
                name: "tag2",
                description: "tag 2 description",
                color: "red"
              }]}
              \`\`\`
              to the <Editor> and pass parts[x].tags = ["1:2","5"]`
              })}
              {renderToggle({
                that: this,
                type: "isFullscreen",
                info: `pass isFullscreen=true to the <Editor> to force the editor to fill the window`
              })}
              {renderToggle({
                that: this,
                type: "allowPanelTabDraggable",
                description: `If allowPanelTabDraggable=true is passed to <Editor/>
                then the panel tabs will be draggable (except mobiles).
                `
              })}
              {renderToggle({
                that: this,
                type: "allowPrimerBasesToBeEdited",
                hook: (shouldUpdate) => {
                  shouldUpdate &&
                    updateEditor(store, "DemoEditor", {
                      justPassingPartialSeqData: true,
                      sequenceData: {
                        primers: shouldUpdate
                          ? [
                              {
                                name: "Example Primer 1",
                                id: "2o03j32o",
                                start: 59,
                                end: 82,
                                type: "primer_bind",
                                forward: true,
                                bases: "agggaaACTCGCTCGGGGTGGCCCCGGTGC",
                                primerBindsOn: "3prime",
                                useLinkedOligo: true
                              },
                              {
                                name: "Example Primer 2",
                                id: "98hf0",
                                start: 781,
                                end: 823,
                                type: "primer_bind",
                                forward: false,
                                bases:
                                  "agagagagaggcgggtttaacgccgattgaggccaacggttatctcgatttttt",
                                primerBindsOn: "3prime",
                                useLinkedOligo: true
                              },
                              {
                                name: "Example Primer 3",
                                id: "10021jos",
                                start: 1004,
                                end: 1029,
                                type: "primer_bind",
                                forward: true,
                                bases: "aaagcattctgtaacaaagcgggacc",
                                primerBindsOn: "3prime",
                                useLinkedOligo: true
                              }
                            ]
                          : []
                      }
                    });
                },
                description: `If allowPrimerBasesToBeEdited=true is passed to <Editor/>
                then the bases of primers can be edited.
                `
              })}
              {editorHandlers.length ? (
                <strong style={{ paddingTop: 5 }}>Editor Handlers: </strong>
              ) : null}
              {editorHandlers}
              <br />
              <br />
            </div>
          }

          <Editor
            panelMap={{
              myCustomTab: MyCustomTab
            }}
            style={{
              ...(this.state.showDemoOptions && { paddingLeft: 250 })
            }}
            {...this.state}
            {...(this.state.readOnly && { readOnly: true })}
            {...(!this.state.truncateLabelsThatDoNotFit && {
              truncateLabelsThatDoNotFit: false
            })}
            editorName="DemoEditor"
            onPreviewModeFullscreenClose={() => {
              window.toastr.success(
                "onPreviewModeFullscreenClose hit -- Fullscreen Closed"
              );
            }}
            maxAnnotationsToDisplay={
              this.state.maxAnnotationsToDisplayAdjustment
                ? { features: 5 }
                : undefined
            }
            editTagsLink={
              <Button
                className="example-editTagsLink"
                style={{ height: 30 }}
                icon="edit"
                onClick={() => {
                  showConfirmationDialog({ text: "You hit the editTagsLink!" });
                }}
              ></Button>
            }
            allPartTags={
              this.state.withPartTags && [
                {
                  id: "1",
                  name: "status",
                  description: "the status of the part",
                  color: "blue",
                  tagOptions: [
                    {
                      id: "2",
                      name: "ready",
                      description: "this part is ready to use in a design",
                      color: "green"
                    },
                    {
                      id: "3",
                      name: "in progress",
                      description: "this part is being worked on",
                      color: "orange"
                    },
                    {
                      id: "4",
                      name: "broken",
                      description: "this part is broken",
                      color: "orange"
                    }
                  ]
                },
                {
                  id: "5",
                  name: "tag2",
                  description: "tag 2 description",
                  color: "red"
                },
                {
                  id: "8",
                  name: "zoink",
                  description: "tag 2 description",
                  color: "blue"
                },
                {
                  id: "100",
                  name: "something else",
                  description: "tag 2 description",
                  color: "lightblue"
                },
                {
                  id: "500",
                  name: "new tag ",
                  description: "tag 2 description",
                  color: "gray"
                }
              ]
            }
            showMenuBar={this.state.showMenuBar}
            hideSingleImport={this.state.hideSingleImport}
            displayMenuBarAboveTools={this.state.displayMenuBarAboveTools}
            allowPartsToOverlapSelf={this.state.allowPartsToOverlapSelf}
            allowPrimerBasesToBeEdited={this.state.allowPrimerBasesToBeEdited}
            allowPanelTabDraggable={this.state.allowPanelTabDraggable}
            {...(this.state.corruptedOverrideManageEnzymes && {
              enzymeGroupsOverride: {
                someGroup: [
                  "specialEnzyme0",
                  "specialEnzyme1",
                  "aaui",
                  "bamhi",
                  "enzymeThatDoesntExist"
                ],
                anothaGroup: [
                  undefined,
                  "messedupname",
                  "aaui",
                  "specialenzyme2",
                  "bsmbi"
                ] //case shouldn't matter here
              },
              additionalEnzymes: {
                noCutsEnzyme: {
                  //this enzyme is fine
                  name: "specialEnzyme0",
                  site: "attttttaaatacccgcg",
                  forwardRegex: "attttttaaatacccgcg",
                  reverseRegex: "cgcgggtatttaaaaaat",
                  topSnipOffset: 9,
                  bottomSnipOffset: 10
                },
                specialenzyme1: {
                  //this is a corrupted enzyme
                  name: "specialEnzyme1",
                  site: "attttttaaatacccgcg",
                  forwardRegex: "attttttaaatacccgcg",
                  reverseRegex: undefined,
                  topSnipOffset: 9,
                  bottomSnipOffset: 10
                },
                specialenzyme2: {
                  //this is a corrupted enzyme
                  name: "specialEnzyme2",
                  site: "gacggctacatcat",
                  forwardRegex: undefined,
                  reverseRegex: "atgatgtagccgtc",
                  topSnipOffset: 2,
                  bottomSnipOffset: 4
                },
                messedUpName: {
                  name: "specialEnzymespecialenzyme4",
                  site: "gacggctacatcat",
                  forwardRegex: undefined,
                  reverseRegex: "atgatgtagccgtc",
                  topSnipOffset: 2,
                  bottomSnipOffset: 4
                }
              }
            })}
            {...(this.state.overrideManageEnzymes && {
              enzymeManageOverride: () => {
                window.toastr.success("enzyme manage override hit!");
              }
            })}
            {...((this.state.overrideManageEnzymes ||
              this.state.enzymeGroupsOverride ||
              this.state.additionalEnzymes) && {
              additionalEnzymes: {
                specialenzyme1: {
                  name: "specialEnzyme1",
                  site: "attttttaaatacccgcg",
                  forwardRegex: "attttttaaatacccgcg",
                  reverseRegex: "cgcgggtatttaaaaaat",
                  topSnipOffset: 9,
                  bottomSnipOffset: 10
                },
                specialenzyme2: {
                  name: "specialEnzyme2",
                  site: "gacggctacatcat",
                  forwardRegex: "gacggctacatcat",
                  reverseRegex: "atgatgtagccgtc",
                  topSnipOffset: 2,
                  bottomSnipOffset: 4
                },
                noCutsEnzyme: {
                  //this enzyme doesn't cut within the default sequence
                  name: "noCutsEnzyme",
                  site: "gggggggaaaaaaa",
                  forwardRegex: "gggggggaaaaaaa",
                  reverseRegex: "tttttttccccccc",
                  topSnipOffset: 9,
                  bottomSnipOffset: 10
                },
                Esp3I: {
                  name: "Esp3I",
                  isType2S: true,
                  site: "cgtctc",
                  forwardRegex: "cgtctc",
                  reverseRegex: "gagacg",
                  topSnipOffset: 7,
                  bottomSnipOffset: 11
                }
              }
            })}
            {...((this.state.overrideManageEnzymes ||
              this.state.enzymeGroupsOverride) && {
              enzymeGroupsOverride: {
                someGroup: this.state.toggleEnzymeGroup
                  ? ["bsmbi", "aatII"]
                  : ["specialEnzyme1", "bamhi", "noCutsEnzyme"],
                anothaGroup: ["specialenzyme2", "bsmbi"] //case shouldn't matter here
              }
            })}
            {...(this.state.onNew && {
              onNew: () => window.toastr.success("onNew callback triggered")
            })}
            {...(this.state.defaultLinkedOligoMessage && {
              defaultLinkedOligoMessage: "Custom Linked Oligo Message Here"
            })}
            {...(this.state.getAdditionalEditAnnotationComps && {
              getAdditionalEditAnnotationComps: ({ annotationTypePlural }) => {
                return <SlowComp {...{ annotationTypePlural }}></SlowComp>;
              }
            })}
            {...(this.state.onImport && {
              onImport: (sequence) => {
                window.toastr.success(
                  `onImport callback triggered for sequence: ${sequence.name}`
                );
                return sequence;
              }
            })}
            {...(this.state.allowMultipleFeatureDirections && {
              allowMultipleFeatureDirections: true
            })}
            {...(this.state.beforeAnnotationCreate && {
              beforeAnnotationCreate: ({
                props,
                annotationTypePlural,
                annotation
              }) => {
                console.info(
                  `props, annotation, annotationTypePlural`,
                  props,
                  annotation,
                  annotationTypePlural
                );
                window.toastr.success(
                  `beforeAnnotationCreate callback triggered for ${annotationTypePlural}`
                );
              }
            })}
            {...(this.state.onSave && {
              onSave: function (
                opts,
                sequenceDataToSave,
                editorState,
                onSuccessCallback
              ) {
                console.info("opts:", opts);
                if (window.Cypress) window.Cypress.pngFile = opts.pngFile;
                console.info("sequenceData:", sequenceDataToSave);
                console.info("editorState:", editorState);
                window.toastr.success("onSave callback triggered");
                // To disable the save button after successful saving
                // either call the onSuccessCallback or return a successful promise :)
                onSuccessCallback();
                //or
                // return myPromiseBasedApiCall()
              }
            })}
            {...(this.state.onSaveAs && {
              onSaveAs: function (
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
              onRename: (newName) =>
                window.toastr.success("onRename callback triggered: " + newName)
            })}
            {...(this.state.onDuplicate && {
              onDuplicate: () =>
                window.toastr.success("onDuplicate callback triggered")
            })}
            {...(this.state.onConfigureFeatureTypesClick && {
              onConfigureFeatureTypesClick: () => {
                window.toastr.success("onConfigureFeatureTypesClick clicked");
              }
            })}
            {...(this.state.onHiddenEnzymeAdd && {
              onHiddenEnzymeAdd: (e) => {
                window.toastr.success(`onHiddenEnzymeAdd clicked -- ${e.name}`);
              }
            })}
            {...(this.state.withGetAdditionalCreateOpts && {
              getAdditionalCreateOpts: (props) => {
                return [
                  {
                    text: "Additional Create Option",
                    onClick: () => {
                      window.toastr.success(
                        `Selecting between ${props.selectionLayer.start} : ${props.selectionLayer.end}`
                      );
                    }
                  }
                ];
              }
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
                        (a) =>
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
              onCopy: function (/* event, copiedSequenceData, editorState */) {
                window.toastr.success("onCopy callback triggered");

                // console.info(editorState);
                // //the copiedSequenceData is the subset of the sequence that has been copied in the teselagen sequence format
                // const clipboardData = event.clipboardData;
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
              onPaste: function (event /* editorState */) {
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
            {...(passAutoAnnotateHandlers && {
              autoAnnotateFeatures: () => {
                window.toastr.success(
                  "auto annotate features callback triggered"
                );
              },
              autoAnnotateParts: () => {
                window.toastr.success("auto annotate parts callback triggered");
              },
              autoAnnotatePrimers: () => {
                window.toastr.success(
                  "auto annotate primers callback triggered"
                );
              }
            })}
            {...(withAutoAnnotateAddon && {
              autoAnnotateFeatures,
              autoAnnotateParts,
              autoAnnotatePrimers
            })}
            {...(withGetCustomAutoAnnotateList && {
              getCustomAutoAnnotateList: this.getCustomAutoAnnotateList
            })}
            generatePng={generatePng}
            {...(forceHeightMode && { height: 500 })}
            {...(adjustCircularLabelSpacing && { fontHeightMultiplier: 2 })}
            {...(withVersionHistory && {
              getSequenceAtVersion: (versionId) => {
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
            withRotateCircularView={this.state.withRotateCircularView}
            withZoomCircularView={this.state.withZoomCircularView}
            showReadOnly={this.state.showReadOnly}
            initialAnnotationToEdit={
              this.state.initialAnnotationToEdit ? "part-10" : undefined
            }
            nameFontSizeCircularView={
              this.state.nameFontSizeCircularView ? 10 : undefined
            }
            showCircularity={!!this.state.showCircularity}
            showMoleculeType={this.state.showMoleculeType}
            showGCContentByDefault={this.state.showGCContentByDefault}
            onlyShowLabelsThatDoNotFit={this.state.onlyShowLabelsThatDoNotFit}
            GCDecimalDigits={this.state.GCDecimalDigits}
            showCicularViewInternalLabels={
              this.state.showCicularViewInternalLabels
            }
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
            {...(this.state.extraAnnotationPropsExample &&
              this.extraAnnotationPropsExample)}
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function SlowComp({ annotationTypePlural }) {
  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 100);
  }, []);
  if (isOpen)
    return (
      <div>
        I'm added via the getAdditionalEditAnnotationComps <br></br>{" "}
        {annotationTypePlural} lalala <br></br> {annotationTypePlural} lalaa
      </div>
    );
  return <div>yarp</div>;
}
