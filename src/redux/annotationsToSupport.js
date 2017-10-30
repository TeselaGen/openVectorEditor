import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

//this determines whether or not to
const initialSupportedTypes = {
  parts: true,
  features: true,
  translations: true,
  primers: true,
  cutsites: true,
  orfs: true
};

// ------------------------------------
// Actions
// ------------------------------------
export const annotationSupportToggle = createAction("annotationSupportToggle");
//eg: annotationSupportToggle('features')
export const annotationSupportOn = createAction("annotationSupportOn");
export const annotationSupportOff = createAction("annotationSupportOff");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [annotationSupportToggle]: (state, payload) => {
      return {
        ...state,
        [payload]: !state[payload]
      };
    },
    [annotationSupportOn]: (state, payload) => {
      return {
        ...state,
        [payload]: false
      };
    },
    [annotationSupportOff]: (state, payload) => {
      return {
        ...state,
        [payload]: true
      };
    }
  },
  initialSupportedTypes
);
