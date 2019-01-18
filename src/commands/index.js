import React from "react";
import { Tag } from "@blueprintjs/core";
import { convertRangeTo0Based } from "ve-range-utils";
import { oveCommandFactory } from "../utils/commandUtils";
import { upperFirst, startCase, get, filter } from "lodash";
import showFileDialog from "../utils/showFileDialog";
import { defaultCopyOptions } from "../redux/copyOptions";

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
        onSubmit: values => props.sequenceNameUpdate(values.newName)
      });
    }
  },

  saveSequence: {
    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) ||
      (props.sequenceData.stateTrackingId === "initialLoadId" ||
        props.sequenceData.stateTrackingId === props.lastSavedId),
    isHidden: props => props.readOnly || !props.handleSave,
    handler: props => props.handleSave(),
    hotkey: "mod+s"
  },

  deleteSequence: {
    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) || !props.onDelete,
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

  exportSequenceAsGenbank: {
    name: "Download Genbank File",
    handler: props => props.exportSequenceToFile("genbank")
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
  }
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
const hasSelection = ({ selectionLayer = {} }) =>
  selectionLayer.start > -1 && selectionLayer.end > -1;

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
  cut: {
    isDisabled: props => props.readOnly && readOnlyDisabledTooltip,
    isHidden: props => props.readOnly,
    handler: () => triggerClipboardCommand("cut"),
    hotkey: "mod+x"
  },

  copy: {
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
    name: "Find...",
    handler: props => props.toggleFindTool(),
    hotkey: "mod+f",
    hotkeyProps: { preventDefault: true }
  },

  goTo: {
    name: "Go To...",
    handler: props => {
      props.showGoToDialog({
        extraProps: {
          sequencePosition: { min: 0, max: props.sequenceLength }
        },
        initialValues: {
          sequencePosition: props.caretPosition >= 0 ? props.caretPosition : 0
        },
        onSubmit: values => props.caretPositionUpdate(values.sequencePosition)
      });
    },
    hotkey: "mod+g",
    hotkeyProps: { preventDefault: true }
  },

  select: {
    name: "Select...",
    handler: props => {
      const { start, end } = props.selectionLayer;
      props.showSelectDialog({
        extraProps: {
          from: { min: 1, max: props.sequenceLength },
          to: { min: 1, max: props.sequenceLength }
        },
        initialValues: {
          from: start >= 0 ? start : 0,
          to: end >= 0 ? end : 0
        },
        onSubmit: values =>
          props.selectionLayerUpdate(
            convertRangeTo0Based({
              start: values.from,
              end: values.to
            })
          )
      });
    }
  },
  selectAll: {
    handler: (props, obj) => {
      const { event } = obj || {};
      if (
        event &&
        event.target &&
        (event.target.type === "textarea" || event.target.type === "input")
      ) {
        return true; //stop early to allow select all to work in inputs and text areas
      }
      props.selectAll();
      event.stopPropagation();
      event.preventDefault();
    },
    hotkey: "mod+a"
    // hotkeyProps: { preventDefault: true, stopPropagation: true }
  },

  selectInverse: {
    isDisabled: props => !hasSelection(props),
    handler: props => props.handleInverse(),
    hotkey: "mod+i"
  },

  complementSelection: {
    isHidden: props => props.readOnly,

    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) ||
      (!hasSelection(props) && "Requires Selection"),
    handler: props => props.handleComplementSelection()
  },

  complementEntireSequence: {
    isHidden: props => props.readOnly,

    isDisabled: props => props.readOnly && readOnlyDisabledTooltip,
    handler: props => props.handleComplementSequence()
  },
  toggleSequenceMapFontUpper: {
    isActive: props => props.uppercaseSequenceMapFont === "uppercase",
    handler: props => {
      props.uppercaseSequenceMapFont === "uppercase"
        ? props.updateSequenceCase("noPreference")
        : props.updateSequenceCase("uppercase");
    }
  },
  toggleSequenceMapFontLower: {
    isActive: props => props.uppercaseSequenceMapFont === "lowercase",
    handler: props => {
      props.uppercaseSequenceMapFont === "lowercase"
        ? props.updateSequenceCase("noPreference")
        : props.updateSequenceCase("lowercase");
    }
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
      (props.readOnly && readOnlyDisabledTooltip) ||
      (!hasSelection(props) && "Requires Selection"),
    isHidden: props => props.readOnly,

    handler: props => props.handleReverseComplementSelection(),
    hotkey: "mod+e"
  },

  reverseComplementEntireSequence: {
    isHidden: props => props.readOnly,

    isDisabled: props => props.readOnly && readOnlyDisabledTooltip,
    handler: props => props.handleReverseComplementSequence()
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

  newFeature: {
    handler: (props, state, ctxInfo) => {
      console.warn("newFeature ctxInfo", ctxInfo);
      props.handleNewFeature();
    },
    isHidden: props => props.readOnly,

    isDisabled: props => props.readOnly && readOnlyDisabledTooltip,
    hotkey: "mod+k"
  },

  newPart: {
    handler: props => props.handleNewPart(),
    isHidden: props => props.readOnly,

    isDisabled: props => props.readOnly && readOnlyDisabledTooltip,
    hotkey: "mod+l",
    hotkeyProps: { preventDefault: true }
  },

  rotateToCaretPosition: {
    isHidden: props => props.readOnly,

    isDisabled: props =>
      props.caretPosition === -1 && "You must first place cursor",
    handler: props => props.handleRotateToCaretPosition(),
    hotkey: "mod+b"
  },

  editFeature: {
    isHidden: props => props.readOnly,

    isDisabled: props => props.readOnly && readOnlyDisabledTooltip,
    handler: (props, state, ctxInfo) => {
      const annotation = get(ctxInfo, "context.annotation");
      props.showAddOrEditFeatureDialog(annotation);
    }
  },

  ...toggleCopyOptionCommandDefs
};

const cirularityCommandDefs = {
  circular: {
    isHidden: props => props.readOnly,

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
    isActive: (props, editorState) =>
      editorState && editorState.annotationLabelVisibility[plural]
  };
});

const annotationToggleCommandDefs = {};
[
  "features",
  "parts",
  "cutsites",
  "axis",
  { type: "orfs", text: "ORFs" },
  "primers",
  "translations",
  { type: "orfTranslations", text: "ORF Translations" },
  { type: "cdsFeatureTranslations", text: "CDS Feature Translations" },
  "axisNumbers",
  "reverseSequence",
  "dnaColors",
  "lineageLines"
].forEach(typeOrObj => {
  const type = typeOrObj.type || typeOrObj;

  const cmdId = `toggle${upperFirst(type)}`;
  annotationToggleCommandDefs[cmdId] = {
    toggle: ["show", "hide"],
    name: props => {
      const { sequenceData } = props;
      let count;
      let hasCount = false;
      if (sequenceData && sequenceData[type]) {
        hasCount = true;
        count =
          sequenceData[type].length || Object.keys(sequenceData[type]).length;
      }
      if (type === "cdsFeatureTranslations") {
        hasCount = true;
        count = filter(
          sequenceData.features || [],
          ({ type }) => type === "CDS"
        ).length;
      }
      if (type === "orfTranslations") {
        hasCount = true;
        count = filter(sequenceData.orfs || [], ({ isOrf }) => isOrf).length;
      }
      return (
        <span>
          {typeOrObj.text || startCase(type)}
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
    isDisabled: props => {
      if (type === "orfTranslations") {
        return (
          (!props.annotationVisibility.orfs &&
            "ORFs must be visible to view their translations") ||
          (!props.annotationVisibility.translations &&
            "Translations must be visible to view ORF translations")
        );
      } else if (type === "cdsFeatureTranslations") {
        return (
          (!props.annotationVisibility.features &&
            "Features must be visible to view their translations") ||
          (!props.annotationVisibility.translations &&
            "Translations must be visible to view CDS feature translations")
        );
      }
    },
    isHidden: props => {
      return props && props.typesToOmit && props.typesToOmit[type] === false;
    }
  };
});

const toolCommandDefs = {
  simulateDigestion: {
    handler: props => props.createNewDigest(),
    hotkey: "mod+shift+d"
  },
  // TODO: enzyme manager (?)
  restrictionEnzymesManager: {
    name: "Restriction Enzymes Manager...",
    handler: props => props.addYourOwnEnzymeOpen()
  }
};

const commandDefs = {
  ...fileCommandDefs,
  ...cirularityCommandDefs,
  ...annotationToggleCommandDefs,
  ...labelToggleCommandDefs,
  ...editCommandDefs,
  ...toolCommandDefs
};

export default instance => oveCommandFactory(instance, commandDefs);
