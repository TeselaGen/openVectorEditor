import { showContextMenu } from "teselagen-react-components";
import without from "lodash/without";
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const annotationSelect = createAction("VE_ANNOTATION_SELECT");
export const updateSelectedAnnotation = createAction(
  "VE_ANNOTATION_UPDATE_SELECTED"
);
export const annotationDeselect = createAction("VE_ANNOTATION_DESELECT");
export const annotationDeselectAll = createAction("VE_ANNOTATION_DESELECT_ALL");

export function replacementLayerRightClicked({ event, annotation }, meta) {
  event.preventDefault();
  event.stopPropagation();
  return function(dispatch /* getState */) {
    let items = [
      {
        text: "Remove Edit",
        onClick: function() {
          dispatch({
            type: "REPLACEMENT_LAYER_DELETE",
            meta,
            payload: { ...annotation }
          });
        }
      }
    ];

    showContextMenu(items, undefined, event);
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
const startingState = {
  idMap: {},
  idStack: []
};
export default createReducer(
  {
    [annotationSelect]: (state, payload) => {
      if (!payload.id) throw new Error("Annotation must have an id!");
      let newState = {
        idMap: {
          ...state.idMap,
          [payload.id]: payload
        },
        idStack: [...state.idStack, payload.id]
      };
      return newState;
    },
    [annotationDeselect]: (state, payload) => {
      let id = payload.id || payload;
      let idMap = { ...state.idMap };
      delete idMap[id];
      let idStack = without(state.idStack, id);
      return {
        idMap,
        idStack
      };
    },
    [updateSelectedAnnotation]: (state, payload) => {
      let id = payload.id;
      let idMap = { ...state.idMap };
      if (!idMap[id]) {
        return state;
      }
      return {
        idMap: {
          ...idMap,
          [id]: {
            ...idMap[id],
            ...payload
          }
        },
        idStack: state.idStack
      };
    },
    [annotationDeselectAll]: () => {
      return startingState;
    }
  },
  startingState
);
