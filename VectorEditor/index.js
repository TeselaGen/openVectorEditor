import sequenceSelector from './selectors/sequenceSelector';
import circularSelector from './selectors/circularSelector';
import enzymeList from './enzymeList.json';
import cleanSequenceData from './utils/cleanSequenceData';
import deepEqual from 'deep-equal';
import reducer, {actions} from './redux';
import selectors from './selectors';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import VectorInteractionWrapper from './VectorInteractionWrapper';

var oldProps
function mapDispatchToActions(dispatch, props) {
    var {
        children, actionOverrides, ...realProps
    } = props
    var newActions = actions;
    if (actionOverrides) {
        newActions = props.actionOverrides(actions)
    }
    //only bind the actions one time to prevent unecessary rendering 
    var boundActions = bindActionCreators(newActions, dispatch)
    // boundActions = bindActionCreators(actions, dispatch)

    
    if (!deepEqual(realProps, oldProps)) {
        setTimeout(function() {
            var cleanedRealProps = {
                ...realProps,
                sequenceData: cleanSequenceData(realProps.sequenceData, {logMessages: true})
            }
            //this is inside a setTimeout because we don't want to set state during a render cycle
            dispatch(actions.vectorEditorInitialize(cleanedRealProps, props.namespace))
        })
        oldProps = realProps
    }
    return boundActions
}
 
var Component = connect(function(state, props) {
        var {VectorEditor} = state
        //if the namespaced state is empty (which it will be on the very first render before it's been initialized)
        //then use the fake blankEditor data as a substitute
        var editorState = VectorEditor[props.namespace] || VectorEditor.blankEditor
        var cutsites = selectors.cutsitesSelector(sequenceSelector(editorState), circularSelector(editorState), props.enzymeList || enzymeList)
        
        //console.log('UPDATED PROPS');
        return {
            ...editorState,
            cutsites: cutsites.cutsitesArray,
        }
    },
    mapDispatchToActions)(VectorInteractionWrapper)
    

export {
        actions,
        selectors,
        reducer,
        Component
    }

