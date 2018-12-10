import { createReducer } from "redux-act";
import createAction from "../utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const sequenceDescriptionUpdate = createAction(
  "sequenceDescriptionUpdate"
);

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [sequenceDescriptionUpdate]: (state, payload) => {
      return payload;
    }
  },
  ""
);
