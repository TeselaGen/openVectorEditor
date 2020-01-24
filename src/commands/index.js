import React from "react";
import { Tag, Classes } from "@blueprintjs/core";
import { convertRangeTo0Based, getSequenceWithinRange } from "ve-range-utils";
import classnames from "classnames";
import pluralize from "pluralize";
import { showConfirmationDialog } from "teselagen-react-components";
import {
  adjustBpsToReplaceOrInsert,
  annotationTypes,
  getSequenceDataBetweenRange
} from "ve-sequence-utils";
import { oveCommandFactory } from "../utils/commandUtils";
import {
  upperFirst,
  map,
  forEach,
  reduce,
  startCase,
  get,
  filter,
  camelCase
} from "lodash";
import showFileDialog from "../utils/showFileDialog";
import { defaultCopyOptions } from "../redux/copyOptions";
import { divideBy3 } from "../utils/proteinUtils";
import packageJson from "../../package.json";

const isProtein = props => props.sequenceData && props.sequenceData.isProtein;

const getNewTranslationHandler = isReverse => ({
  handler: (props, state, ctxInfo) => {
    const annotation =
      get(ctxInfo, "context.annotation") || props.selectionLayer;
    if (!(annotation.start > -1)) {
      return window.toastr.warning("No region found to translate");
    }
    props.upsertTranslation({
      start: annotation.start,
      end: annotation.end,
      forward: !isReverse
    });
    props.annotationVisibilityShow("translations");
  },
  isHidden: props =>
    isProtein(props) ||
    !props.annotationsToSupport ||
    // props.readOnly ||
    !props.annotationsToSupport.translations,
  isDisabled: props =>
    /* (props.readOnly && readOnlyDisabledTooltip) ||  */ props.sequenceLength ===
      0 || noSelection(props)
});

const fileCommandDefs = {
  newSequence: {
    isHidden: props => !props.onNew,
    handler: props => props.onNew()
  },

  renameSequence: {
    isHidden: props => props.readOnly,
    isDisabled: props => props.readOnly && readOnlyDisabledTooltip,
    handler: props => {
      props.showRenameSequenceDialog({
        initialValues: { newName: props.sequenceData.name },
        onSubmit: values => {
          props.sequenceNameUpdate(values.newName);
          props.onRename && props.onRename(values.newName, props);
        }
      });
    }
  },

  saveSequence: {
    name: "Save",
    isDisabled: props =>
      props.alwaysAllowSave
        ? false
        : (props.readOnly && readOnlyDisabledTooltip) ||
          !props.sequenceData ||
          (props.sequenceData.stateTrackingId === "initialLoadId" ||
            props.sequenceData.stateTrackingId === props.lastSavedId),
    isHidden: props => props.readOnly || !props.handleSave,
    handler: props => props.handleSave(),
    hotkey: "mod+s"
  },
  saveSequenceAs: {
    name: "Save As",
    // isDisabled: props =>
    //   (props.readOnly && readOnlyDisabledTooltip) ||
    //   !props.sequenceData ||
    //   (props.sequenceData.stateTrackingId === "initialLoadId" ||
    //     props.sequenceData.stateTrackingId === props.lastSavedId),
    isHidden: props => !props.onSaveAs,
    handler: props => props.handleSave({ isSaveAs: true }),
    hotkey: "mod+shift+s"
  },
  toolsCmd: {
    handler: () => {},
    isHidden: isProtein
  },

  deleteSequence: {
    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) ||
      noSelection(props) ||
      !props.onDelete,
    isHidden: props => !props.onDelete,
    handler: props => props.onDelete(props.sequenceData)
  },

  duplicateSequence: {
    isDisabled: props => !props.onDuplicate,
    isHidden: props => !props.onDuplicate,
    handler: props => props.onDuplicate(props.sequenceData),
    hotkey: "alt+shift+d"
  },

  toggleReadOnlyMode: {
    toggle: [],
    isDisabled: props => props.disableSetReadOnly || !props.onSave,
    isHidden: props => !props.toggleReadOnlyMode,
    isActive: props => props.readOnly,
    handler: props => props.toggleReadOnlyMode()
  },

  importSequence: {
    isHidden: props => props.hideSingleImport,
    isDisabled: props => props.readOnly,
    handler: props => {
      showFileDialog({
        multiple: false,
        onSelect: files => {
          props.importSequenceFromFile(files[0]);
        }
      });
    }
  },
  featureTypesCmd: {
    name: props => {
      const total = Object.keys(
        reduce(
          props.sequenceData.features,
          (acc, feat) => {
            acc[feat.type] = true;
            return acc;
          },
          {}
        )
      ).length;
      const toHideCount = Object.keys(
        props.annotationVisibility.featureTypesToHide
      ).length;
      return (
        <span>
          Feature Types &nbsp;
          <Tag round style={{ marginLeft: 4 }}>
            {total - toHideCount}/{total}
          </Tag>
        </span>
      );
    },
    submenu: props => {
      const types = {};
      forEach(props.sequenceData.features, feat => {
        if (!feat.type) return;
        const checked = !props.annotationVisibility.featureTypesToHide[
          feat.type
        ];
        if (types[feat.type]) {
          types[feat.type].count++;
        } else {
          types[feat.type] = {
            count: 1,
            shouldDismissPopover: false,
            onClick: () =>
              checked
                ? props.hideFeatureTypes([feat.type])
                : props.showFeatureTypes([feat.type]),
            checked
          };
        }
        types[feat.type].text = (
          <span>
            {feat.type} &nbsp;
            <Tag round style={{ marginLeft: 4 }}>
              {types[feat.type].count}
            </Tag>
          </span>
        );
      });
      const typeMenu = map(types);
      return [
        {
          text: "Uncheck All",
          onClick: () => props.hideFeatureTypes(Object.keys(types)),
          shouldDismissPopover: false
        },
        {
          text: "Check All",
          onClick: () => props.resetFeatureTypesToHide(),
          shouldDismissPopover: false
        },
        "--",
        ...(typeMenu.length
          ? typeMenu
          : [
              {
                text: "No Features To Filter",
                disabled: true
              }
            ])
      ];
    }
    // isDisabled:
  },

  exportSequenceAsGenbank: {
    name: props =>
      isProtein(props) ? "Download GenPept File" : "Download Genbank File",
    handler: props =>
      props.exportSequenceToFile(isProtein(props) ? "genpept" : "genbank")
  },
  exportSequenceAsFasta: {
    name: "Download FASTA File",
    handler: props => props.exportSequenceToFile("fasta")
  },
  exportSequenceAsTeselagenJson: {
    name: "Download Teselagen JSON File",
    handler: props => props.exportSequenceToFile("teselagenJson")
  },

  viewProperties: {
    handler: props => props.propertiesViewOpen()
  },
  viewRevisionHistory: {
    handler: props => props.toggleViewVersionHistory(),
    isHidden: props => !props.getVersionList || !props.getSequenceAtVersion
  },

  print: {
    hotkeyProps: { preventDefault: true },
    handler: props => props.showPrintDialog(),
    hotkey: "mod+p"
  },
  ...["Parts", "Features", "Primers"].reduce((acc, type) => {
    //showRemoveDuplicatesDialogFeatures showRemoveDuplicatesDialogParts showRemoveDuplicatesDialogPrimers
    acc[`showRemoveDuplicatesDialog${type}`] = {
      name: `Remove Duplicate ${startCase(type)}`,
      isDisabled: props => props.readOnly,
      handler: props =>
        props.showRemoveDuplicatesDialog({
          type: camelCase(type),
          editorName: props.editorName,
          dialogProps: {
            title: `Remove Duplicate ${type}`
          }
        })
    };
    return acc;
  }, {})
};
//copy options
const toggleCopyOptionCommandDefs = {};
Object.keys(defaultCopyOptions).forEach(type => {
  const cmdId = `toggleCopy${upperFirst(type)}`;
  toggleCopyOptionCommandDefs[cmdId] = {
    name: `Include ${startCase(type)}`,
    handler: props => props.toggleCopyOption(type),
    isActive: props => props.copyOptions && props.copyOptions[type]
  };
});

const readOnlyDisabledTooltip =
  "Sorry this function is not allowed in Read-Only Mode";
const noSelection = ({ selectionLayer = {} }) =>
  !(selectionLayer.start > -1 && selectionLayer.end > -1) &&
  "Selection Required";

const triggerClipboardCommand = type => {
  const wrapper = document.querySelector(".veVectorInteractionWrapper");
  if (!wrapper) {
    return window.toastr.info(`Cannot trigger a ${type} in the current view`);
  }
  const hiddenInput = wrapper.querySelector("input.clipboard");
  hiddenInput.focus();
  const worked = document.execCommand(type);
  wrapper.focus();
  if (!worked) {
    const keys = { paste: "Cmd/Ctrl+V", cut: "Cmd/Ctrl+X", copy: "Cmd/Ctrl+C" };
    if (keys[type]) {
      // TODO maybe improve msg with HTML
      window.toastr.info(`Press ${keys[type]} to ${type}`);
    } else {
      console.warn(
        `The ${type} command did not work. document.execCommand(${type}) didn't work`
      );
    }
  }
};

const editCommandDefs = {
  changeCaseCmd: {
    isHidden: isProtein,
    handler: () => {}
  },
  cut: {
    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) || props.sequenceLength === 0,
    isHidden: props => props.readOnly,
    handler: () => {
      triggerClipboardCommand("cut");
    },
    hotkey: "mod+x"
  },
  createNewFromSubsequence: {
    name: "New Sequence From Selected Range",
    isDisabled: props =>
      props.sequenceLength === 0 || props.selectionLayer.start === -1,
    isHidden: props => !props.onCreateNewFromSubsequence,
    handler: props => {
      props.onCreateNewFromSubsequence(
        getSequenceDataBetweenRange(props.sequenceData, props.selectionLayer),
        props
      );
    }
    // hotkey: "mod+x"
  },

  copy: {
    isDisabled: props => props.sequenceLength === 0,

    handler: () => triggerClipboardCommand("copy"),
    hotkey: "mod+c"
  },

  paste: {
    isDisabled: props => props.readOnly && readOnlyDisabledTooltip,
    isHidden: props => props.readOnly,

    handler: () => triggerClipboardCommand("paste"),
    hotkey: "mod+v"
  },

  undo: {
    isHidden: props => props.readOnly,

    isDisabled: props =>
      props.readOnly ||
      !(
        props.sequenceDataHistory &&
        props.sequenceDataHistory.past &&
        props.sequenceDataHistory.past.length
      ),
    handler: props => props.undo(),
    hotkey: "mod+z"
  },

  redo: {
    isHidden: props => props.readOnly,

    isDisabled: props =>
      props.readOnly ||
      !(
        props.sequenceDataHistory &&
        props.sequenceDataHistory.future &&
        props.sequenceDataHistory.future.length
      ),
    handler: props => props.redo(),
    hotkey: "mod+shift+z"
  },
  find: {
    isDisabled: props => props.sequenceLength === 0,
    name: "Find...",
    handler: props => props.toggleFindTool(),
    hotkey: "mod+f",
    hotkeyProps: { preventDefault: true }
  },
  about: {
    isDisabled: props => props.sequenceLength === 0,
    name: "About",
    handler: () =>
      showConfirmationDialog({
        text: (
          <div>
            <h5>Open Vector Editor Version: {packageJson.version}</h5>
            This editor is made by Teselagen.
            <br />
            <br />
            Issues can be logged here:{" "}
            <a href="https://github.com/TeselaGen/openVectorEditor/issues">
              Open Vector Editor
            </a>
          </div>
        ),
        confirmButtonText: "Back",
        cancelButtonText: null,
        canEscapeKeyCancel: true //this is false by default
      })
  },
  versionNumber: {
    name: "OVE Version:  " + packageJson.version
  },

  goTo: {
    isDisabled: props => props.sequenceLength === 0,
    name: "Go To...",
    handler: props => {
      props.showGoToDialog({
        extraProps: {
          sequencePosition: {
            min: 0,
            max: divideBy3(props.sequenceLength, isProtein(props))
          }
        },
        initialValues: {
          sequencePosition: divideBy3(
            props.caretPosition >= 0 ? props.caretPosition : 0,
            isProtein(props)
          )
        },
        onSubmit: values =>
          props.caretPositionUpdate(
            values.sequencePosition * (isProtein(props) ? 3 : 1)
          )
      });
    },
    hotkey: "mod+g",
    hotkeyProps: { preventDefault: true }
  },

  select: {
    isDisabled: props => props.sequenceLength === 0,
    name: "Select...",
    handler: props => {
      let { start, end } = props.selectionLayer;
      if (!(start > -1)) {
        start = props.caretPosition;
        end = props.caretPosition;
      }
      props.showSelectDialog({
        extraProps: {
          circular: props.sequenceData && props.sequenceData.circular,
          from: {
            min: 1,
            max: divideBy3(props.sequenceLength || 1, isProtein(props))
          },
          to: {
            min: 1,
            max: divideBy3(props.sequenceLength || 1, isProtein(props))
          }
        },
        selectionLayerUpdate: props.selectionLayerUpdate,
        caretPositionUpdate: props.caretPositionUpdate,
        initialCaretPosition: props.caretPosition,
        initialValues: {
          from: Math.max(
            1,
            1 + divideBy3(start >= 0 ? start : 0, isProtein(props))
          ),
          to: Math.max(1, 1 + divideBy3(end >= 0 ? end : 0, isProtein(props)))
        },
        isProtein: isProtein(props),
        sequenceLength: divideBy3(props.sequenceLength || 1, isProtein(props)),
        onSubmit: values => {
          const newRange = convertRangeTo0Based({
            start: isProtein(props) ? values.from * 3 : values.from,
            end: isProtein(props) ? values.to * 3 : values.to
          });

          return props.selectionLayerUpdate({
            start: isProtein(props) ? newRange.start - 2 : newRange.start,
            end: newRange.end
          });
        }
      });
    }
  },
  selectAll: {
    handler: (props, obj) => {
      const { event, viaHotkey } = obj || {};
      if (viaHotkey) {
        event.stopPropagation();
        event.preventDefault();
      }
      props.selectAll();
    },
    isDisabled: props => props.sequenceLength === 0,
    hotkey: "mod+a"
    //tnr: we can't pass the following because it will block inputs
    // hotkeyProps: { preventDefault: true, stopPropagation: true }
  },

  selectInverse: {
    isDisabled: props => noSelection(props),
    handler: props => props.handleInverse(),
    hotkey: "mod+i"
  },

  complementSelection: {
    isHidden: props => props.readOnly || isProtein(props),

    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) || noSelection(props),
    handler: props => props.handleComplementSelection()
  },

  complementEntireSequence: {
    isHidden: props => props.readOnly || isProtein(props),

    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) || props.sequenceLength === 0,

    handler: props => props.handleComplementSequence()
  },
  sequenceCase: {
    isHidden: isProtein
  },
  ...[
    { hotkey: "option + =", type: "flipCaseSequence" },
    { hotkey: "option + plus", type: "upperCaseSequence" },
    { hotkey: "option + -", type: "lowerCaseSequence" },
    { /* hotkey: "option+-", */ type: "upperCaseSelection" },
    { /* hotkey: "option+-", */ type: "lowerCaseSelection" }
  ].reduce((acc, { type, hotkey }) => {
    const isSelection = type.includes("Selection");

    acc[type] = {
      isHidden: isProtein,
      isDisabled: props => {
        if (props.readOnly) {
          return "The sequence is read only. Try changing 'View > Sequence Case'";
        }
        if (isSelection && !(props.selectionLayer.start > -1)) {
          return "No Selection to Replace";
        }
      },
      name: startCase(type),
      hotkey,
      handler: props => {
        const { sequence } = props.sequenceData;
        const { selectionLayer } = props;
        let toastFired;
        if (props.uppercaseSequenceMapFont !== "noPreference") {
          toastFired = true;
          props.updateSequenceCase("noPreference");
          window.toastr.success(
            `Sequence Case Edited Successfully. To avoid confusion we set: 'View > Sequence Case' to 'No Preference'`,
            {
              timeout: 10000
            }
          );
        }
        const func = type.includes("lower") ? "toLowerCase" : "toUpperCase";
        let newSeq;
        let orginalSeq = isSelection
          ? getSequenceWithinRange(selectionLayer, sequence)
          : sequence;
        if (type.includes("flip")) {
          newSeq = invertString(orginalSeq);
        } else {
          newSeq = orginalSeq[func]();
        }
        if (newSeq !== orginalSeq) {
          !toastFired &&
            window.toastr.success(`Sequence Case Edited Successfully`);
          //don't trigger a mutation unless something has actually changed
          props.updateSequenceData({
            ...props.sequenceData,
            sequence: isSelection
              ? adjustBpsToReplaceOrInsert(
                  sequence,
                  newSeq,
                  selectionLayer,
                  false
                )
              : newSeq
          });
        }
      }
    };
    return acc;
  }, {}),
  toggleSequenceMapFontUpper: {
    isActive: props => props.uppercaseSequenceMapFont === "uppercase",
    handler: props => {
      props.updateSequenceCase("uppercase");
      window.toastr.success(`Sequence Case View Changed`);
    },
    hotkey: "ctrl+option+plus"
  },
  toggleSequenceMapFontRaw: {
    isActive: props => props.uppercaseSequenceMapFont === "noPreference",
    handler: props => {
      props.updateSequenceCase("noPreference");
      window.toastr.success(`Sequence Case View Changed`);
    },
    hotkey: "ctrl+option+="
  },
  toggleSequenceMapFontLower: {
    isActive: props => props.uppercaseSequenceMapFont === "lowercase",
    handler: props => {
      props.updateSequenceCase("lowercase");
      window.toastr.success(`Sequence Case View Changed`);
    },
    hotkey: "ctrl+option+-"
  },
  createMenuHolder: {
    isHidden: props => isProtein(props) && props.readOnly,
    handler: () => {}
  },
  // toggleSequenceMapFontNoPreference: {
  //   isActive: props =>
  //     !props.uppercaseSequenceMapFont ||
  //     props.uppercaseSequenceMapFont === "noPreference",
  //   handler: props => {
  //     props.updateSequenceCase("noPreference");
  //   }
  // },
  reverseComplementSelection: {
    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) || noSelection(props),
    isHidden: props => props.readOnly || isProtein(props),

    handler: props => props.handleReverseComplementSelection(),
    hotkey: "mod+e"
  },

  reverseComplementEntireSequence: {
    isHidden: props => props.readOnly || isProtein(props),

    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) || props.sequenceLength === 0,
    handler: props => props.handleReverseComplementSequence()
  },
  fullSequenceTranslations: {
    isHidden: isProtein,
    handler: () => {}
  },
  sequenceAA_allFrames: {
    isActive: props =>
      props.frameTranslations["1"] &&
      props.frameTranslations["2"] &&
      props.frameTranslations["3"],
    handler: props => {
      if (
        props.frameTranslations["1"] &&
        props.frameTranslations["2"] &&
        props.frameTranslations["3"]
      ) {
        props.frameTranslationToggleOff("1");
        props.frameTranslationToggleOff("2");
        props.frameTranslationToggleOff("3");
      } else {
        props.annotationVisibilityShow("translations");
        props.frameTranslationToggleOn("1");
        props.frameTranslationToggleOn("2");
        props.frameTranslationToggleOn("3");
      }
    }
  },
  sequenceAAReverse_allFrames: {
    isHidden: isProtein,

    isActive: props =>
      props.frameTranslations["-1"] &&
      props.frameTranslations["-2"] &&
      props.frameTranslations["-3"],
    handler: props => {
      if (
        props.frameTranslations["-1"] &&
        props.frameTranslations["-2"] &&
        props.frameTranslations["-3"]
      ) {
        props.frameTranslationToggleOff("-1");
        props.frameTranslationToggleOff("-2");
        props.frameTranslationToggleOff("-3");
      } else {
        props.annotationVisibilityShow("translations");
        props.frameTranslationToggleOn("-1");
        props.frameTranslationToggleOn("-2");
        props.frameTranslationToggleOn("-3");
      }
    }
  },
  sequenceAA_frame1: {
    isActive: props => props.frameTranslations["1"],
    handler: props => {
      if (!props.frameTranslations["1"]) {
        props.annotationVisibilityShow("translations");
      }
      props.frameTranslationToggle("1");
    }
  },
  sequenceAA_frame2: {
    isActive: props => props.frameTranslations["2"],
    handler: props => {
      if (!props.frameTranslations["2"]) {
        props.annotationVisibilityShow("translations");
      }
      props.frameTranslationToggle("2");
    }
  },
  sequenceAA_frame3: {
    isActive: props => props.frameTranslations["3"],
    handler: props => {
      if (!props.frameTranslations["3"]) {
        props.annotationVisibilityShow("translations");
      }
      props.frameTranslationToggle("3");
    }
  },
  sequenceAAReverse_frame1: {
    isActive: props => props.frameTranslations["-1"],
    handler: props => {
      if (!props.frameTranslations["-1"]) {
        props.annotationVisibilityShow("translations");
      }
      props.frameTranslationToggle("-1");
    }
  },
  sequenceAAReverse_frame2: {
    isActive: props => props.frameTranslations["-2"],
    handler: props => {
      if (!props.frameTranslations["-2"]) {
        props.annotationVisibilityShow("translations");
      }
      props.frameTranslationToggle("-2");
    }
  },

  sequenceAAReverse_frame3: {
    isActive: props => props.frameTranslations["-3"],
    handler: props => {
      if (!props.frameTranslations["-3"]) {
        props.annotationVisibilityShow("translations");
      }
      props.frameTranslationToggle("-3");
    }
  },
  newTranslation: getNewTranslationHandler(),
  newReverseTranslation: getNewTranslationHandler(true),

  newFeature: {
    handler: (props /* state, ctxInfo */) => {
      props.handleNewFeature();
    },
    isHidden: props =>
      props.readOnly ||
      !props.annotationsToSupport ||
      !props.annotationsToSupport.features,
    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) || props.sequenceLength === 0,
    hotkey: "mod+k",
    hotkeyProps: { preventDefault: true }
  },
  useGtgAndCtgAsStartCodons: {
    isHidden: isProtein,

    name: "Use GTG And CTG As Start Codons",
    isActive: props => props.useAdditionalOrfStartCodons,
    handler: props => props.useAdditionalOrfStartCodonsToggle()
  },
  minOrfSizeCmd: {
    name: props => {
      return (
        <div data-test="min-orf-size" style={{ display: "flex" }}>
          Minimum ORF Size:
          <input
            type="number"
            className={classnames(Classes.INPUT, "minOrfSizeInput")}
            onChange={function(event) {
              let minimumOrfSize = parseInt(event.target.value, 10);
              if (!(minimumOrfSize > -1)) return;
              if (minimumOrfSize > props.sequenceLength) return;
              props.annotationVisibilityShow("orfs");
              props.minimumOrfSizeUpdate(minimumOrfSize);
            }}
            value={props.minimumOrfSize}
          />
        </div>
      );
    },
    // isActive: (props) => props.useAdditionalOrfStartCodons,
    handler: () => {}
  },
  hotkeyDialog: {
    name: "View Editor Hotkeys",
    handler: props => props.openHotkeyDialog()
  },

  newPart: {
    handler: props => props.handleNewPart(),
    isHidden: props =>
      props.readOnly ||
      !props.annotationsToSupport ||
      !props.annotationsToSupport.parts,

    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) || props.sequenceLength === 0,
    hotkey: "mod+l",
    hotkeyProps: { preventDefault: true }
  },
  newPrimer: {
    handler: props => props.handleNewPrimer(),
    isHidden: props =>
      props.readOnly ||
      !props.annotationsToSupport ||
      !props.annotationsToSupport.primers,
    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) || props.sequenceLength === 0
  },

  rotateToCaretPosition: {
    isHidden: props => props.readOnly || isProtein(props),

    isDisabled: props =>
      (props.caretPosition === -1 && "You must first place cursor") ||
      (!props.sequenceData.circular && "Disabled for Linear Sequences"),
    handler: props => props.handleRotateToCaretPosition(),
    hotkey: "mod+b"
  },
  ...toggleCopyOptionCommandDefs
};

const cirularityCommandDefs = {
  circular: {
    isHidden: props => props.readOnly || isProtein(props),

    isDisabled: props => props.readOnly && readOnlyDisabledTooltip,
    handler: props => props.updateCircular(true),
    isActive: (props, editorState) =>
      editorState && editorState.sequenceData.circular
  },
  linear: {
    isHidden: props => props.readOnly,

    isDisabled: props => props.readOnly && readOnlyDisabledTooltip,
    handler: props => props.updateCircular(false),
    isActive: (props, editorState) =>
      editorState && !editorState.sequenceData.circular
  }
};

const labelToggleCommandDefs = {};
["feature", "part", "cutsite"].forEach(type => {
  const cmdId = `toggle${upperFirst(type)}Labels`;
  const plural = type + "s";
  labelToggleCommandDefs[cmdId] = {
    toggle: ["show", "hide"],
    handler: props => props.annotationLabelVisibilityToggle(plural),
    isHidden: props => {
      return props && props.typesToOmit && props.typesToOmit[plural] === false;
    },
    isActive: (props, editorState) =>
      editorState && editorState.annotationLabelVisibility[plural]
  };
});

const editAnnotationCommandDefs = ["feature", "part", "primer"].reduce(
  (acc, key) => {
    acc[`edit${upperFirst(key)}`] = {
      name: `Edit ${upperFirst(key)}`,
      handler: (props, state, ctxInfo) => {
        const annotation = get(ctxInfo, "context.annotation");
        props[`showAddOrEdit${upperFirst(key)}Dialog`](annotation);
      },
      isHidden: props => props.readOnly
    };
    return acc;
  },
  {}
);

const deleteAnnotationCommandDefs = [
  "feature",
  "part",
  "primer",
  "translation"
].reduce((acc, key) => {
  acc[`delete${upperFirst(key)}`] = {
    name: `Delete ${upperFirst(key)}`,
    handler: (props, state, ctxInfo) => {
      const annotation = get(ctxInfo, "context.annotation");
      props[`delete${upperFirst(key)}`](annotation);
    },
    isHidden: props => props.readOnly
  };
  return acc;
}, {});

const viewPropertiesCommandDefs = [
  "general",
  "genbank",
  "features",
  "parts",
  "orfs",
  "cutsites",
  "primers",
  "translations"
].reduce((acc, key) => {
  const singularKey = pluralize.singular(key);
  acc[`view${upperFirst(singularKey)}Properties`] = {
    name: `View ${upperFirst(singularKey)} Properties`,
    handler: (props, state, ctxInfo) => {
      const annotation = get(ctxInfo, "context.annotation");
      props.propertiesViewOpen();
      //we need to clear the properties tab first in case the same item has already been selected
      props.propertiesViewTabUpdate(key, undefined);
      setTimeout(() => {
        //then shortly after we can update it with the correct annotation
        props.propertiesViewTabUpdate(key, annotation);
      }, 0);
    }
  };
  return acc;
}, {});

const annotationToggleCommandDefs = {};
[
  "features",
  "parts",

  {
    type: "warnings",
    isHidden: p => {
      return !map(p.sequenceData["warnings"]).length;
    }
  },
  {
    type: "assemblyPieces",
    isHidden: p => {
      return !map(p.sequenceData["assemblyPieces"]).length;
    }
  },
  {
    type: "lineageAnnotations",
    isHidden: p => {
      return !map(p.sequenceData["lineageAnnotations"]).length;
    }
  },
  { type: "cutsites", isHidden: isProtein },
  "axis",
  { type: "orfs", text: "ORFs", isHidden: isProtein },
  { type: "primers", isHidden: isProtein },

  "translations",

  {
    type: "orfTranslations",
    text: "ORF Translations",
    isHidden: isProtein,
    isDisabled: props => {
      return (
        (!props.annotationVisibility.orfs &&
          "ORFs must be visible to view their translations") ||
        (!props.annotationVisibility.translations &&
          "Translations must be visible to view ORF translations")
      );
    }
  },
  {
    type: "cdsFeatureTranslations",
    text: "CDS Feature Translations",
    isHidden: isProtein,
    isDisabled: props => {
      return (
        (!props.annotationVisibility.features &&
          "Features must be visible to view their translations") ||
        (!props.annotationVisibility.translations &&
          "Translations must be visible to view CDS feature translations")
      );
    }
  },
  // {
  //   type: "aminoAcidNumbers",
  //   isHidden: (p, c) =>
  //     (c.isDnaMenu && p.isProtein) || (!c.isDnaMenu && !p.isProtein)
  // },
  { type: "aminoAcidNumbers" },
  "axisNumbers",
  {
    type: "sequence",
    name: "DNA Sequence",
    noCount: true,
    isHidden: props => !isProtein(props)
  },
  {
    type: "reverseSequence",
    name: props =>
      isProtein(props) ? "DNA Reverse Sequence" : "Reverse Sequence"
  },
  {
    type: "dnaColors",
    isDisabled: props =>
      !props.annotationVisibility.sequence &&
      !props.annotationVisibility.reverseSequence &&
      "The DNA sequence must be visible in order to color it"
  }
].forEach(typeOrObj => {
  let type = typeOrObj;
  let obj = {};
  if (typeOrObj.type) {
    type = typeOrObj.type;
    obj = typeOrObj;
  }
  const cmdId = `toggle${upperFirst(type)}`;
  annotationToggleCommandDefs[cmdId] = {
    toggle: ["show", "hide"],
    name: props => {
      const sequenceData = props.sequenceData || {};
      let count;
      let hasCount = false;
      const annotations = props[type] || sequenceData[type];
      if (annotations && !obj.noCount) {
        hasCount = true;
        count = annotations.length || Object.keys(annotations).length || 0;
      }
      if (type === "cdsFeatureTranslations") {
        hasCount = true;
        count = filter(
          props.features || sequenceData.features || [],
          ({ type }) => type === "CDS"
        ).length;
      }
      if (type === "orfTranslations") {
        hasCount = true;
        count = filter(
          props.orfs || sequenceData.orfs || [],
          ({ isOrf }) => isOrf
        ).length;
      }
      return (
        <span>
          {obj.text || startCase(type)}
          &nbsp;
          {hasCount && (
            <Tag round style={{ marginLeft: 4 }}>
              {count}
            </Tag>
          )}
        </span>
      );
    },
    handler: props => props.annotationVisibilityToggle(type),
    isActive: props => {
      return (
        props && props.annotationVisibility && props.annotationVisibility[type]
      );
    },
    ...obj, //spread this here to override the above props if necessary
    isHidden: props => {
      return (
        (props && props.typesToOmit && props.typesToOmit[type] === false) ||
        (obj.isHidden && obj.isHidden(props))
      );
    }
  };
});

const additionalAnnotationCommandsDefs = {
  showAll: {
    handler: props => {
      annotationTypes.forEach(type => {
        props.annotationVisibilityShow(type);
      });
    }
  },
  hideAll: {
    handler: props => {
      annotationTypes.forEach(type => {
        props.annotationVisibilityHide(type);
      });
    }
  },
  toggleAminoAcidNumbers_dna: {
    ...annotationToggleCommandDefs.toggleAminoAcidNumbers,
    isHidden: props => isProtein(props)
  },
  toggleAminoAcidNumbers_protein: {
    ...annotationToggleCommandDefs.toggleAminoAcidNumbers,
    isHidden: props => isProtein(props)
  }
};

const toolCommandDefs = {
  simulateDigestion: {
    handler: props => props.createNewDigest(),
    hotkey: "mod+shift+d",
    hotkeyProps: { preventDefault: true },
    isHidden: props => isProtein(props)
  },
  // TODO: enzyme manager (?)
  restrictionEnzymesManager: {
    name: "Add Additional Enzymes",
    handler: props =>
      props.addAdditionalEnzymesReset({
        inputSequenceToTestAgainst: props.sequenceData
          ? props.sequenceData.sequence
          : "",
        isOpen: true
      }),
    isHidden: props => isProtein(props)
  }
};

const commandDefs = {
  ...additionalAnnotationCommandsDefs,
  ...fileCommandDefs,
  ...cirularityCommandDefs,
  ...annotationToggleCommandDefs,
  ...viewPropertiesCommandDefs,
  ...editAnnotationCommandDefs,
  ...deleteAnnotationCommandDefs,
  ...labelToggleCommandDefs,
  ...editCommandDefs,
  ...toolCommandDefs
};

export default instance => oveCommandFactory(instance, commandDefs);

const invertString = function(str) {
  let s = "";
  let i = 0;
  while (i < str.length) {
    let n = str.charAt(i);
    if (n === n.toUpperCase()) {
      // *Call* toLowerCase
      n = n.toLowerCase();
    } else {
      // *Call* toUpperCase
      n = n.toUpperCase();
    }

    i += 1;
    s += n;
  }
  return s;
};
