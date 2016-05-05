import without from 'lodash/without';
import sequenceLengthSelector from '../selectors/sequenceLengthSelector';
//./caretPosition.js
import updateSelectionOrCaret from '../utils/selectionAndCaretUtils/updateSelectionOrCaret';
import { createReducer } from 'redux-act'
import createAction from './utils/createNamespacedAction'
import * as caretPositionActions from './caretPosition';
import * as selectionLayerActions from './selectionLayer';
import bindActionCreatorsWithNamespace from './utils/bindActionCreatorsWithNamespace';
// ------------------------------------
// Actions
// ------------------------------------
// export const anno = createAction('VE_ANNOTATION_CLICK')
export const annotationSelect = createAction('VE_ANNOTATION_SELECT')
export const annotationDeselect = createAction('VE_ANNOTATION_DESELECT')
export const annotationDeselectAll = createAction('VE_ANNOTATION_DESELECT_ALL')

var annotationSelectionActions = {
	annotationSelect,
	annotationDeselect,
	annotationDeselectAll
}



// ------------------------------------
// Thunks
// ------------------------------------
export function cutsiteClicked ({event, annotation, namespace},override) {
	return function (dispatch, getState) {
		var args = {event, annotation, namespace, dispatch, getState}
		if (override) {
			override(args)
		} else {
			updateSelectionOrCaretBasedOnAnnotation(args)
			dispatch(annotationDeselectAll(undefined, namespace))
			dispatch(annotationSelect(annotation, namespace))
		}
	}
}

export function featureClicked ({event, annotation, namespace},override) {
	return function (dispatch, getState) {
		var args = {event, annotation, namespace, dispatch, getState}
		if (override) {
			override(args)
		} else {
			updateSelectionOrCaretBasedOnAnnotation(args)
			dispatch(annotationDeselectAll(undefined, namespace))
			dispatch(annotationSelect(annotation, namespace))
		}
	}
}

export function updateSelectionOrCaretBasedOnAnnotation ({event={}, annotation={}, namespace, dispatch, getState}) {
	var shiftHeld = event.shiftKey
	var newRangeOrCaret = annotation.annotationType === 'cutsite' ? annotation.downstreamTopSnip : annotation
	var {updateSelectionLayer, updateCaret, annotationSelect, annotationDeselectAll} = bindActionCreatorsWithNamespace({ ...annotationSelectionActions,...caretPositionActions, ...selectionLayerActions}, dispatch, namespace)
	var editorState = getState().VectorEditor[namespace]
	var {caretPosition, selectionLayer} = editorState
	var sequenceLength = sequenceLengthSelector(editorState)
	updateSelectionOrCaret({shiftHeld, sequenceLength, newRangeOrCaret, caretPosition, selectionLayer, updateSelectionLayer, updateCaret})
}


		// annotationDeselectAll()
		// annotationSelect(feature)


// export function cutsiteClicked(event, cutsite, namespace, options = {}) {
// 	var args1 = arguments
// 	var shiftHeld = event.shiftKey
	
// 	return function (dispatch, getState) {
// 		var actions = bindActionCreatorsWithNamespace({ ...annotationSelectionActions,...caretPositionActions, ...selectionLayerActions}, dispatch, namespace)
// 		var {updateSelectionLayer, 
// 			updateCaret, 
// 			annotationSelect,
// 			annotationDeselectAll
// 		} = actions
// 		//console.log('cutsite: ' + JSON.stringify(cutsite,null,4));

// 		var editorState = getState().VectorEditor[namespace]
// 		var {caretPosition, selectionLayer} = editorState
// 		var sequenceLength = sequenceLengthSelector(editorState)
// 		var updateSelectionOrCaretArgs = {shiftHeld, sequenceLength, newCaret, caretPosition, selectionLayer, updateSelectionLayer, updateCaret}
// 		if (options.doSomethingDifferent) {
// 			options.doSomethingDifferent({...arguments, args1, namespace, cutsite, editorState, ...actions, ...updateSelectionOrCaretArgs })
// 		} else {
// 			annotationDeselectAll()
// 			annotationSelect(cutsite)
// 			updateSelectionOrCaret(updateSelectionOrCaretArgs)
// 		}

// 	}
// }

// ------------------------------------
// Reducer
// ------------------------------------
const startingState = {
	idMap: {}, 
	idStack: []
}
export default createReducer({
  [annotationSelect]: (state,payload) => {
    if (!payload.id) debugger;
    var newState = {
    	idMap: {
	    	...state.idMap,
	    	[payload.id]: payload
    	},
    	idStack: [
    		...state.idStack,
	    	payload.id
    	]
    }
    return newState
  },
  [annotationDeselect]: (state,payload) => {
  	var id = payload.id || payload
    var idMap = {...state.idMap}
    delete idMap[id]
    var idStack = without(state.idStack, id)
    return {
    	idMap,
    	idStack
    }
  },
  [annotationDeselectAll]: (state,payload) => {
    return startingState
  },
}, startingState)

