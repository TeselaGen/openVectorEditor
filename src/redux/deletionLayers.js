//./deletionLayers.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";
import omit from "lodash/omit";

// ------------------------------------
// Actions
// ------------------------------------
export const deletionLayerClear = createAction("deletionLayerClear");
export const deletionLayerUpdate = createAction("DELETION_LAYER_UPDATE");
export const deletionLayerDelete = createAction("DELETION_LAYER_DELETE");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [deletionLayerClear]: () => {
      return {};
    },
    [deletionLayerUpdate]: (state, payload) => {
      return {
        ...state,
        [payload.id]: {
          color: "firebrick",
          id: payload.id,
          ...payload.range
        }
      };
    },
    [deletionLayerDelete]: (state, payload) => {
      return omit(state, payload.id);
    }
  },
  {}
);
