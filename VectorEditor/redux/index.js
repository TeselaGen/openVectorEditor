// import combineReducers from '../../../redux/utils/combineReducers';
import combineReducers from 'redux/lib/combineReducers';
import selectionLayer, * as selectionLayerActions from './selectionLayer'
import caretPosition, * as caretPositionActions from './caretPosition'
import hoveredAnnotation, * as hoveredAnnotationActions from './hoveredAnnotation'
import sequenceData, * as sequenceDataActions from './sequenceData'
import annotationVisibility, * as annotationVisibilityActions from './annotationVisibility'
import selectedAnnotations, * as selectedAnnotationsActions from './selectedAnnotations'

import createAction from './utils/createNamespacedAction';

const vectorEditorInitialize = createAction('VECTOR_EDITOR_INITIALIZE')
const vectorEditorClear = createAction('VECTOR_EDITOR_CLEAR')

//export the actions for use elsewhere
export const actions = {
  ...selectionLayerActions,
  ...caretPositionActions,
  ...selectedAnnotationsActions,
  ...annotationVisibilityActions,
  ...sequenceDataActions,
  ...hoveredAnnotationActions,
  vectorEditorInitialize,
  vectorEditorClear
}

//define the reducer
var reducers = {
  selectedAnnotations,
  annotationVisibility,
  sequenceData,
  hoveredAnnotation,
  caretPosition,
  selectionLayer,
}

export default function (state={blankEditor:{}}, action) {
  var namespace 
  if (action.meta && action.meta.__VectorEditorInstanceName__) {
    namespace = action.meta.__VectorEditorInstanceName__
  }
  
  if (namespace) {
    var currentState = state[namespace]
    if (action.type === 'VECTOR_EDITOR_INITIALIZE') {
      currentState = {...state[namespace], ...action.payload}
    }
    if (action.type === 'VECTOR_EDITOR_CLEAR') {
      currentState = undefined
    }
    return {
      ...state,
      [namespace]: combineReducers(reducers)(currentState, action)
    }
  } else {
    var newState = {}
    Object.keys(state).map(function(namespace){
      newState[namespace] = combineReducers(reducers)(state[namespace], action)
    });
    return newState
  }
  
  // //only listen to actions we're interested in
  // // if (action.__VectorEditorInstanceName__) {
  // //   return state
  // // }
  // //we'll only be acting on a slice of the state being passed in
  // var newState;
  // // if (action.type === 'VECTOR_EDITOR_INITIALIZE') {
  // //   newState = action.payload
  // // } else {
  // newState = 
  // })(state, action)
  // // }
  // return newState
}




