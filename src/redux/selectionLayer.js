//./selectionLayer.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const selectionLayerClear = createAction("SELECTION_LAYER_CLEAR");
export const selectionLayerUpdate = createAction("SELECTION_LAYER_UPDATE");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    CARET_POSITION_UPDATE: () => {
      //clear the selection layer if the caret is updated!
      return {
        start: -1,
        end: -1
      };
    },
    [selectionLayerClear]: () => {
      return {
        start: -1,
        end: -1
      };
    },
    [selectionLayerUpdate]: (state, newSelectionLayer) => {
      if (
        !newSelectionLayer ||
        !(newSelectionLayer.start >= 0 && newSelectionLayer.end >= 0)
      ) {
        console.error(
          "we should never be here! selectionLayerUpdate must always be called with a valid selection layer"
        );
        return state;
      }
      return newSelectionLayer;
    }
  },
  {
    start: -1,
    end: -1
  }
);
