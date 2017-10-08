import { combineReducers } from "redux";
import selectionLayer, * as fromSelectionLayer from "./selectionLayer";
import caretPosition, * as fromCaretPosition from "./caretPosition";
import hoveredAnnotation, * as fromHoveredAnnotation from "./hoveredAnnotation";
import minimumOrfSize, * as fromMinimumOrfSize from "./minimumOrfSize";
import sequenceData, * as fromSequenceData from "./sequenceData";
import annotationVisibility, * as fromAnnotationVisibility
  from "./annotationVisibility";
import annotationLabelVisibility, * as fromAnnotationLabelVisibility
  from "./annotationLabelVisibility";
import selectedAnnotations, * as fromSelectedAnnotations
  from "./selectedAnnotations";
import restrictionEnzymes, * as fromRestrictionEnzymes
  from "./restrictionEnzymes";
import deletionLayers, * as fromDeletionLayers from "./deletionLayers";
import replacementLayers, * as fromReplacementLayers from "./replacementLayers";
import panelsShown, * as fromPanelsShown from "./panelsShown";
import lineageLines, * as fromLineageLines from "./lineageLines";

// import pickBy from 'lodash/pickBy'
// import startsWith from 'lodash/startsWith'
import createAction from "./utils/createMetaAction";

const vectorEditorInitialize = createAction("VECTOR_EDITOR_INITIALIZE");
const vectorEditorClear = createAction("VECTOR_EDITOR_CLEAR");

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
};

//define the reducer
let reducers = {
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
};

export default function reducerFactory(initialState) {
  if (!initialState || !Object.keys(initialState).length) {
    throw new Error(
      "Please pass an initial state to the vector editor reducer like: {DemoEditor: {}}!"
    );
  }
  return function(state = initialState, action) {
    let editorNames;
    let newState = {};
    if (action.meta && action.meta.EditorName) {
      editorNames = Array.isArray(action.meta.EditorName)
        ? action.meta.EditorName
        : [action.meta.EditorName];
    }
    let stateToReturn;
    if (editorNames) {
      //we're dealing with an action specific to a given editor
      editorNames.forEach(function(editorName) {
        let currentState = state[editorName];
        if (action.type === "VECTOR_EDITOR_INITIALIZE") {
          //merge the exisiting state with the new payload of props (if you want to do a clean wipe, use VECTOR_EDITOR_CLEAR)
          currentState = { ...state[editorName], ...(action.payload || {}) };
        }
        if (action.type === "VECTOR_EDITOR_CLEAR") {
          currentState = undefined;
        }
        newState[editorName] = combineReducers(reducers)(currentState, action);
      });
      stateToReturn = {
        ...state,
        ...newState
      };
    } else {
      //just a normal action
      Object.keys(state).forEach(function(editorName) {
        newState[editorName] = combineReducers(reducers)(
          state[editorName],
          action
        );
      });
      stateToReturn = newState;
    }
    return stateToReturn;
  };
}

// export const getBlankEditor = (state) => (state.blankEditor)
export const getEditorByName = (state, editorName) => state[editorName];
