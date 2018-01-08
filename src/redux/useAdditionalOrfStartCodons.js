//./caretPosition.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const useAdditionalOrfStartCodonsToggle = createAction(
  "useAdditionalOrfStartCodonsToggle",
  () => {}
);

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [useAdditionalOrfStartCodonsToggle]: state => {
      return !state;
    }
  },
  false
);
