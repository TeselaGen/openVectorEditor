//./selectionLayer.js
import { createReducer, createAction } from "redux-act";
// ------------------------------------
// Actions
// ------------------------------------
export const addYourOwnEnzymeUpdate = createAction(
  "ADD_YOUR_OWN_ENZYME_UPDATE"
);
export const addYourOwnEnzymeReset = createAction("ADD_YOUR_OWN_ENZYME_RESET");
export const addYourOwnEnzymeClose = createAction(
  "ADD_YOUR_OWN_ENZYME_CLOSE",
  () => {}
);
export const addYourOwnEnzymeOpen = createAction("ADD_YOUR_OWN_ENZYME_OPEN");

// ------------------------------------
// Reducer
// ------------------------------------
const initialValues = {
  name: "Example Enzyme",
  sequence: "ggatcc",
  chop_top_index: 1,
  chop_bottom_index: 5,
  inputSequenceToTestAgainst: "",
  isOpen: false
};
export default createReducer(
  {
    [addYourOwnEnzymeClose]: state => {
      return { ...state, isOpen: false };
    },
    [addYourOwnEnzymeOpen]: state => {
      return { ...state, isOpen: true };
    },
    [addYourOwnEnzymeReset]: (state, payload = {}) => {
      return { ...initialValues, ...payload };
    },
    [addYourOwnEnzymeUpdate]: (state, payload) => {
      return payload;
    }
  },
  initialValues
);
