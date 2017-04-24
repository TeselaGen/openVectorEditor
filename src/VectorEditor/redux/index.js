import combineReducers from '../../../redux/utils/combineReducers';
import selectionLayer, * as fromSelectionLayer from './selectionLayer'
import addYourOwnEnzyme, * as fromAddYourOwnEnzyme from './addYourOwnEnzyme'
import caretPosition, * as fromCaretPosition from './caretPosition'
import hoveredAnnotation, * as fromHoveredAnnotation from './hoveredAnnotation'
import minimumOrfSize, * as fromMinimumOrfSize from './minimumOrfSize'
import sequenceData, * as fromSequenceData from './sequenceData'
import annotationVisibility, * as fromAnnotationVisibility from './annotationVisibility'
import annotationLabelVisibility, * as fromAnnotationLabelVisibility from './annotationLabelVisibility'
import selectedAnnotations, * as fromSelectedAnnotations from './selectedAnnotations'
import restrictionEnzymes, * as fromRestrictionEnzymes from './restrictionEnzymes'
import deletionLayers, * as fromDeletionLayers from './deletionLayers'
import replacementLayers, * as fromReplacementLayers from './replacementLayers'
import panelsShown, * as fromPanelsShown from './panelsShown'
import lineageLines, * as fromLineageLines from './lineageLines'

// import pickBy from 'lodash/pickBy'
// import startsWith from 'lodash/startsWith'
import createAction from './utils/createMetaAction';

const vectorEditorInitialize = createAction('VECTOR_EDITOR_INITIALIZE')
const vectorEditorClear = createAction('VECTOR_EDITOR_CLEAR')

//export the actions for use elsewhere
export const actions = {
  ...fromSelectionLayer,
  ...fromCaretPosition,
  ...fromRestrictionEnzymes,
  ...fromSelectedAnnotations,
  ...fromAnnotationLabelVisibility,
  ...fromAnnotationVisibility,
  ...fromSequenceData,
  ...fromMinimumOrfSize,
  ...fromHoveredAnnotation,
  ...fromDeletionLayers,
  ...fromReplacementLayers,
  ...fromLineageLines,
  ...fromPanelsShown,
  vectorEditorInitialize,
  vectorEditorClear
}


//define the reducer
var reducers = {
  restrictionEnzymes,
  selectedAnnotations,
  annotationLabelVisibility,
  annotationVisibility,
  sequenceData,
  minimumOrfSize,
  hoveredAnnotation,
  caretPosition,
  selectionLayer,
  lineageLines,
  panelsShown,
  deletionLayers,
  replacementLayers
}

var topLevelReducers = {
  addYourOwnEnzyme
}

export default function (state={}, action) {
  var namespaces
  var newState = {}
  if (action.meta && action.meta.EditorNamespace) {
    namespaces = Array.isArray(action.meta.EditorNamespace) ? action.meta.EditorNamespace : [action.meta.EditorNamespace]
  }
  var stateToReturn
  if (namespaces) {
    //we're dealing with an action specific to a given editor
    namespaces.forEach(function (namespace) {
      var currentState = state[namespace]
      if (action.type === 'VECTOR_EDITOR_INITIALIZE') {
        //merge the exisiting state with the new payload of props (if you want to do a clean wipe, use VECTOR_EDITOR_CLEAR)
        currentState = {...state[namespace], ...action.payload} 
      }
      if (action.type === 'VECTOR_EDITOR_CLEAR') {
        currentState = undefined
      }
      newState[namespace] = combineReducers(reducers)(currentState, action)
    })
    stateToReturn = {
      ...state,
      ...newState
    }
  } else { 
    //just a normal action
    Object.keys(state).map(function(namespace){
      newState[namespace] = combineReducers(reducers)(state[namespace], action)
    });
    stateToReturn = newState
  }
  return {
    ...stateToReturn,
    ...combineReducers(topLevelReducers)(state,action)
  }

}

// export const getBlankEditor = (state) => (state.blankEditor)
export const getEditorByName = (state, editorName) => (state[editorName])
