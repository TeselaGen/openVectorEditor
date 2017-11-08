import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators as UndoActionCreators } from "redux-undo";
import { omit, memoize } from "lodash";
import lruMemoize from "lru-memoize";
import addMetaToActionCreators from "../redux/utils/addMetaToActionCreators";
import { actions } from "../redux";
import s from "../selectors";
import { allTypes } from "../utils/annotationTypes";

/**
 * This function basically connects the wrapped component with all of the state stored in a given editor instance
 * and then some extra goodies like computed properties and namespace bound action handlers
 */

export default connect(function(state, ownProps) {
  const { editorName, onSave = () => {} } = ownProps;
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

  const sequenceDataToUse = combineSequenceData(
    sequenceData,
    cutsites,
    orfs,
    translations
  );

  return {
    ...editorState,
    onSave: e => {
      onSave(e, sequenceData, editorState);
    },

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
    annotationVisibility: visibilities.annotationVisibilityToUse,
    typesToOmit: visibilities.typesToOmit,
    annotationLabelVisibility: visibilities.annotationLabelVisibilityToUse,
    sequenceData: sequenceDataToUse,
    meta
  };
}, mapDispatchToActions);

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
    dispatch
  };
}
const defaultOverrides = {};
function fakeActionOverrides() {
  return defaultOverrides;
}
const getCombinedActions = lruMemoize()(_getCombinedActions);

function _getCombinedActions(editorName, actions, actionOverrides, dispatch) {
  let meta = { editorName };

  let metaActions = addMetaToActionCreators(actions, meta);
  // let overrides = addMetaToActionCreators(actionOverrides(metaActions), meta);
  let overrides = {};
  metaActions = {
    undo: () => ({
      ...UndoActionCreators.undo(),
      meta: {
        editorName
      }
    }),
    redo: () => ({
      ...UndoActionCreators.redo(),
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

const getVisibilities = lruMemoize(
  1,
  undefined,
  true
)((annotationVisibility, annotationLabelVisibility, annotationsToSupport) => {
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
});
