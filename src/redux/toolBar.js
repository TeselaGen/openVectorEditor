import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";
// ------------------------------------
// Actions
// ------------------------------------
export const openToolbarItemUpdate = createAction("openToolbarItemUpdate");

// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    
    [openToolbarItemUpdate]: (state, payload) => {
      return {
        ...state,
        openItem: payload
      };
    },
   
  },
  {
    openItem: "",
  }
);
