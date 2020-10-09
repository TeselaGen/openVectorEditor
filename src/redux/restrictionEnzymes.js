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
export const filteredRestrictionEnzymesReset = createAction(
  "FILTERED_RESTRICTION_ENZYMES_RESET"
);
export const filteredRestrictionEnzymesAdd = createAction(
  "FILTERED_RESTRICTION_ENZYMES_ADD"
);
export const allRestrictionEnzymesUpdate = createAction(
  "ALL_RESTRICTION_ENZYMES_UPDATE"
);
// ------------------------------------
// Reducer
// ------------------------------------
let initialState = [specialCutsiteFilterOptions.single];
// const userEnzymeGroups = window.localStorage.getItem("restrictionEnzymeGroups") || []

export default combineReducers({
  //filteredRestrictionEnzymes refer to the enzymes actively included in the react-select filter component
  filteredRestrictionEnzymes: createReducer(
    {
      [filteredRestrictionEnzymesReset]: () => initialState,
      [filteredRestrictionEnzymesUpdate]: (state, payload) => payload,
      [filteredRestrictionEnzymesAdd]: function (state, payload) {
        return [...state, payload];
      }
    },
    initialState
  )
});
