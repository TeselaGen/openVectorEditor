// import cleanSequenceData from './utils/cleanSequenceData';
// import deepEqual from 'deep-equal';
import './coreStyle.scss';
import reducer, { actions } from './redux';
import s from './selectors';
import { connect } from 'react-redux';
import React from 'react'
import addMetaToActionCreators from './redux/utils/addMetaToActionCreators'
import { bindActionCreators } from 'redux';
import VectorInteractionWrapper from './VectorInteractionWrapper';
import _HoverHelper from './HoverHelper'
export default function createVectorEditor({namespace, actionOverrides=fakeActionOverrides}) {
  var meta = {namespace}
  var HoverHelper = function (props) {
                return <_HoverHelper {...{
                        ...props,
                        meta
                    }} />
            };
  var metaActions = addMetaToActionCreators(actions, meta)
  var overrides = addMetaToActionCreators(actionOverrides(metaActions), meta)
  //rebind the actions with dispatch and meta
  metaActions = {
    ...metaActions,
    ...overrides
  }
  
  function mapDispatchToActions(dispatch, props) {
    var {actionOverrides=fakeActionOverrides} = props
    //add meta to all action creators before passing them to the override function
    // var metaActions = addMetaToActionCreators(actions, meta)
    var metaOverrides = addMetaToActionCreators(actionOverrides(metaActions), meta)
    //rebind the actions with dispatch and meta
    var actionsToPass = {
      ...metaActions,
      ...metaOverrides
    }
    return {...bindActionCreators(actionsToPass, dispatch), dispatch}
  }
  
  var VectorEditorContainer = connect(function(state, props) {
    var {VectorEditor} = state
    //then use the fake blankEditor data as a substitute
    var editorState = VectorEditor[meta.namespace]
    var cutsites = s.filteredCutsitesSelector(editorState).cutsitesArray
    var filteredRestrictionEnzymes = s.filteredRestrictionEnzymesSelector(editorState)
    var orfs = s.orfsSelector(editorState)
    var selectedCutsites = s.selectedCutsitesSelector(editorState)
    var allCutsites = s.cutsitesSelector(editorState)
    var translations = s.translationsSelector(editorState)
    var sequenceLength = s.sequenceLengthSelector(editorState)
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
      ...props
    }
  },
  mapDispatchToActions)
  var VectorEditor = VectorEditorContainer(VectorInteractionWrapper)
  
    
  return { veActions: metaActions, veSelectors: s, VectorEditor, VectorEditorContainer, HoverHelper}
}
export {reducer}

function fakeActionOverrides() {
  return {}
}