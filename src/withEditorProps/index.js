import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators as UndoActionCreators } from "redux-undo";
import addMetaToActionCreators from "../redux/utils/addMetaToActionCreators";
import { actions } from "../redux";
import s from "../selectors";

/**
 * This function basically connects the wrapped component with all of the state stored in a given editor instance
 * and then some extra goodies like computed properties and namespace bound action handlers
 */
export default connect((state, ownProps) => {
  const { editorName, onSave = () => {} } = ownProps;
  let meta = { editorName };
  let { VectorEditor } = state;
  let editorState = VectorEditor[editorName];

  if (!editorState) {
    return {};
  }
  let sequenceData = s.sequenceDataSelector(editorState);
  let cutsites = s.filteredCutsitesSelector(editorState).cutsitesArray;
  let filteredRestrictionEnzymes = s.filteredRestrictionEnzymesSelector(
    editorState
  );
  const { findTool } = editorState;
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
      ...editorState.findTool,
      matchesTotal
    },
    sequenceData: {
      ...sequenceData,
      cutsites,
      orfs,
      translations
    },
    meta
  };
}, mapDispatchToActions);

function mapDispatchToActions(dispatch, ownProps) {
  const { editorName } = ownProps;

  let meta = { editorName };
  let { actionOverrides = fakeActionOverrides } = ownProps;
  let metaActions = addMetaToActionCreators(actions, meta);
  let overrides = addMetaToActionCreators(actionOverrides(metaActions), meta);
  //rebind the actions with dispatch and meta
  metaActions = {
    ...metaActions,
    ...overrides
  };
  //add meta to all action creators before passing them to the override function
  // var metaActions = addMetaToActionCreators(actions, meta)
  let metaOverrides = addMetaToActionCreators(
    actionOverrides(metaActions),
    meta
  );
  //rebind the actions with dispatch and meta
  let actionsToPass = {
    ...metaActions,
    ...metaOverrides
  };
  return {
    ...bindActionCreators(actionsToPass, dispatch),
    undo: () => {
      dispatch({
        ...UndoActionCreators.undo(),
        meta: {
          editorName
        }
      });
    },
    redo: () => {
      dispatch({
        ...UndoActionCreators.redo(),
        meta: {
          editorName
        }
      });
    },
    dispatch
  };
}

function fakeActionOverrides() {
  return {};
}
