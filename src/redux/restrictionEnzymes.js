import { combineReducers } from "redux";
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";
import specialCutsiteFilterOptions from "../constants/specialCutsiteFilterOptions";
// ------------------------------------
// Actions
// ------------------------------------
export const filteredRestrictionEnzymesUpdate = createAction(
  "FILTERED_RESTRICTION_ENZYMES_UPDATE"
);
export const isEnzymeFilterAndUpdate = createAction("IS_ENZYME_FILTER_AND");
export const filteredRestrictionEnzymesReset = createAction(
  "FILTERED_RESTRICTION_ENZYMES_RESET"
);
export const filteredRestrictionEnzymesAdd = createAction(
  "FILTERED_RESTRICTION_ENZYMES_ADD"
);
// ------------------------------------
// Reducer
// ------------------------------------
const defaultInitialState = [specialCutsiteFilterOptions.single];
// let initialState = defaultInitialState;
// const localDefault = window.localStorage.getItem("tgInitialCutsiteFilter");

// if (localDefault) {
//   try {
//     initialState = JSON.parse(localDefault);
//     if (!Array.isArray(initialState)) throw new Error("Must be an array");
//   } catch (e) {
//     initialState = defaultInitialState;
//   }
// }

export default combineReducers({
  //filteredRestrictionEnzymes refer to the enzymes actively included in the react-select filter component
  isEnzymeFilterAnd: createReducer(
    {
      [isEnzymeFilterAndUpdate]: (state, payload) => payload
    },
    false
  ),
  filteredRestrictionEnzymes: createReducer(
    {
      [filteredRestrictionEnzymesReset]: () => defaultInitialState,
      [filteredRestrictionEnzymesUpdate]: (state, payload) => payload,
      [filteredRestrictionEnzymesAdd]: function (state, payload) {
        return [...state, payload];
      }
    },
    defaultInitialState
  )
});
