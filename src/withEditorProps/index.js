import { getFeatureToColorMap } from "ve-sequence-utils";
import {
  anyToJson,
  jsonToGenbank,
  jsonToFasta,
  cleanUpTeselagenJsonForExport
} from "bio-parsers";
import FileSaver from "file-saver";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { compose, withHandlers, withProps } from "recompose";
import { getFormValues /* formValueSelector */ } from "redux-form";
import { showConfirmationDialog } from "teselagen-react-components";
import { some, map, keyBy, omit, isArray } from "lodash";
import {
  tidyUpSequenceData,
  getComplementSequenceAndAnnotations,
  insertSequenceDataAtPositionOrRange,
  getReverseComplementSequenceAndAnnotations,
  rotateSequenceDataToPosition
} from "ve-sequence-utils";
import { Intent } from "@blueprintjs/core";
import {
  convertRangeTo0Based,
  getRangeLength,
  invertRange,
  normalizeRange
} from "ve-range-utils";
import shortid from "shortid";

import addMetaToActionCreators from "../redux/utils/addMetaToActionCreators";
import { actions, editorReducer } from "../redux";
import s from "../selectors";
import { allTypes } from "../utils/annotationTypes";

import { MAX_MATCHES_DISPLAYED } from "../constants/findToolConstants";
import { defaultMemoize } from "reselect";
import domtoimage from "dom-to-image";
import {
  hideDialog,
  showAddOrEditAnnotationDialog,
  showDialog
} from "../GlobalDialogUtils";
// import { getStartEndFromBases } from "../utils/editorUtils";

const getUpperOrLowerSeq = defaultMemoize(
  (uppercaseSequenceMapFont, sequence = "") =>
    uppercaseSequenceMapFont === "uppercase"
      ? sequence.toUpperCase()
      : uppercaseSequenceMapFont === "lowercase"
      ? sequence.toLowerCase()
      : sequence
);

const getTypesToOmit = (annotationsToSupport) => {
  const typesToOmit = {};
  allTypes.forEach((type) => {
    if (!annotationsToSupport[type]) typesToOmit[type] = false;
  });
  return typesToOmit;
};

const getVisibilities = (
  annotationVisibility,
  annotationLabelVisibility,
  annotationsToSupport
) => {
  const typesToOmit = getTypesToOmit(annotationsToSupport);
  const annotationVisibilityToUse = {
    ...annotationVisibility,
    ...typesToOmit
  };
  const annotationLabelVisibilityToUse = {
    ...annotationLabelVisibility,
    ...typesToOmit
  };
  return {
    annotationVisibilityToUse,
    annotationLabelVisibilityToUse,
    typesToOmit
  };
};

async function getSaveDialogEl() {
  return new Promise((resolve) => {
    showDialog({
      dialogType: "PrintDialog",
      props: {
        dialogProps: {
          title: "Generating Image to Save...",
          isCloseButtonShown: false
        },
        addPaddingBottom: true,
        hideLinearCircularToggle: true,
        hidePrintButton: true
      }
    });

    const id = setInterval(() => {
      const componentToPrint = document.querySelector(".bp3-dialog");
      if (componentToPrint) {
        clearInterval(id);
        resolve(componentToPrint);
      }
    }, 1000);
  });
}
/**
 * Function to generate a png
 *
 * @return {object} - Blob (png) | Error
 */
const generatePngFromPrintDialog = async (props) => {
  const saveDialog = await getSaveDialogEl(props);

  const printArea = saveDialog.querySelector(".bp3-dialog-body");

  const result = await domtoimage
    .toBlob(printArea)
    .then((blob) => {
      return blob;
    })
    .catch((error) => {
      console.error(error);
      return error;
    });
  hideDialog();
  return result;
};

export const handleSave =
  (props) =>
  async (opts = {}) => {
    const {
      onSave,
      onSaveAs,
      generatePng,
      readOnly,
      alwaysAllowSave,
      sequenceData,
      lastSavedIdUpdate
    } = props;
    const saveHandler = opts.isSaveAs ? onSaveAs || onSave : onSave;

    const updateLastSavedIdToCurrent = () => {
      lastSavedIdUpdate(sequenceData.stateTrackingId);
    };

    // Optionally generate png
    if (generatePng) {
      opts.pngFile = await generatePngFromPrintDialog(props);
    }

    // TODO: pass additionalProps (blob or error) to the user
    const promiseOrVal =
      (!readOnly || alwaysAllowSave || opts.isSaveAs) &&
      saveHandler &&
      saveHandler(
        opts,
        tidyUpSequenceData(sequenceData, { annotationsAsObjects: true }),
        props,
        updateLastSavedIdToCurrent
      );

    if (promiseOrVal && promiseOrVal.then) {
      return promiseOrVal.then(updateLastSavedIdToCurrent);
    }
  };

export const handleInverse = (props) => () => {
  const {
    sequenceLength,
    selectionLayer,
    caretPosition,
    selectionLayerUpdate,
    caretPositionUpdate
  } = props;

  if (sequenceLength <= 0) {
    return false;
  }
  if (selectionLayer.start > -1) {
    if (getRangeLength(selectionLayer, sequenceLength) === sequenceLength) {
      caretPositionUpdate(selectionLayer.start);
    } else {
      selectionLayerUpdate(invertRange(selectionLayer, sequenceLength));
    }
  } else {
    if (caretPosition > -1) {
      selectionLayerUpdate(
        normalizeRange(
          {
            start: caretPosition,
            end: caretPosition - 1
          },
          sequenceLength
        )
      );
    } else {
      selectionLayerUpdate({
        start: 0,
        end: sequenceLength - 1
      });
    }
  }
};

export const updateCircular = (props) => async (isCircular) => {
  const { _updateCircular, updateSequenceData, sequenceData } = props;
  if (!isCircular && hasAnnotationThatSpansOrigin(sequenceData)) {
    const doAction = await showConfirmationDialog({
      intent: Intent.DANGER, //applied to the right most confirm button
      confirmButtonText: "Truncate Annotations",
      canEscapeKeyCancel: true, //this is false by default
      text: "Careful! Origin spanning annotations will be truncated. Are you sure you want to make the sequence linear?"
    });
    if (!doAction) return; //stop early
    updateSequenceData(truncateOriginSpanningAnnotations(sequenceData), {
      batchUndoStart: true
    });
  }
  _updateCircular(isCircular, { batchUndoEnd: true });
};

export const importSequenceFromFile =
  (props) =>
  async (file, opts = {}) => {
    const { updateSequenceData, onImport } = props;
    const result = await anyToJson(file, { acceptParts: true, ...opts });

    // TODO maybe handle import errors/warnings better
    const failed = !result[0].success;
    const messages = result[0].messages;
    if (isArray(messages)) {
      messages.forEach((msg) => {
        const type = msg.substr(0, 20).toLowerCase().includes("error")
          ? failed
            ? "error"
            : "warning"
          : "info";
        window.toastr[type](msg);
      });
    }
    if (failed) {
      window.toastr.error(
        "Error importing sequence(s). See console for more errors"
      );
      console.error(`Seq import results:`, result);
    } else if (result.length > 1) {
      showDialog({
        dialogType: "MultipleSeqsDetectedOnImportDialog",
        props: {
          finishDisplayingSeq,
          results: result
        }
      });
    } else {
      finishDisplayingSeq(result[0].parsedSequence);
    }
    async function finishDisplayingSeq(seqData) {
      if (onImport) {
        seqData = await onImport(seqData);
      }

      if (seqData) {
        seqData.stateTrackingId = shortid();
        updateSequenceData(seqData);
        window.toastr.success("Sequence Imported");
      }
    }
  };

export const exportSequenceToFile = (props) => (format) => {
  const { sequenceData } = props;
  let convert, fileExt;

  if (format === "genbank") {
    convert = jsonToGenbank;
    fileExt = "gb";
  } else if (format === "genpept") {
    convert = jsonToGenbank;
    fileExt = "gp";
  } else if (format === "teselagenJson") {
    convert = jsonToJson;
    fileExt = "json";
  } else if (format === "fasta") {
    convert = jsonToFasta;
    fileExt = "fasta";
  } else {
    console.error(`Invalid export format: '${format}'`); // dev error
    return;
  }
  const blob = new Blob([convert(sequenceData)], { type: "text/plain" });
  const filename = `${sequenceData.name || "Untitled_Sequence"}.${fileExt}`;
  FileSaver.saveAs(blob, filename);
  window.toastr.success("File Downloaded Successfully");
};

/**
 * This function basically connects the wrapped component with all of the state stored in a given editor instance
 * and then some extra goodies like computed properties and namespace bound action handlers
 */
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToActions,
    (mapProps, dispatchProps, ownProps) => {
      const toSpread = {};
      if (mapProps.annotationToAdd) {
        toSpread.original_selectionLayerUpdate =
          dispatchProps.selectionLayerUpdate;
        toSpread.selectionLayerUpdate = (sel) => {
          dispatchProps.dispatch({
            type: "@@redux-form/CHANGE",
            meta: {
              form: mapProps.annotationToAdd.formName,
              field: "start",
              touch: false,
              persistentSubmitErrors: false
            },
            payload: sel.start + 1
          });
          dispatchProps.dispatch({
            type: "@@redux-form/CHANGE",
            meta: {
              form: mapProps.annotationToAdd.formName,
              field: "end",
              touch: false,
              persistentSubmitErrors: false
            },
            payload: sel.end + 1
          });
        };
        toSpread.caretPositionUpdate = () => {};
      }
      return { ...ownProps, ...mapProps, ...dispatchProps, ...toSpread };
    }
  ),
  withHandlers({
    wrappedInsertSequenceDataAtPositionOrRange: (props) => {
      return (
        _sequenceDataToInsert,
        _existingSequenceData,
        _caretPositionOrRange,
        _options
      ) => {
        const {
          sequenceDataToInsert,
          existingSequenceData,
          caretPositionOrRange,
          options
        } = props.beforeSequenceInsertOrDelete
          ? props.beforeSequenceInsertOrDelete(
              tidyUpSequenceData(_sequenceDataToInsert),
              tidyUpSequenceData(_existingSequenceData),
              _caretPositionOrRange,
              _options
            ) || {}
          : {};
        return [
          insertSequenceDataAtPositionOrRange(
            sequenceDataToInsert || _sequenceDataToInsert,
            existingSequenceData || _existingSequenceData,
            caretPositionOrRange || _caretPositionOrRange,
            options || _options
          ),
          options || _options || {}
        ];
      };
    },

    upsertTranslation: (props) => {
      return async (translationToUpsert) => {
        if (!translationToUpsert) return;
        const { _upsertTranslation, sequenceData } = props;
        if (
          !translationToUpsert.id &&
          some(sequenceData.translations || [], (existingTranslation) => {
            if (
              //check if an identical existingTranslation exists already
              existingTranslation.translationType === "User Created" &&
              existingTranslation.start === translationToUpsert.start &&
              existingTranslation.end === translationToUpsert.end &&
              !!translationToUpsert.forward === !!existingTranslation.forward
            ) {
              return true;
            }
          })
        ) {
          const doAction = await showConfirmationDialog({
            // intent: Intent.DANGER, //applied to the right most confirm button
            confirmButtonText: "Create Translation",
            canEscapeKeyCancel: true, //this is false by default
            text: "This region has already been translated. Are you sure you want to make another translation for it?"
          });
          if (!doAction) return; //stop early
        }
        _upsertTranslation(translationToUpsert);
      };
    }
  }),
  withHandlers({
    handleSave,
    importSequenceFromFile,
    exportSequenceToFile,
    updateCircular,
    //add additional "computed handlers here"
    selectAll: (props) => () => {
      const { sequenceLength, selectionLayerUpdate } = props;
      sequenceLength > 0 &&
        selectionLayerUpdate({
          start: 0,
          end: sequenceLength - 1
        });
    },
    //handleNewPrimer handleNewFeature handleNewPart
    ...["Part", "Feature", "Primer"].reduce((acc, key) => {
      acc[`handleNew${key}`] = (props) => () => {
        const { readOnly, selectionLayer, caretPosition, sequenceData } = props;

        if (readOnly) {
          window.toastr.warning(
            `Sorry, Can't Create New ${key}s in Read-Only Mode`
          );
        } else {
          const rangeToUse =
            selectionLayer.start > -1
              ? { ...selectionLayer, id: undefined }
              : caretPosition > -1
              ? {
                  start: caretPosition,
                  end: sequenceData.isProtein
                    ? caretPosition + 2
                    : caretPosition
                }
              : {
                  start: 0,
                  end: sequenceData.isProtein ? 2 : 0
                };
          showAddOrEditAnnotationDialog({
            type: key.toLowerCase(),
            annotation: {
              ...rangeToUse,
              forward: !(selectionLayer.forward === false)
            }
          });
        }
      };
      return acc;
    }, {}),

    handleRotateToCaretPosition: (props) => () => {
      const {
        caretPosition,
        readOnly,
        sequenceData,
        updateSequenceData,
        caretPositionUpdate
      } = props;
      if (readOnly) {
        return;
      }
      if (caretPosition < 0) return;
      updateSequenceData(
        rotateSequenceDataToPosition(sequenceData, caretPosition)
      );
      caretPositionUpdate(0);
    },

    handleReverseComplementSelection: (props) => () => {
      const {
        sequenceData,
        updateSequenceData,
        wrappedInsertSequenceDataAtPositionOrRange,
        selectionLayer
      } = props;
      if (!(selectionLayer.start > -1)) {
        return; //return early
      }
      const reversedSeqData = getReverseComplementSequenceAndAnnotations(
        sequenceData,
        {
          range: selectionLayer
        }
      );
      const [newSeqData] = wrappedInsertSequenceDataAtPositionOrRange(
        reversedSeqData,
        sequenceData,
        selectionLayer,
        {
          maintainOriginSplit: true
        }
      );
      updateSequenceData(newSeqData);
    },

    handleComplementSelection: (props) => () => {
      const {
        sequenceData,
        updateSequenceData,
        selectionLayer,
        wrappedInsertSequenceDataAtPositionOrRange
      } = props;
      if (!(selectionLayer.start > -1)) {
        return; //return early
      }
      const comp = getComplementSequenceAndAnnotations(sequenceData, {
        range: selectionLayer
      });
      const [newSeqData] = wrappedInsertSequenceDataAtPositionOrRange(
        comp,
        sequenceData,
        selectionLayer,
        {
          maintainOriginSplit: true
        }
      );
      updateSequenceData(newSeqData);
    },

    handleReverseComplementSequence: (props) => () => {
      const { sequenceData, updateSequenceData } = props;
      updateSequenceData(
        getReverseComplementSequenceAndAnnotations(sequenceData)
      );
      window.toastr.success("Reverse Complemented Sequence Successfully");
    },

    handleComplementSequence: (props) => () => {
      const { sequenceData, updateSequenceData } = props;
      updateSequenceData(getComplementSequenceAndAnnotations(sequenceData));
      window.toastr.success("Complemented Sequence Successfully");
    },
    handleInverse
  })
);

function mapStateToProps(state, ownProps) {
  const {
    editorName,
    sequenceData: sequenceDataFromProps,
    allowSeqDataOverride,
    allowMultipleFeatureDirections
  } = ownProps;
  const meta = { editorName };
  const { VectorEditor } = state;
  const { __allEditorsOptions } = VectorEditor;
  const { uppercaseSequenceMapFont } = __allEditorsOptions;
  const editorState = VectorEditor[editorName];

  if (!editorState) {
    return editorReducer({}, {});
  }

  const {
    findTool,
    annotationVisibility,
    annotationLabelVisibility,
    annotationsToSupport = {}
  } = editorState;
  const visibilities = getVisibilities(
    annotationVisibility,
    annotationLabelVisibility,
    annotationsToSupport
  );
  let annotationToAdd;
  [
    ["AddOrEditFeatureDialog", "filteredFeatures", "features"],
    ["AddOrEditPrimerDialog", "primers", "primers"],
    ["AddOrEditPartDialog", "filteredParts", "parts"]
  ].forEach(([n, type, annotationTypePlural]) => {
    const vals = getFormValues(n)(state);
    if (vals) {
      annotationToAdd = {
        color: getFeatureToColorMap({ includeHidden: true })[
          vals.type || "primer_bind"
        ], //we won't have the correct color yet so we set it here
        ...vals,
        formName: n,
        type,
        annotationTypePlural,
        name: vals.name || "Untitled"
      };
      if (!vals.useLinkedOligo) {
        delete annotationToAdd.bases;
      }
    }
  });

  const toReturn = {
    ...editorState,
    meta,
    annotationToAdd
  };

  if (sequenceDataFromProps && allowSeqDataOverride) {
    //return early here because we don't want to override the sequenceData being passed in
    //this is a little hacky but allows us to track selectionLayer/caretIndex using redux but on a sequence that isn't being stored alongside that info
    return toReturn;
  }

  const sequenceData = s.sequenceDataSelector(editorState);
  const filteredCutsites = s.filteredCutsitesSelector(
    editorState,
    ownProps.additionalEnzymes,
    ownProps.enzymeGroupsOverride
  );
  const cutsites = filteredCutsites.cutsitesArray;
  const filteredRestrictionEnzymes =
    s.filteredRestrictionEnzymesSelector(editorState);
  const isEnzymeFilterAnd = s.isEnzymeFilterAndSelector(editorState);
  const orfs = s.orfsSelector(editorState);
  const selectedCutsites = s.selectedCutsitesSelector(editorState);
  const allCutsites = s.cutsitesSelector(
    editorState,
    ownProps.additionalEnzymes
  );
  const translations = s.translationsSelector(editorState);
  const filteredFeatures = s.filteredFeaturesSelector(editorState);
  const filteredParts = s.filteredPartsSelector(editorState);
  const sequenceLength = s.sequenceLengthSelector(editorState);

  let matchedSearchLayer = { start: -1, end: -1 };
  const annotationSearchMatches = s.annotationSearchSelector(editorState);
  let searchLayers = s.searchLayersSelector(editorState).map((item, index) => {
    let itemToReturn = item;
    if (index === findTool.matchNumber) {
      itemToReturn = {
        ...item,
        className: item.className + " veSearchLayerActive"
      };
      matchedSearchLayer = itemToReturn;
    }
    return itemToReturn;
  });
  const matchesTotal = searchLayers.length;
  if (
    (!findTool.highlightAll && searchLayers[findTool.matchNumber]) ||
    searchLayers.length > MAX_MATCHES_DISPLAYED
  ) {
    searchLayers = [searchLayers[findTool.matchNumber]];
  }
  this.sequenceData = sequenceData;
  this.cutsites = cutsites;
  this.orfs = orfs;
  this.translations = translations;

  const sequenceDataToUse = {
    ...sequenceData,
    sequence: getUpperOrLowerSeq(
      uppercaseSequenceMapFont,
      sequenceData.sequence
    ),
    filteredParts,
    filteredFeatures,
    cutsites,
    orfs,
    translations
  };

  if (annotationToAdd) {
    const selectionLayer = convertRangeTo0Based(annotationToAdd);
    delete selectionLayer.color;
    const id = annotationToAdd.id || "tempId123";
    const name = annotationToAdd.name || "";
    const anns = keyBy(sequenceDataToUse[annotationToAdd.type], "id");
    let toSpread = {};
    if (
      annotationToAdd.annotationTypePlural === "features" &&
      allowMultipleFeatureDirections &&
      annotationToAdd.arrowheadType !== undefined
    ) {
      toSpread = {
        forward: annotationToAdd.arrowheadType !== "BOTTOM",
        arrowheadType: annotationToAdd.arrowheadType
      };
    }
    anns[id] = {
      ...annotationToAdd,
      id,
      name,
      ...selectionLayer,
      ...(annotationToAdd.bases && {
        // ...getStartEndFromBases({ ...annotationToAdd, sequenceLength }),
        fullSeq: sequenceData.sequence
      }),
      ...toSpread,
      locations: annotationToAdd.locations
        ? annotationToAdd.locations.map(convertRangeTo0Based)
        : undefined
    };
    sequenceDataToUse[annotationToAdd.type] = anns;
    toReturn.selectionLayer = selectionLayer;
  }

  return {
    ...toReturn,
    selectedCutsites,
    sequenceLength,
    allCutsites,
    filteredCutsites,
    filteredRestrictionEnzymes,
    isEnzymeFilterAnd,
    annotationSearchMatches,
    searchLayers,
    matchedSearchLayer,
    findTool: {
      ...findTool,
      matchesTotal
    },
    annotationsToSupport,
    annotationVisibility: visibilities.annotationVisibilityToUse,
    typesToOmit: visibilities.typesToOmit,
    annotationLabelVisibility: visibilities.annotationLabelVisibilityToUse,
    sequenceData: sequenceDataToUse,
    uppercaseSequenceMapFont,
    showGCContent: getShowGCContent(state, ownProps)
  };
}

export function mapDispatchToActions(dispatch, ownProps) {
  const { editorName } = ownProps;

  const { actionOverrides = fakeActionOverrides } = ownProps;
  const actionsToPass = getCombinedActions(
    editorName,
    actions,
    actionOverrides,
    dispatch
  );
  const updateSel =
    ownProps.selectionLayerUpdate || actionsToPass.selectionLayerUpdate;
  const updateCar =
    ownProps.caretPositionUpdate || actionsToPass.caretPositionUpdate;
  return {
    ...actionsToPass,
    selectionLayerUpdate: ownProps.onSelectionOrCaretChanged
      ? (selectionLayer) => {
          ownProps.onSelectionOrCaretChanged({
            selectionLayer,
            caretPosition: -1
          });
          updateSel(selectionLayer);
        }
      : updateSel,
    caretPositionUpdate: ownProps.onSelectionOrCaretChanged
      ? (caretPosition) => {
          ownProps.onSelectionOrCaretChanged({
            caretPosition,
            selectionLayer: { start: -1, end: -1 }
          });
          updateCar(caretPosition);
        }
      : updateCar,

    dispatch
  };
}

const defaultOverrides = {};
export function fakeActionOverrides() {
  return defaultOverrides;
}

export function getCombinedActions(
  editorName,
  actions,
  actionOverrides,
  dispatch
) {
  const meta = { editorName };

  let metaActions = addMetaToActionCreators(actions, meta);
  // let overrides = addMetaToActionCreators(actionOverrides(metaActions), meta);
  const overrides = {};
  metaActions = {
    undo: () => {
      window.toastr.success("Undo Successful");
      return {
        type: "VE_UNDO",
        meta: {
          editorName
        }
      };
    },
    redo: () => {
      window.toastr.success("Redo Successful");
      return {
        type: "VE_REDO",
        meta: {
          editorName
        }
      };
    },
    ...metaActions,
    ...overrides
  };
  //add meta to all action creators before passing them to the override function
  // var metaActions = addMetaToActionCreators(actions, meta)
  // let metaOverrides = addMetaToActionCreators(
  //   actionOverrides(metaActions),
  //   meta
  // );

  //rebind the actions with dispatch and meta
  const actionsToPass = {
    ...metaActions
    // ...metaOverrides
  };
  return bindActionCreators(actionsToPass, dispatch);
}

function truncateOriginSpanningAnnotations(seqData) {
  const {
    features = [],
    parts = [],
    translations = [],
    primers = [],
    sequence
  } = seqData;
  return {
    ...seqData,
    features: truncateOriginSpanners(features, sequence.length),
    parts: truncateOriginSpanners(parts, sequence.length),
    translations: truncateOriginSpanners(translations, sequence.length),
    primers: truncateOriginSpanners(primers, sequence.length)
  };
}

function truncateOriginSpanners(annotations, sequenceLength) {
  return map(annotations, (annotation) => {
    const { start = 0, end = 0 } = annotation;
    if (start > end) {
      return {
        ...annotation,
        end: sequenceLength - 1
      };
    } else {
      return annotation;
    }
  });
}

function hasAnnotationThatSpansOrigin({
  features = [],
  parts = [],
  translations = [],
  primers = []
}) {
  return (
    doAnySpanOrigin(features) ||
    doAnySpanOrigin(parts) ||
    doAnySpanOrigin(translations) ||
    doAnySpanOrigin(primers)
  );
}
function doAnySpanOrigin(annotations) {
  return some(annotations, ({ start = 0, end = 0 }) => {
    if (start > end) return true;
  });
}

export const connectToEditor = (fn) => {
  return connect(
    (state, ownProps, ...rest) => {
      const editor = state.VectorEditor[ownProps.editorName] || {};
      editor.sequenceData = editor.sequenceData || {};
      editor.sequenceData.sequence = getUpperOrLowerSeq(
        state.VectorEditor.__allEditorsOptions.uppercaseSequenceMapFont,
        editor.sequenceData.sequence
      );

      return fn ? fn(editor, ownProps, ...rest, state) : {};
    },
    mapDispatchToActions
    // function mergeProps(propsFromState, propsFromDispatch) {
    //   return {
    //     ...propsFromState,
    //     ...propsFromDispatch
    //   };
    // }
  );
};

//this is to enhance non-redux connected views like LinearView, or CircularView or RowView
//so they can still render things like translations, ..etc

//Currently only supporting translations
export const withEditorPropsNoRedux = withProps((props) => {
  const {
    sequenceData,
    sequenceDataWithRefSeqCdsFeatures,
    annotationVisibility,
    annotationVisibilityOverrides
  } = props;
  const translations = s.translationsSelector({
    sequenceData: sequenceDataWithRefSeqCdsFeatures || sequenceData,
    annotationVisibility: {
      ...annotationVisibility,
      ...annotationVisibilityOverrides
    }
  });
  const toReturn = {
    sequenceData: {
      ...sequenceData,
      translations
    }
  };
  return toReturn;
});

export function getShowGCContent(state, ownProps) {
  const showGCContent = state.VectorEditor.__allEditorsOptions.showGCContent;

  const toRet =
    showGCContent === null
      ? ownProps.showGCContentByDefault //user hasn't yet set this option
      : showGCContent;
  return toRet;
}

function jsonToJson(incomingJson) {
  return JSON.stringify(
    omit(
      cleanUpTeselagenJsonForExport(
        tidyUpSequenceData(incomingJson, { annotationsAsObjects: false })
      ),
      [
        "sequenceFragments",
        "sequenceFeatures",
        "cutsites",
        "orfs",
        "filteredParts",
        "filteredFeatures"
      ]
    )
  );
}
