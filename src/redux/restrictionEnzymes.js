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
// ------------------------------------
// Reducer
// ------------------------------------
const defaultInitialState = [specialCutsiteFilterOptions.single];
let initialState = defaultInitialState;
const localDefault = window.localStorage.getItem("tgInitialCutsiteFilter");
const sessionDefault = window.sessionStorage.getItem("tgInitialCutsiteFilter");

if (sessionDefault || localDefault) {
  try {
    initialState = JSON.parse(sessionDefault || localDefault);
    if (!Array.isArray(initialState)) throw new Error("Must be an array");
  } catch (e) {
    initialState = defaultInitialState;
  }
}

const persist = (s) => {
  try {
    window.sessionStorage.setItem("tgInitialCutsiteFilter", JSON.stringify(s));
  } catch (e) {
    console.warn(`e 1201240098 - Something went wrong setting initial enzymes`);
  }
  return s;
};

export default combineReducers({
  //filteredRestrictionEnzymes refer to the enzymes actively included in the react-select filter component
  filteredRestrictionEnzymes: createReducer(
    {
      [filteredRestrictionEnzymesReset]: () => persist(defaultInitialState),
      [filteredRestrictionEnzymesUpdate]: (state, payload) => persist(payload),
      [filteredRestrictionEnzymesAdd]: function (state, payload) {
        return persist([...state, payload]);
      }
    },
    initialState
  )
});
