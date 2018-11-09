import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import lruMemoize from "lru-memoize";
import { compose, withHandlers } from "recompose";
import { getFormValues /* formValueSelector */ } from "redux-form";
import { showConfirmationDialog } from "teselagen-react-components";
import { some, map } from "lodash";
import addMetaToActionCreators from "../redux/utils/addMetaToActionCreators";
import { actions } from "../redux";
import s from "../selectors";
import { allTypes } from "../utils/annotationTypes";
import {
  tidyUpSequenceData,
  getComplementSequenceAndAnnotations,
  insertSequenceDataAtPositionOrRange,
  getReverseComplementSequenceAndAnnotations
} from "ve-sequence-utils";
import { Intent } from "@blueprintjs/core";

import { getRangeLength, invertRange, normalizeRange } from "ve-range-utils";

// const addFeatureSelector = formValueSelector("AddOrEditFeatureDialog");
// const addPrimerSelector = formValueSelector("AddOrEditPrimerDialog");
// const addPartSelector = formValueSelector("AddOrEditPartDialog");

/**
 * This function basically connects the wrapped component with all of the state stored in a given editor instance
 * and then some extra goodies like computed properties and namespace bound action handlers
 */
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToActions,
    null,
    { pure: false }
  ),
  withHandlers({
    handleSave: props => {
      return e => {
        const { onSave, readOnly, sequenceData, lastSavedIdUpdate } = props;
        const updateLastSavedIdToCurrent = () => {
          lastSavedIdUpdate(sequenceData.stateTrackingId);
        };
        const promiseOrVal =
          !readOnly &&
          onSave &&
          onSave(
            e,
            tidyUpSequenceData(sequenceData, { annotationsAsObjects: true }),
            props,
            updateLastSavedIdToCurrent
          );

        if (promiseOrVal && promiseOrVal.then) {
          return promiseOrVal.then(updateLastSavedIdToCurrent);
        }
        // return updateLastSavedIdToCurrent()
      };
    },
    updateCircular: props => {
      return async isCircular => {
        const { _updateCircular, updateSequenceData, sequenceData } = props;
        if (!isCircular && hasAnnotationThatSpansOrigin(sequenceData)) {
          const doAction = await showConfirmationDialog({
            intent: Intent.DANGER, //applied to the right most confirm button
            confirmButtonText: "Truncate Annotations",
            canEscapeKeyCancel: true, //this is false by default
            text:
              "Careful! Origin spanning annotations will be truncated. Are you sure you want to make the sequence linear?"
          });
          if (!doAction) return; //stop early
          updateSequenceData(truncateOriginSpanningAnnotations(sequenceData), {
            batchUndoStart: true
          });
        }
        _updateCircular(isCircular, { batchUndoEnd: true });
      };
    },
    upsertTranslation: props => {
      return async translationToUpsert => {
        if (!translationToUpsert) return;
        const { _upsertTranslation, sequenceData } = props;
        if (
          !translationToUpsert.id &&
          some(sequenceData.translations || [], existingTranslation => {
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
            text:
              "This region has already been translated. Are you sure you want to make another translation for it?"
          });
          if (!doAction) return; //stop early
        }
        _upsertTranslation(translationToUpsert);
      };
    },

    //add additional "computed handlers here"
    selectAll: props => () => {
      const { sequenceLength, selectionLayerUpdate } = props;
      sequenceLength > 0 &&
        selectionLayerUpdate({
          start: 0,
          end: sequenceLength - 1
        });
    },

    handleNewPart: props => () => {
      const {
        selectionLayer,
        caretPosition,
        showAddOrEditPartDialog,
        readOnly
      } = props;
      const rangeToUse =
        selectionLayer.start > -1
          ? selectionLayer
          : caretPosition > -1
            ? { start: caretPosition, end: caretPosition }
            : undefined;
      if (readOnly) {
        window.toastr.warning(
          "Sorry, can't create new parts in read-only mode"
        );
      } else {
        showAddOrEditPartDialog({ ...rangeToUse, forward: true });
      }
    },

    handleNewFeature: props => () => {
      const {
        selectionLayer,
        caretPosition,
        showAddOrEditFeatureDialog,
        readOnly
      } = props;
      const rangeToUse =
        selectionLayer.start > -1
          ? selectionLayer
          : caretPosition > -1
            ? { start: caretPosition, end: caretPosition }
            : undefined;
      if (readOnly) {
        window.toastr.warning(
          "Sorry, can't create new features in read-only mode"
        );
      } else {
        showAddOrEditFeatureDialog({ ...rangeToUse, forward: true });
      }
    },

    handleReverseComplementSelection: props => () => {
      const {
        sequenceData,
        updateSequenceData,
        // caretPositionUpdate,
        selectionLayerUpdate,
        selectionLayer
      } = props;
      if (!(selectionLayer.start > -1)) {
        return; //return early
      }
      updateSequenceData(
        insertSequenceDataAtPositionOrRange(
          getReverseComplementSequenceAndAnnotations(sequenceData, {
            range: selectionLayer
          }),
          sequenceData,
          selectionLayer
        )
      );
      // caretPositionUpdate(0);
      // selectionLayerUpdate(selectionLayer);
      setTimeout(() => {
        selectionLayerUpdate({ ...selectionLayer, forceUpdate: Math.random() });
      });
    },

    handleComplementSelection: props => () => {
      const {
        sequenceData,
        // caretPositionUpdate,
        updateSequenceData,
        selectionLayerUpdate,
        selectionLayer
      } = props;
      if (!(selectionLayer.start > -1)) {
        return; //return early
      }
      const comp = getComplementSequenceAndAnnotations(sequenceData, {
        range: selectionLayer
      });
      const newSeqData = insertSequenceDataAtPositionOrRange(
        comp,
        sequenceData,
        selectionLayer
      );
      updateSequenceData(newSeqData);
      // caretPositionUpdate(0);
      setTimeout(() => {
        selectionLayerUpdate({ ...selectionLayer, forceUpdate: Math.random() });
      });
    },

    handleReverseComplementSequence: props => () => {
      const { sequenceData, updateSequenceData } = props;
      updateSequenceData(
        getReverseComplementSequenceAndAnnotations(sequenceData)
      );
    },

    handleComplementSequence: props => () => {
      const { sequenceData, updateSequenceData } = props;
      updateSequenceData(getComplementSequenceAndAnnotations(sequenceData));
    },
    /* eslint-enable no-unused-vars */

    handleNewPrimer: props => () => {
      const {
        selectionLayer,
        caretPosition,
        showAddOrEditPrimerDialog,
        readOnly
        // sequenceLength
      } = props;
      const rangeToUse =
        selectionLayer.start > -1
          ? selectionLayer
          : caretPosition > -1
            ? { start: caretPosition, end: caretPosition }
            : undefined;
      if (readOnly) {
        window.toastr.warning(
          "Sorry, can't create new primers in read-only mode"
        );
      } else {
        showAddOrEditPrimerDialog({ ...rangeToUse, forward: true });
      }
    },

    handleInverse: props => context => {
      const {
        sequenceLength,
        selectionLayer,
        caretPosition,
        selectionLayerUpdate,
        caretPositionUpdate
      } = context ? context.props : props;
      if (sequenceLength <= 0) {
        return false;
      }
      if (selectionLayer.start > -1) {
        if (getRangeLength(selectionLayer) === sequenceLength) {
          caretPositionUpdate(selectionLayer.start);
        } else {
          selectionLayerUpdate(invertRange(selectionLayer));
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
    }
  })
);

function mapStateToProps(state, ownProps) {
  const {
    editorName,
    sequenceData: sequenceDataFromProps,
    allowSeqDataOverride
  } = ownProps;
  let meta = { editorName };
  let { VectorEditor } = state;
  const { __allEditorsOptions } = VectorEditor;
  const { uppercaseSequenceMapFont } = __allEditorsOptions;
  let editorState = VectorEditor[editorName];

  if (!editorState) {
    return {};
  }

  const {
    findTool,
    annotationVisibility,
    annotationLabelVisibility,
    annotationsToSupport = {}
  } = editorState;
  let visibilities = getVisibilities(
    annotationVisibility,
    annotationLabelVisibility,
    annotationsToSupport
  );
  const annotationToAdd =
    // addFeatureSelector(state, "start", "end") ||
    // addPrimerSelector(state, "start", "end") ||
    // addPartSelector(state, "start", "end");
    getFormValues("AddOrEditFeatureDialog")(state) ||
    getFormValues("AddOrEditPrimerDialog")(state) ||
    getFormValues("AddOrEditPartDialog")(state);

  let toReturn = {
    ...editorState,
    meta,
    ...(annotationToAdd && {
      selectionLayer: {
        start: (annotationToAdd.start || 1) - 1,
        end: (annotationToAdd.end || 1) - 1
      }
    })
  };
  if (sequenceDataFromProps && allowSeqDataOverride) {
    //return early here because we don't want to override the sequenceData being passed in
    //this is a little hacky but allows us to track selectionLayer/caretIndex using redux but on a sequence that isn't being stored alongside that info
    return toReturn;
  }

  let sequenceData = s.sequenceDataSelector(editorState);
  const filteredCutsites = s.filteredCutsitesSelector(editorState);
  let cutsites = filteredCutsites.cutsitesArray;
  let filteredRestrictionEnzymes = s.filteredRestrictionEnzymesSelector(
    editorState
  );
  let orfs = s.orfsSelector(editorState);
  let selectedCutsites = s.selectedCutsitesSelector(editorState);
  let allCutsites = s.cutsitesSelector(editorState);
  let translations = s.translationsSelector(editorState);
  let sequenceLength = s.sequenceLengthSelector(editorState);

  let matchedSearchLayer = { start: -1, end: -1 };
  let searchLayers = s.searchLayersSelector(editorState).map((item, index) => {
    let itemToReturn = item;
    if (index === findTool.matchNumber) {
      itemToReturn = {
        ...item,
        color: "red"
      };
      matchedSearchLayer = itemToReturn;
    }
    return itemToReturn;
  });
  const matchesTotal = searchLayers.length;
  if (!findTool.highlightAll && searchLayers[findTool.matchNumber]) {
    searchLayers = [searchLayers[findTool.matchNumber]];
  }
  this.sequenceData = sequenceData;
  this.cutsites = cutsites;
  this.orfs = orfs;
  this.translations = translations;
  let sequenceDataToUse = {
    ...sequenceData,
    cutsites,
    orfs,
    translations
  };

  return {
    ...toReturn,
    selectedCutsites,
    sequenceLength,
    allCutsites,
    filteredCutsites,
    filteredRestrictionEnzymes,
    searchLayers,
    matchedSearchLayer,
    findTool: {
      ...findTool,
      matchesTotal
    },
    hasBeenSaved:
      sequenceData.stateTrackingId === "initialLoadId" ||
      sequenceData.stateTrackingId === editorState.lastSavedId,
    annotationVisibility: visibilities.annotationVisibilityToUse,
    typesToOmit: visibilities.typesToOmit,
    annotationLabelVisibility: visibilities.annotationLabelVisibilityToUse,
    sequenceData: sequenceDataToUse,
    uppercaseSequenceMapFont
  };
}

function mapDispatchToActions(dispatch, ownProps) {
  const { editorName } = ownProps;

  let { actionOverrides = fakeActionOverrides } = ownProps;
  let actionsToPass = getCombinedActions(
    editorName,
    actions,
    actionOverrides,
    dispatch
  );
  return {
    ...actionsToPass,
    selectionLayerUpdate:
      ownProps.selectionLayerUpdate || actionsToPass.selectionLayerUpdate,
    caretPositionUpdate:
      ownProps.caretPositionUpdate || actionsToPass.caretPositionUpdate,
    dispatch
  };
}
const defaultOverrides = {};
export function fakeActionOverrides() {
  return defaultOverrides;
}

export const getCombinedActions = lruMemoize()(_getCombinedActions);

function _getCombinedActions(editorName, actions, actionOverrides, dispatch) {
  let meta = { editorName };

  let metaActions = addMetaToActionCreators(actions, meta);
  // let overrides = addMetaToActionCreators(actionOverrides(metaActions), meta);
  let overrides = {};
  metaActions = {
    undo: () => ({
      type: "VE_UNDO",
      meta: {
        editorName
      }
    }),
    redo: () => ({
      type: "VE_REDO",
      meta: {
        editorName
      }
    }),
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
  let actionsToPass = {
    ...metaActions
    // ...metaOverrides
  };
  return bindActionCreators(actionsToPass, dispatch);
}

const getTypesToOmit = annotationsToSupport => {
  let typesToOmit = {};
  allTypes.forEach(type => {
    if (!annotationsToSupport[type]) typesToOmit[type] = false;
  });
  return typesToOmit;
};

const getVisibilities = lruMemoize(1, undefined, true)(
  (annotationVisibility, annotationLabelVisibility, annotationsToSupport) => {
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
  }
);

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
  return map(annotations, annotation => {
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
