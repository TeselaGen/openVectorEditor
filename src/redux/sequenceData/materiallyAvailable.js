import { createReducer } from "redux-act";
import createAction from "../utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const updateAvailability = createAction("updateAvailability");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [updateAvailability]: (state, payload) => {
      return payload;
    }
  },
  true
);
