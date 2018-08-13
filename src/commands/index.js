import { oveCommandFactory } from '../utils/commandUtils';
import { upperFirst, startCase, isEmpty } from 'lodash';
import showFileDialog from "../utils/showFileDialog";

const fileCommandDefs = {
  newSequence: {
    isDisabled: props => !props.onNew,
    handler: props => props.onNew(),
  },

  renameSequence: {
    isDisabled: props => props.readOnly,
    handler: props => {
      props.showRenameSequenceDialog({
        initialValues: { newName: props.sequenceData.name },
        onSubmit: values => props.sequenceNameUpdate(values.newName)
      });
    }
  },

  saveSequence: {
    isDisabled: props => props.readOnly || props.hasBeenSaved,
    handler: props => props.handleSave(),
    hotkey: "mod+s"
  },

  deleteSequence: {
    isDisabled: props => !props.onDelete,
    handler: props => props.onDelete(props.sequenceData),
  },

  duplicateSequence: {
    isDisabled: props => !props.onDuplicate,
    handler: props => props.onDuplicate(props.sequenceData),
    hotkey: "alt+shift+d"
  },

  toggleReadOnlyMode: {
    toggle: [],
    isActive: props => props.readOnly,
    handler: props => props.toggleReadOnlyMode()
  },

  importSequence: {
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
    name: "As Genbank file",
    handler: props => props.exportSequenceToFile("genbank"),
  },

  exportSequenceAsFasta: {
    name: "As FASTA file",
    handler: props => props.exportSequenceToFile("fasta"),
  },

  viewProperties: {
    handler: props => props.propertiesViewOpen()
  },

  print: {
    handler: props => props.handlePrint(),
    hotkey: "mod+p"
  }

};

const toggleCopyOptionCommandDefs = {};
['features', 'parts', 'partialParts', 'partialFeatures'].forEach(type => {
  const cmdId = `toggleCopy${upperFirst(type)}`;
  toggleCopyOptionCommandDefs[cmdId] = {
    name: `Include ${startCase(type)}`,
    handler: (props) => props.toggleCopyOption(type),
    isActive: (props) => props.copyOptions[type],
  };
});

const hasSelection = ({ selectionLayer }) =>
  selectionLayer.start !== -1 && selectionLayer.end !== -1;

const editCommandDefs = {
  copy: {
    handler: props => props.triggerClipboardCommand('copy'),
    hotkey: "mod+c"
  },

  paste: {
    handler: props => props.triggerClipboardCommand('paste'),
    hotkey: "mod+v"
  },

  undo : {
    isDisabled: props => isEmpty(props.sequenceDataHistory.past),
    handler: props => props.undo(),
    hotkey: "mod+z"
  },

  redo : {
    isDisabled: props => isEmpty(props.sequenceDataHistory.future),
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
        initialValues: {
          from: start >= 0 ? start : 0,
          to: end >= 0 ? end : 0,
        },
        onSubmit: values => props.selectionLayerUpdate({
          start: values.from,
          end: values.to
        })
      });
    }
  },

  selectAll: {
    handler: props => props.selectAll(),
    hotkey: "mod+a",
    hotkeyProps: { preventDefault: true, stopPropagation: true }
  },

  selectInverse: {
    isDisabled: props => !hasSelection(props),
    handler: props => props.handleInverse(),
    hotkey: "mod+i"
  },

  complementSelection: {
    isDisabled: props => !hasSelection(props),
    handler: props => props.handleComplementSelection()
  },

  complementEntireSequence: {
    isDisabled: props => !hasSelection(props),
    handler: props => props.handleComplementSequence()
  },

  reverseComplementSelection: {
    isDisabled: props => !hasSelection(props),
    handler: props => props.handleReverseComplementSelection(),
    hotkey: "mod+e"
  },

  reverseComplementEntireSequence: {
    isDisabled: props => !hasSelection(props),
    handler: props => props.handleReverseComplementSequence()
  },

  newFeature: {
    handler: props => props.handleNewFeature(),
    hotkey: "mod+k"
  },

  newPart: {
    handler: props => props.handleNewPart(),
    hotkey: "mod+l",
    hotkeyProps: { preventDefault: true }
  },

  rotateToCaretPosition: {
    isDisabled: props => props.caretPosition === -1,
    handler: props => props.handleRotateToCaretPosition(),
    hotkey: "mod+b"
  },

  ...toggleCopyOptionCommandDefs
};

const cirularityCommandDefs = {
  circular: {
    handler: (props) => props.updateCircular(true),
    isActive: (props, editorState) => editorState.sequenceData.circular,
  },
  linear: {
    handler: (props) => props.updateCircular(false),
    isActive: (props, editorState) => !editorState.sequenceData.circular,
  },
};

const labelToggleCommandDefs = {};
['feature', 'part', 'cutsite'].forEach(type => {
  const cmdId = `toggle${upperFirst(type)}Labels`;
  const plural = type + 's';
  labelToggleCommandDefs[cmdId] = {
    toggle: ['show', 'hide'],
    handler: (props) => props.annotationLabelVisibilityToggle(plural),
    isActive: (props, editorState) => editorState.annotationLabelVisibility[plural],
  };
});

const annotationToggleCommandDefs = {};
['features', 'parts', 'cutsites', 'axis', 'axisNumbers', 'reverseSequence', 'dnaColors', 'lineageLines'].forEach(type => {
  const cmdId = `toggle${upperFirst(type)}`;
  annotationToggleCommandDefs[cmdId] = {
    toggle: ['show', 'hide'],
    handler: (props) => props.annotationVisibilityToggle(type),
    isActive: (props, editorState) => editorState.annotationVisibility[type],
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
