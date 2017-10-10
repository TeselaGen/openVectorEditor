import { combineReducers } from "redux";
import * as selectionLayer from "./selectionLayer";
import * as caretPosition from "./caretPosition";
import * as hoveredAnnotation from "./hoveredAnnotation";
import * as minimumOrfSize from "./minimumOrfSize";
import * as sequenceData from "./sequenceData";
import * as annotationVisibility from "./annotationVisibility";
import * as annotationLabelVisibility from "./annotationLabelVisibility";
import * as selectedAnnotations from "./selectedAnnotations";
import * as restrictionEnzymes from "./restrictionEnzymes";
import * as deletionLayers from "./deletionLayers";
import * as replacementLayers from "./replacementLayers";
import * as panelsShown from "./panelsShown";
import * as lineageLines from "./lineageLines";
import * as readOnly from "./readOnly";
import * as findTool from "./findTool";

import createAction from "./utils/createMetaAction";

const vectorEditorInitialize = createAction("VECTOR_EDITOR_INITIALIZE");
const vectorEditorClear = createAction("VECTOR_EDITOR_CLEAR");

//export the actions for use elsewhere
export const actions = {
  ...selectionLayer,
  ...caretPosition,
  ...restrictionEnzymes,
  ...selectedAnnotations,
  ...annotationLabelVisibility,
  ...annotationVisibility,
  ...sequenceData,
  ...minimumOrfSize,
  ...hoveredAnnotation,
  ...deletionLayers,
  ...replacementLayers,
  ...lineageLines,
  ...readOnly,
  ...panelsShown,
  ...findTool,
  vectorEditorInitialize,
  vectorEditorClear
};

//define the reducer
let reducers = {
  restrictionEnzymes: restrictionEnzymes.default,
  selectedAnnotations: selectedAnnotations.default,
  annotationLabelVisibility: annotationLabelVisibility.default,
  annotationVisibility: annotationVisibility.default,
  sequenceData: sequenceData.default,
  minimumOrfSize: minimumOrfSize.default,
  hoveredAnnotation: hoveredAnnotation.default,
  caretPosition: caretPosition.default,
  selectionLayer: selectionLayer.default,
  lineageLines: lineageLines.default,
  readOnly: readOnly.default,
  findTool: findTool.default,
  panelsShown: panelsShown.default,
  deletionLayers: deletionLayers.default,
  replacementLayers: replacementLayers.default,
  instantiated: () => true
};

export default function reducerFactory(initialState = {}) {
  // if (!initialState || !Object.keys(initialState).length) {
  //   throw new Error(
  //     "Please pass an initial state to the vector editor reducer like: {DemoEditor: {}}!"
  //   );
  // }
  return function(state = initialState, action) {
    let editorNames;
    let newState = {};
    if (action.meta && action.meta.editorName) {
      editorNames = Array.isArray(action.meta.editorName)
        ? action.meta.editorName
        : [action.meta.editorName];
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
