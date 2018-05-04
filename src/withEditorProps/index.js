import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators as UndoActionCreators } from "redux-undo";
import lruMemoize from "lru-memoize";
import { compose, withHandlers } from "recompose";
import { getFormValues /* formValueSelector */ } from "redux-form";
import addMetaToActionCreators from "../redux/utils/addMetaToActionCreators";
import { actions } from "../redux";
import s from "../selectors";
import { allTypes } from "../utils/annotationTypes";
import { tidyUpSequenceData } from "ve-sequence-utils";
// const addFeatureSelector = formValueSelector("AddOrEditFeatureDialog");
// const addPrimerSelector = formValueSelector("AddOrEditPrimerDialog");
// const addPartSelector = formValueSelector("AddOrEditPartDialog");

/**
 * This function basically connects the wrapped component with all of the state stored in a given editor instance
 * and then some extra goodies like computed properties and namespace bound action handlers
 */
export default compose(
  connect(mapStateToProps, mapDispatchToActions),
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
    //add additional "computed handlers here"
    selectAll: props => () => {
      const { sequenceLength, selectionLayerUpdate } = props;
      sequenceLength > 0 &&
        selectionLayerUpdate({
          start: 0,
          end: sequenceLength - 1
        });
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
  let cutsites = s.filteredCutsitesSelector(editorState).cutsitesArray;
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
  let sequenceDataToUse = combineSequenceData(
    sequenceData,
    cutsites,
    orfs,
    translations
  );

  // const featureToAdd = getFormValues("AddOrEditFeatureDialog")(state);
  // if (featureToAdd) {
  //   sequenceDataToUse.features = {
  //     ...sequenceDataToUse.features,
  //     [featureToAdd.id || "toAdd"]: {
  //       ...featureToAdd,
  //       id: featureToAdd.id || "toAdd",
  //       name: featureToAdd.name || "Untitled Sequence",
  //       start: featureToAdd.start || 0,
  //       end: featureToAdd.end || 0,
  //     }
  //   };
  // }
  // const primerToAdd = getFormValues("AddOrEditPrimerDialog")(state);
  // if (primerToAdd) {
  //   sequenceDataToUse.primers = {
  //     ...sequenceDataToUse.primers,
  //     [primerToAdd.id || "toAdd"]: {
  //       ...primerToAdd,
  //       id: primerToAdd.id || "toAdd",
  //       name: primerToAdd.name || "Untitled Sequence",
  //       start: primerToAdd.start || 0,
  //       end: primerToAdd.end || 0,
  //     }
  //   };
  // }
  // const partToAdd = getFormValues("AddOrEditPartDialog")(state);
  // if (partToAdd) {
  //   sequenceDataToUse.parts = {
  //     ...sequenceDataToUse.parts,
  //     [partToAdd.id || "toAdd"]: { ...partToAdd,
  //       id: partToAdd.id || "toAdd" ,
  //       name: partToAdd.name || "Untitled Sequence",
  //       start: partToAdd.start || 0,
  //       end: partToAdd.end || 0,
  //     }
  //   };
  // }
  return {
    ...toReturn,
    selectedCutsites,
    sequenceLength,
    allCutsites,

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
    sequenceData: sequenceDataToUse
  };
}

const combineSequenceData = lruMemoize()(
  (sequenceData, cutsites, orfs, translations) => ({
    ...sequenceData,
    cutsites,
    orfs,
    translations
  })
);

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
