import { combineReducers } from "redux";
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";
import specialCutsiteFilterOptions from "../constants/specialCutsiteFilterOptions";
import defaultEnzymeList from "./utils/defaultEnzymeList.json";
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
export const addRestrictionEnzyme = createAction("ADD_RESTRICTION_ENZYME");
export const allRestrictionEnzymesUpdate = createAction(
  "ALL_RESTRICTION_ENZYMES_UPDATE"
);
// ------------------------------------
// Reducer
// ------------------------------------
let initialState = [specialCutsiteFilterOptions.single];
export default combineReducers({
  //filteredRestrictionEnzymes refer to the enzymes actively included in the react-select filter component
  filteredRestrictionEnzymes: createReducer(
    {
      [filteredRestrictionEnzymesReset]: () => initialState,
      [filteredRestrictionEnzymesUpdate]: (state, payload) => payload,
      [filteredRestrictionEnzymesAdd]: function(state, payload) {
        return [...state, payload];
      }
    },
    initialState
  ),

  allRestrictionEnzymes: createReducer(
    {
      [addRestrictionEnzyme]: function(state, payload) {
        return {
          ...state,
          [payload.name]: payload
        };
      },
      [allRestrictionEnzymesUpdate]: (state, payload) => payload
    },
    defaultEnzymeList
  )
});
