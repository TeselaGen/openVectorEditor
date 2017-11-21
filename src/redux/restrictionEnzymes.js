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
      [filteredRestrictionEnzymesReset]: (state, payload) => initialState,
      [filteredRestrictionEnzymesUpdate]: (state, payload) => payload,
      [filteredRestrictionEnzymesAdd]: function(state, payload) {
        /* eslint-disable */

        if (!payload.value || !payload.label) debugger; //tnr: it must have these things
        /* eslint-enable */

        return [...state, payload];
      }
    },
    initialState
  ),

  allRestrictionEnzymes: createReducer(
    {
      [addRestrictionEnzyme]: function(state, payload) {
        if (
          !payload.name ||
          !payload.site ||
          !payload.forwardRegex ||
          !payload.reverseRegex ||
          (!payload.topSnipOffset && payload.topSnipOffset !== 0) ||
          (!payload.bottomSnipOffset && payload.bottomSnipOffset !== 0)
        )
          /* eslint-disable */

          debugger; //tnr: it should have all these properties
        /* eslint-enable */

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
