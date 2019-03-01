import React from "react";
import { Tag, Classes } from "@blueprintjs/core";
import { convertRangeTo0Based } from "ve-range-utils";
import classnames from "classnames";
import { oveCommandFactory } from "../utils/commandUtils";
import { upperFirst, startCase, get, filter } from "lodash";
import showFileDialog from "../utils/showFileDialog";
import { defaultCopyOptions } from "../redux/copyOptions";
import { divideBy3 } from "../utils/proteinUtils";

const isProtein = props => props.sequenceData.isProtein;

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
  toolsCmd: {
    handler: () => {},
    isHidden: isProtein
  },

  deleteSequence: {
    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) ||
      !hasSelection(props) ||
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
    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) || props.sequenceLength === 0,
    isHidden: props => props.readOnly,
    handler: () => triggerClipboardCommand("cut"),
    hotkey: "mod+x"
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

  goTo: {
    isDisabled: props => props.sequenceLength === 0,
    name: "Go To...",
    handler: props => {
      props.showGoToDialog({
        extraProps: {
          sequencePosition: {
            min: 0,
            max: divideBy3(props.sequenceLength, props.sequenceData.isProtein)
          }
        },
        initialValues: {
          sequencePosition: divideBy3(
            props.caretPosition >= 0 ? props.caretPosition : 0,
            props.sequenceData.isProtein
          )
        },
        onSubmit: values =>
          props.caretPositionUpdate(
            values.sequencePosition * (props.sequenceData.isProtein ? 3 : 1)
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
      const { start, end } = props.selectionLayer;
      props.showSelectDialog({
        extraProps: {
          from: {
            min: 1,
            max: divideBy3(
              props.sequenceLength || 1,
              props.sequenceData.isProtein || 1
            )
          },
          to: {
            min: 1,
            max: divideBy3(
              props.sequenceLength || 1,
              props.sequenceData.isProtein || 1
            )
          }
        },
        initialValues: {
          from: divideBy3(start >= 0 ? start : 0, props.sequenceData.isProtein),
          to: divideBy3(end >= 0 ? end : 0, props.sequenceData.isProtein)
        },
        onSubmit: values => {
          const newRange = convertRangeTo0Based({
            start: props.sequenceData.isProtein ? values.from * 3 : values.from,
            end: props.sequenceData.isProtein ? values.to * 3 : values.to
          });

          return props.selectionLayerUpdate({
            start: props.sequenceData.isProtein
              ? newRange.start - 2
              : newRange.start,
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
    isDisabled: props => !hasSelection(props),
    handler: props => props.handleInverse(),
    hotkey: "mod+i"
  },

  complementSelection: {
    isHidden: props => props.readOnly || props.sequenceData.isProtein,

    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) ||
      (!hasSelection(props) && "Requires Selection"),
    handler: props => props.handleComplementSelection()
  },

  complementEntireSequence: {
    isHidden: props => props.readOnly || props.sequenceData.isProtein,

    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) || props.sequenceLength === 0,

    handler: props => props.handleComplementSequence()
  },
  sequenceCase: {
    isHidden: isProtein,
    handler: () => {}
  },
  toggleSequenceMapFontUpper: {
    isHidden: isProtein,
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
    isHidden: props => props.readOnly || props.sequenceData.isProtein,

    handler: props => props.handleReverseComplementSelection(),
    hotkey: "mod+e"
  },

  reverseComplementEntireSequence: {
    isHidden: props => props.readOnly || props.sequenceData.isProtein,

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

  newFeature: {
    handler: (props /* state, ctxInfo */) => {
      props.handleNewFeature();
    },
    isHidden: props => props.readOnly,
    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) || props.sequenceLength === 0,
    hotkey: "mod+k"
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

  newPart: {
    handler: props => props.handleNewPart(),
    isHidden: props => props.readOnly,

    isDisabled: props =>
      (props.readOnly && readOnlyDisabledTooltip) || props.sequenceLength === 0,
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

const annotationToggleCommandDefs = {};
[
  "features",
  "parts",
  "cutsites",
  "axis",
  { type: "orfs", text: "ORFs" },
  "primers",
  "translations",

  {
    type: "orfTranslations",
    text: "ORF Translations",
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
  "aminoAcidNumbers",
  "axisNumbers",
  {
    type: "sequence",
    name: "DNA Sequence",
    noCount: true,
    isHidden: props => !props.sequenceData.isProtein
  },
  {
    type: "reverseSequence",
    name: props =>
      props.sequenceData.isProtein ? "DNA Reverse Sequence" : "Reverse Sequence"
  },
  {
    type: "dnaColors",
    isDisabled: props =>
      !props.annotationVisibility.sequence &&
      !props.annotationVisibility.reverseSequence &&
      "The DNA sequence must be visible in order to color it"
  },
  "lineageLines"
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
  toggleAminoAcidNumbers_dna: {
    ...annotationToggleCommandDefs.toggleAminoAcidNumbers,
    isHidden: props => props.sequenceData.isProtein
  },
  toggleAminoAcidNumbers_protein: {
    ...annotationToggleCommandDefs.toggleAminoAcidNumbers,
    isHidden: props => !props.sequenceData.isProtein
  }
};

const toolCommandDefs = {
  simulateDigestion: {
    handler: props => props.createNewDigest(),
    hotkey: "mod+shift+d",
    isHidden: props => props.sequenceData.isProtein
  },
  // TODO: enzyme manager (?)
  restrictionEnzymesManager: {
    name: "Restriction Enzymes Manager...",
    handler: props => props.addYourOwnEnzymeOpen(),
    isHidden: props => props.sequenceData.isProtein
  }
};

const commandDefs = {
  ...additionalAnnotationCommandsDefs,
  ...fileCommandDefs,
  ...cirularityCommandDefs,
  ...annotationToggleCommandDefs,
  ...labelToggleCommandDefs,
  ...editCommandDefs,
  ...toolCommandDefs
};

export default instance => oveCommandFactory(instance, commandDefs);
