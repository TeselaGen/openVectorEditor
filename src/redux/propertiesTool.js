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
        propertiesSideBarOpen: !state.propertiesSideBarOpen
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
    propertiesSideBarOpen: false,
    // propertiesSideBarOpen: true,
    tabId: "features"
  }
);
