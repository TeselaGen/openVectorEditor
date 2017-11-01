import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

// ------------------------------------
// Actions
// ------------------------------------
export const toggleFindTool = createAction("TOGGLE_FIND_TOOL", () => {}); //NOTE!!:: second argument sanitizes actions so no payload is passed!
export const toggleHighlightAll = createAction("toggleHighlightAll", () => {}); //NOTE!!:: second argument sanitizes actions so no payload is passed!
export const updateSearchText = createAction("updateSearchText");
export const updateAmbiguousOrLiteral = createAction(
  "updateAmbiguousOrLiteral"
);
export const updateDnaOrAA = createAction("updateDnaOrAA");
export const updateMatchNumber = createAction("updateMatchNumber");

// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    [toggleFindTool]: state => {
      return {
        ...state,
        isOpen: !state.isOpen
      };
    },
    [toggleHighlightAll]: state => {
      return {
        ...state,
        highlightAll: !state.highlightAll
      };
    },
    [updateAmbiguousOrLiteral]: (state, payload) => {
      return {
        ...state,
        matchNumber: 0,
        ambiguousOrLiteral: payload
      };
    },
    [updateDnaOrAA]: (state, payload) => {
      return {
        ...state,
        matchNumber: 0,
        dnaOrAA: payload
      };
    },
    [updateSearchText]: (state, payload) => {
      return {
        ...state,
        matchNumber: 0,
        searchText: payload
      };
    },
    [updateMatchNumber]: (state, payload) => {
      return {
        ...state,
        matchNumber: payload
      };
    }
  },
  {
    isOpen: false,
    searchText: "",
    dnaOrAA: "DNA",
    ambiguousOrLiteral: "LITERAL",
    highlightAll: false,
    matchNumber: 0
  }
);
