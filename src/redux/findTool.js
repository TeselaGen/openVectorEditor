import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const toggleFindTool = createAction("TOGGLE_FIND_TOOL", () => {}); //NOTE!!:: second argument sanitizes actions so no payload is passed!
export const toggleHighlightAll = createAction("toggleHighlightAll", () => {}); //NOTE!!:: second argument sanitizes actions so no payload is passed!
export const updateSearchText = createAction("updateSearchText");
export const updateAmbiguousOrLiteral = createAction("updateAmbiguousOrLiteral");
export const updateDnaOrAA = createAction("updateDnaOrAA");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [toggleFindTool]: (state) => {
      return {
        ...state,
        isOpen: !state.isOpen
      };
    },
    [toggleHighlightAll]: (state) => {
      return {
        ...state,
        highlightAll: !state.highlightAll
      };
    },
    [updateAmbiguousOrLiteral]: (state, payload) => {
      return {
        ...state,
        ambiguousOrLiteral: payload,
      };
    },
    [updateDnaOrAA]: (state, payload) => {
      return {
        ...state,
        dnaOrAA: payload,
      };
    },
    [updateSearchText]: (state, payload) => {
      return {
        ...state,
        searchText: payload,
      };
    },
  },
  {
    isOpen: false,
    searchText: '',
    dnaOrAA: "DNA",
    ambiguousOrLiteral: "AMBIGUOUS",
    highlightAll: false
  }
);
