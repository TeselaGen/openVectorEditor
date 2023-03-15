//./selectionLayer.js
import { createReducer, createAction } from "redux-act";
// ------------------------------------
// Actions
// ------------------------------------
export const createYourOwnEnzymeUpdate = createAction(
  "CREATE_YOUR_OWN_ENZYME_UPDATE"
);
export const createYourOwnEnzymeReset = createAction(
  "CREATE_YOUR_OWN_ENZYME_RESET"
);
export const createYourOwnEnzymeClose = createAction(
  "CREATE_YOUR_OWN_ENZYME_CLOSE"
);

// ------------------------------------
// Reducer
// ------------------------------------
const initialValues = {
  name: "Example Enzyme",
  sequence: "ggatcc",
  chop_top_index: 1,
  chop_bottom_index: 5,
  isOpen: false
};
export default createReducer(
  {
    [createYourOwnEnzymeClose]: () => {
      return { ...initialValues, isOpen: false };
    },
    [createYourOwnEnzymeReset]: (state, payload = {}) => {
      return { ...initialValues, ...payload };
    },
    [createYourOwnEnzymeUpdate]: (state, payload) => {
      return payload;
    }
  },
  initialValues
);
