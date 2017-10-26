//./caretPosition.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const propertiesViewToggle = createAction(
  "TOGGLE_PROPERTIES_VIEW",
  () => {}
); //NOTE!!:: second argument sanitizes actions so no payload is passed
export const propertiesViewTabUpdate = createAction("propertiesViewTabUpdate"); //NOTE!!:: second argument sanitizes actions so no payload is passed

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [propertiesViewToggle]: state => {
      return {
        ...state,
        isOpen: !state.isOpen
      };
    },
    [propertiesViewTabUpdate]: (state, tabId) => {
      return {
        ...state,
        tabId
      };
    }
  },
  {
    isOpen: true,
    tabId: "features"
  }
);
