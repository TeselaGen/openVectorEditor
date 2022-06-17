import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

// ------------------------------------
// Actions
// ------------------------------------
// export const propertiesViewToggle = createAction(
//   "TOGGLE_PROPERTIES_VIEW",
//   () => {}
// ); //NOTE!!:: second argument sanitizes actions so no payload is passed
// export const propertiesViewOpen = createAction(
//   "Open_PROPERTIES_VIEW",
//   () => {}
// ); //NOTE!!:: second argument sanitizes actions so no payload is passed
export const propertiesViewTabUpdate = createAction("propertiesViewTabUpdate"); //NOTE!!:: second argument sanitizes actions so no payload is passed

// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    [propertiesViewTabUpdate]: (
      state,
      tabId,
      selectedAnnotationOrAnnotationId
    ) => {
      return {
        ...state,
        selectedAnnotationId: selectedAnnotationOrAnnotationId
          ? selectedAnnotationOrAnnotationId.id ||
            selectedAnnotationOrAnnotationId
          : undefined,
        tabId
      };
    }
  },
  {
    tabId: "general"
  }
);
