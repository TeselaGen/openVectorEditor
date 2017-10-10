import { bindActionCreators } from "redux";
import React from "react";
import {connect} from 'react-redux';
import addMetaToActionCreators from "../redux/utils/addMetaToActionCreators";
import { actions } from "../redux";
import HoverHelperComp from '../helperComponents/HoverHelper';
import s from "../selectors";


/**
 * This function basically connects the wrapped component with all of the state stored in a given editor instance
 * and then some extra goodies like computed properties and namespace bound action handlers
 */
export default connect((state, ownProps) => {
  const {editorName} = ownProps
  let meta = { editorName };
  let HoverHelper = function(props) {
    return (
      <HoverHelperComp
        {...{
          ...props,
          meta
        }}
      />
    );
  };  
  let { VectorEditor } = state; 
  let editorState = VectorEditor[editorName];
  if (!editorState) return {}
  let cutsites = s.filteredCutsitesSelector(editorState).cutsitesArray;
  let filteredRestrictionEnzymes = s.filteredRestrictionEnzymesSelector(
    editorState
  );
  let orfs = s.orfsSelector(editorState);
  let selectedCutsites = s.selectedCutsitesSelector(editorState);
  let allCutsites = s.cutsitesSelector(editorState);
  let translations = s.translationsSelector(editorState);
  let sequenceLength = s.sequenceLengthSelector(editorState);
  return {
    ...editorState,
    selectedCutsites,
    sequenceLength,
    allCutsites,
    filteredRestrictionEnzymes,
    sequenceData: {
      ...editorState.sequenceData,
      cutsites,
      orfs,
      translations
    },
    HoverHelper,
    // HoverHelper: _HoverHelper,
    meta,
  };

}, mapDispatchToActions)

function mapDispatchToActions(dispatch, ownProps) {
  const {editorName} = ownProps
  
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
  return { ...bindActionCreators(actionsToPass, dispatch), dispatch };
}

function fakeActionOverrides() {
  return {};
}
