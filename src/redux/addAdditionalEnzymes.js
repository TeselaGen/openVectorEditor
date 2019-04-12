//./selectionLayer.js
import { createReducer, createAction } from "redux-act";
// ------------------------------------
// Actions
// ------------------------------------
export const addAdditionalEnzymesUpdate = createAction(
  "ADD_ADDITIONAL_ENZYMES_UPDATE"
);
export const addAdditionalEnzymesReset = createAction(
  "ADD_ADDITIONAL_ENZYMES_RESET"
);
export const addAdditionalEnzymesClose = createAction(
  "ADD_ADDITIONAL_ENZYMES_CLOSE",
  () => {}
);

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
    [addAdditionalEnzymesClose]: state => {
      return { ...state, isOpen: false };
    },
    [addAdditionalEnzymesReset]: (state, payload = {}) => {
      return { ...initialValues, ...payload };
    },
    [addAdditionalEnzymesUpdate]: (state, payload) => {
      return payload;
    }
  },
  initialValues
);
